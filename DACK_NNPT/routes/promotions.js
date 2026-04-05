var express = require('express');
var router = express.Router();
let promotionModel = require('../schemas/promotions');
let { CheckLogin, checkRole } = require('../utils/authHandler');

// GET all promotions
router.get('/', async function (req, res, next) {
    try {
        let titleQ = req.query.title ? req.query.title : '';
        let result = await promotionModel.find({
            isDeleted: false,
            title: new RegExp(titleQ, 'i')
        });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET promotion by ID (Admin only)
router.get('/:id', CheckLogin, checkRole('admin'), async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await promotionModel.findOne({
            _id: id,
            isDeleted: false
        });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// GET validate promotion code (Dung cho Checkout - Yeu cau dang nhap)
router.get('/validate/:code', CheckLogin, async function (req, res, next) {
    try {
        let code = req.params.code.toUpperCase();
        let promotion = await promotionModel.findOne({
            code: code,
            isDeleted: false,
            status: true
        });

        if (!promotion) {
            return res.status(404).send({ message: "Ma khuyen mai khong ton tai" });
        }

        // Check hieu luc thoi gian
        let now = new Date();
        if (now < promotion.startDate) {
            return res.status(400).send({ message: "Chuong trinh chua bat dau" });
        }
        if (now > promotion.endDate) {
            return res.status(400).send({ message: "Ma khuyen mai da het han" });
        }

        // Check luot dung
        if (promotion.usageLimit !== null && promotion.usedCount >= promotion.usageLimit) {
            return res.status(400).send({ message: "Ma khuyen mai da het luot su dung" });
        }

        res.send({
            message: "Ma hop le",
            promotion: promotion
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST create promotion (Admin only)
router.post('/', CheckLogin, checkRole('admin'), async function (req, res, next) {
    try {
        let newPromotion = new promotionModel({
            code: req.body.code,
            title: req.body.title,
            description: req.body.description,
            discountType: req.body.discountType,
            discountValue: req.body.discountValue,
            minOrderValue: req.body.minOrderValue,
            maxDiscountValue: req.body.maxDiscountValue,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            usageLimit: req.body.usageLimit,
            status: req.body.status
        });
        let result = await newPromotion.save();
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT update promotion (Admin only)
router.put('/:id', CheckLogin, checkRole('admin'), async function (req, res, next) {
    try {
        let id = req.params.id;
        let updateData = { ...req.body };
        delete updateData._id;

        let result = await promotionModel.findByIdAndUpdate(id, updateData, { new: true });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE soft delete promotion (Admin only)
router.delete('/:id', CheckLogin, checkRole('admin'), async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await promotionModel.findByIdAndUpdate(id, {
            isDeleted: true
        }, { new: true });
        
        if (result) {
            res.send({ message: "Xoa thanh cong", result });
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
