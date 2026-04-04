const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', 
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Trùng với tên model User của bạn
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reservation', // Liên kết đến đơn hàng trong schemas/reservation.js
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true // Nên để bắt buộc để nội dung đánh giá chất lượng hơn
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('productreviews', productReviewSchema);