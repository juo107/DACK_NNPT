var express = require('express');
var router = express.Router();
let inventoryModel = require('../schemas/inventories');
let { CheckLogin, checkRole } = require('../utils/authHandler');

// 1. Get all inventories (Admin only)
router.get('/', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const result = await inventoryModel.find().populate('product');
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Get inventory by ID (Admin only)
router.get('/:id', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const result = await inventoryModel.findById(req.params.id).populate('product');
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "Không tìm thấy thông tin kho" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 3. Add stock: {product, quantity} (Admin only)
router.post('/add-stock', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const { product, quantity } = req.body;
        const result = await inventoryModel.findOneAndUpdate(
            { product: product },
            { $inc: { stock: quantity } },
            { new: true, runValidators: true }
        ).populate('product');

        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "Không tìm thấy thông tin kho cho sản phẩm này" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 4. Remove stock: {product, quantity} (Admin only)
router.post('/remove-stock', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const { product, quantity } = req.body;
        const inv = await inventoryModel.findOne({ product: product });
        
        if (!inv || inv.stock < quantity) {
            return res.status(400).send({ message: "Số lượng tồn kho không đủ" });
        }

        const result = await inventoryModel.findOneAndUpdate(
            { product: product },
            { $inc: { stock: -quantity } },
            { new: true, runValidators: true }
        ).populate('product');

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 5. Reservation: {product, quantity} (Admin only)
router.post('/reservation', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const { product, quantity } = req.body;
        const inv = await inventoryModel.findOne({ product: product });

        if (!inv || inv.stock < quantity) {
            return res.status(400).send({ message: "Số lượng tồn kho không đủ để đặt chỗ" });
        }

        const result = await inventoryModel.findOneAndUpdate(
            { product: product },
            { 
                $inc: { 
                    stock: -quantity, 
                    reserved: quantity 
                } 
            },
            { new: true, runValidators: true }
        ).populate('product');

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 6. Sold: {product, quantity} (Admin only)
router.post('/sold', CheckLogin, checkRole('admin'), async function (req, res) {
    try {
        const { product, quantity } = req.body;
        const inv = await inventoryModel.findOne({ product: product });

        if (!inv || inv.reserved < quantity) {
            return res.status(400).send({ message: "Số lượng hàng đặt chỗ không đủ để thực hiện bán hàng" });
        }

        const result = await inventoryModel.findOneAndUpdate(
            { product: product },
            { 
                $inc: { 
                    reserved: -quantity, 
                    soldCount: quantity 
                } 
            },
            { new: true, runValidators: true }
        ).populate('product');

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
