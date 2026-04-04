// Trong file routes/productReviews.js
const express = require('express');
const router = express.Router();
const ProductReview = require('../schemas/productReviews');
const Reservation = require('../schemas/reservation');
const { CheckLogin } = require('../utils/authHandler');

// API: Gửi đánh giá mới
router.post('/add-review', CheckLogin, async (req, res) => {
    try {
        const { productId, orderId, rating, comment } = req.body;
        const userId = req.user._id;

        if (!productId || !orderId || !rating || !comment) {
            return res.status(400).json({ message: "Thiếu thông tin đánh giá. Cần productId, orderId, rating và comment." });
        }

        const reservation = await Reservation.findOne({ _id: orderId, user: userId });
        if (!reservation) {
            return res.status(400).json({ message: "Đơn hàng không tồn tại hoặc không thuộc về bạn." });
        }

        if (reservation.status !== 'paid') {
            return res.status(400).json({ message: "Chỉ có thể đánh giá khi đơn hàng đã thanh toán thành công." });
        }

        const item = reservation.items.find(i => i.product.toString() === productId.toString());
        if (!item) {
            return res.status(400).json({ message: "Sản phẩm này không nằm trong đơn hàng được chọn." });
        }

        const existingReview = await ProductReview.findOne({ product: productId, order: orderId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi!" });
        }

        const newReview = new ProductReview({
            product: productId,
            user: userId,
            order: orderId,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({ message: "Cảm ơn bạn đã đánh giá sản phẩm!", review: newReview });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// API: Lấy danh sách review của một sản phẩm
router.get('/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviews = await ProductReview.find({ product: productId })
            .populate('user', 'username fullName email');

        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        res.json({ reviews, averageRating: Number(averageRating.toFixed(1)), totalReviews: reviews.length });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy review", error: error.message });
    }
});

module.exports = router;