var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let reservationModel = require('../schemas/reservation');
let inventoryModel = require('../schemas/inventories');
let productModel = require('../schemas/products');
let { CheckLogin, checkRole } = require('../utils/authHandler');

// POST: Tạo đơn đặt hàng mới (Giao dịch thủ công - Không cần Replica Set)
router.post('/', CheckLogin, async function (req, res) {
    try {
        let itemsToReserve = req.body.items;
        
        // 1. Chuẩn hóa dữ liệu đầu vào
        if (!itemsToReserve && req.body.product) {
            itemsToReserve = [{ product: req.body.product, quantity: req.body.quantity }];
        }

        if (!itemsToReserve || !Array.isArray(itemsToReserve) || itemsToReserve.length === 0) {
            throw new Error("Danh sách sản phẩm không hợp lệ");
        }

        const userId = req.user._id;
        let reservationItems = [];
        let totalAmount = 0;
        let updatedInventories = []; // Theo dõi các sản phẩm đã trừ kho để hoàn tác nếu cần

        // 2. BƯỚC KIỂM TRA (PRE-CHECK): Đảm bảo tất cả đều đủ hàng trước khi trừ
        for (const item of itemsToReserve) {
            const productId = item.product?._id || item.product;
            const quantity = parseInt(item.quantity);

            const inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory || inventory.stock < quantity) {
                const product = await productModel.findById(productId);
                throw new Error(`Sản phẩm ${product?.title || productId} không đủ tồn kho (Còn lại: ${inventory?.stock || 0})`);
            }
        }

        // 3. BƯỚC THỰC THI (EXECUTION): Trừ kho cho từng sản phẩm
        try {
            for (const item of itemsToReserve) {
                const productId = item.product?._id || item.product;
                const quantity = parseInt(item.quantity);

                const product = await productModel.findById(productId);
                const inventory = await inventoryModel.findOneAndUpdate(
                    { product: productId, stock: { $gte: quantity } },
                    { $inc: { stock: -quantity, reserved: quantity } },
                    { new: true }
                );

                if (!inventory) throw new Error(`Lỗi hệ thống khi cập nhật kho cho ${product.title}`);

                // Lưu lại lịch sử để nếu có lỗi bản ghi sau thì cộng lại kho (Rollback thủ công)
                updatedInventories.push({ productId, quantity });

                const itemPrice = product.salePrice || product.price;
                const subtotal = itemPrice * quantity;
                
                reservationItems.push({
                    product: productId,
                    title: product.title,
                    quantity: quantity,
                    price: itemPrice,
                    subtotal: subtotal
                });
                totalAmount += subtotal;
            }

            // 4. Tạo bản ghi Reservation tổng hợp
            const reservation = new reservationModel({
                user: userId,
                items: reservationItems,
                amount: totalAmount,
                status: 'actived',
                expiredIn: new Date(Date.now() + 24 * 60 * 60 * 1000), 
                shippingInfo: req.body.shippingInfo
            });

            await reservation.save();
            res.status(201).send(reservation);

        } catch (procError) {
            // HOÀN TÁC THỦ CÔNG (MANUAL ROLLBACK): Nếu lỗi trong lúc trừ kho
            for (const updated of updatedInventories) {
                await inventoryModel.findOneAndUpdate(
                    { product: updated.productId },
                    { $inc: { stock: updated.quantity, reserved: -updated.quantity } }
                );
            }
            throw procError;
        }

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// GET: Lấy danh sách đặt hàng của User hiện tại
router.get('/', CheckLogin, async function (req, res) {
    try {
        const reservations = await reservationModel.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.send(reservations);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// --- ADMIN ROUTES ---

// GET: Lấy TẤT CẢ đơn đặt hàng (Admin)
router.get('/admin/all', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const reservations = await reservationModel.find()
            .populate('user', 'username email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.send(reservations);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// PUT: Cập nhật trạng thái đơn (Admin)
router.put('/admin/status/:id', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const { status } = req.body;
        const reservation = await reservationModel.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        ).populate('user', 'username email').populate('items.product');
        
        if (!reservation) return res.status(404).send({ message: "Không tìm thấy đơn hàng" });
        res.send(reservation);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// DELETE: Xóa đơn hàng (Admin)
router.delete('/admin/:id', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const result = await reservationModel.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).send({ message: "Không tìm thấy đơn hàng" });
        res.send({ message: "Xóa thành công", id: req.params.id });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;