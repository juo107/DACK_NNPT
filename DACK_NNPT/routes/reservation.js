var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let reservationModel = require('../schemas/reservation');
let inventoryModel = require('../schemas/inventories');
let productModel = require('../schemas/products');
let promotionModel = require('../schemas/promotions');
let cartModel = require('../schemas/carts');
let { CheckLogin, checkRole } = require('../utils/authHandler');

// POST: Tạo đơn đặt hàng mới (Giao dịch thủ công - Không cần Replica Set)
router.post('/', CheckLogin, async function (req, res) {
    try {
        let itemsToReserve = req.body.items;
        let promotionId = req.body.promotionId; // Nhận thêm promotionId nếu có

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

            // 4. Tính toán giảm giá từ Promotion (nếu có)
            let discountAmount = 0;
            let promotionDoc = null;
            if (promotionId) {
                promotionDoc = await promotionModel.findOne({
                    _id: promotionId,
                    isDeleted: false,
                    status: true
                });

                if (promotionDoc) {
                    const now = new Date();
                    const isValidTime = now >= promotionDoc.startDate && now <= promotionDoc.endDate;
                    const isUnderLimit = promotionDoc.usageLimit === null || promotionDoc.usedCount < promotionDoc.usageLimit;
                    const isMinOrderMet = totalAmount >= promotionDoc.minOrderValue;

                    if (isValidTime && isUnderLimit && isMinOrderMet) {
                        if (promotionDoc.discountType === 'percentage') {
                            discountAmount = Math.floor(totalAmount * (promotionDoc.discountValue / 100));
                            if (promotionDoc.maxDiscountValue > 0 && discountAmount > promotionDoc.maxDiscountValue) {
                                discountAmount = promotionDoc.maxDiscountValue;
                            }
                        } else {
                            discountAmount = promotionDoc.discountValue;
                        }

                        // Cập nhật số lượt dùng (Atomic increment)
                        await promotionModel.findByIdAndUpdate(promotionId, { $inc: { usedCount: 1 } });
                    }
                }
            }

            // Tính phí vận chuyển (Giống logic CartContext: > 1tr free, ngược lại 30k)
            const shippingFee = (totalAmount > 1000000) ? 0 : 30000;
            const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount);

            // 5. Tạo bản ghi Reservation tổng hợp
            const reservation = new reservationModel({
                user: userId,
                items: reservationItems,
                promotion: promotionDoc ? promotionDoc._id : null,
                discountAmount: discountAmount,
                amount: finalAmount,
                status: 'actived',
                expiredIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
                shippingInfo: req.body.shippingInfo
            });

            await reservation.save();

            // 6. TỰ ĐỘNG XÓA GIỎ HÀNG SAU KHI ĐẶT THÀNH CÔNG
            await cartModel.findOneAndUpdate(
                { user: userId },
                { $set: { items: [] } }
            );

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
            .populate('promotion')
            .sort({ createdAt: -1 });
        res.send(reservations);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// PUT: Cập nhật trạng thái đơn (Admin - Kèm logic cập nhật Kho)
router.put('/admin/status/:id', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const { status: newStatus } = req.body;
        const reservationId = req.params.id;

        // 1. Lấy đơn hàng hiện tại để kiểm tra trạng thái cũ
        const currentRes = await reservationModel.findById(reservationId);
        if (!currentRes) return res.status(404).send({ message: "Không tìm thấy đơn hàng" });

        const oldStatus = currentRes.status;

        // Chỉ xử lý nếu trạng thái thực sự thay đổi và trạng thái cũ là 'actived'
        // (Tránh việc Hủy rồi lại Thanh toán gây sai lệch số liệu kho)
        if (oldStatus === 'actived' && oldStatus !== newStatus) {
            
            // 2. DUYỆT CÁC SẢN PHẨM TRONG ĐƠN ĐỂ CẬP NHẬT KHO
            for (const item of currentRes.items) {
                const productId = item.product;
                const quantity = item.quantity;

                if (newStatus === 'paid') {
                    // TRƯỜNG HỢP 1: HOÀN TẤT THANH TOÁN (Sold)
                    // Giảm Reserved đã giữ từ trước, và Tăng SoldCount
                    await inventoryModel.findOneAndUpdate(
                        { product: productId },
                        { $inc: { reserved: -quantity, soldCount: quantity } }
                    );
                } else if (newStatus === 'cancelled' || newStatus === 'expired') {
                    // TRƯỜNG HỢP 2: HỦY ĐƠN / HẾT HẠN
                    // Giảm Reserved đã giữ, và Trả lại số lượng vào Stock (Tồn kho)
                    await inventoryModel.findOneAndUpdate(
                        { product: productId },
                        { $inc: { reserved: -quantity, stock: quantity } }
                    );
                }
            }
        }

        // 3. Cập nhật trạng thái mới cho Đơn hàng
        const updatedReservation = await reservationModel.findByIdAndUpdate(
            reservationId,
            { status: newStatus },
            { new: true }
        ).populate('user', 'username email').populate('items.product').populate('promotion');

        res.send(updatedReservation);
    } catch (error) {
        console.error('Update status error:', error);
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