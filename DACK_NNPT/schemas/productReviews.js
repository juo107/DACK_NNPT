let mongoose = require('mongoose');

let productReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: [true, "product khong duoc rong"]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, "user khong duoc rong"]
    },
    order: {
        type: mongoose.Types.ObjectId,
        ref: 'reservation',
        default: null
    },
    rating: {
        type: Number,
        required: [true, "rating khong duoc rong"],
        min: [1, "rating khong duoc nho hon 1"],
        max: [5, "rating khong duoc lon hon 5"]
    },
    comment: {
        type: String,
        required: [true, "comment khong duoc rong"],
        maxlength: [1000, "comment khong duoc qua 1000 ky tu"],
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Unique index: 1 user chi review 1 product 1 lan
productReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('productreviews', productReviewSchema);