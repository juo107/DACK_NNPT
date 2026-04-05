const express = require('express');
const router = express.Router();
const ProductReview = require('../schemas/productReviews');
const Reservation = require('../schemas/reservation');
const { CheckLogin, checkRole } = require('../utils/authHandler');
const mongoose = require('mongoose');

// CREATE - Tạo review mới
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

// READ - Lấy danh sách review của một sản phẩm
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

// READ - Lấy tổng hợp đánh giá theo sản phẩm (Admin)
router.get('/summary', CheckLogin, checkRole('admin'), async (req, res) => {
    try {
        const { minRating, sortBy } = req.query;
        
        // Lấy tất cả review kèm thông tin sản phẩm
        const allReviews = await ProductReview.find()
            .populate('product', 'title imageUrl price');

        // Nhóm dữ liệu bằng JavaScript
        const summaryMap = {};
        allReviews.forEach(review => {
            if (!review.product) return;
            const pid = review.product._id.toString();
            if (!summaryMap[pid]) {
                summaryMap[pid] = {
                    productId: pid,
                    title: review.product.title,
                    imageUrl: review.product.imageUrl,
                    price: review.product.price,
                    totalStars: 0,
                    reviewCount: 0
                };
            }
            summaryMap[pid].totalStars += review.rating;
            summaryMap[pid].reviewCount += 1;
        });

        // Tính điểm trung bình và chuyển thành mảy
        let summary = Object.values(summaryMap).map(item => ({
            ...item,
            avgRating: Number((item.totalStars / item.reviewCount).toFixed(1))
        }));

        // Lọc theo số sao tối thiểu (nếu có)
        if (minRating) {
            summary = summary.filter(item => item.avgRating >= parseFloat(minRating));
        }

        // Sắp xếp
        if (sortBy === 'rating') {
            summary.sort((a, b) => b.avgRating - a.avgRating);
        } else if (sortBy === 'count') {
            summary.sort((a, b) => b.reviewCount - a.reviewCount);
        }

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy tổng hợp đánh giá", error: error.message });
    }
});

// UPDATE - Cập nhật review
router.put('/:reviewId', CheckLogin, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "ID review không hợp lệ" });
        }

        const review = await ProductReview.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review không tồn tại" });
        }

        if (review.user.toString() !== userId.toString()) {
            const user = req.user;
            if (user.role !== 'admin') {
                return res.status(403).json({ message: "Bạn không có quyền sửa review này" });
            }
        }

        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Rating phải từ 1 đến 5" });
            }
            review.rating = rating;
        }

        if (comment !== undefined) {
            if (typeof comment !== 'string' || comment.trim().length === 0) {
                return res.status(400).json({ message: "Comment không được để trống" });
            }
            review.comment = comment;
        }

        await review.save();

        const updatedReview = await ProductReview.findById(reviewId)
            .populate('product', 'title imageUrl priceVnd')
            .populate('user', 'username fullName email');

        res.json({ message: "Cập nhật review thành công", review: updatedReview });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// DELETE - Xóa review
router.delete('/:reviewId', CheckLogin, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "ID review không hợp lệ" });
        }

        const review = await ProductReview.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review không tồn tại" });
        }

        if (review.user.toString() !== userId.toString()) {
            const user = req.user;
            if (user.role !== 'admin') {
                return res.status(403).json({ message: "Bạn không có quyền xóa review này" });
            }
        }

        await ProductReview.findByIdAndDelete(reviewId);
        res.json({ message: "Xóa review thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;
