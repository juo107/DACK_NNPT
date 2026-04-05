let mongoose = require('mongoose');

let promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: [true, "code khong duoc trung"],
        required: [true, "code khong duoc rong"],
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, "title khong duoc rong"]
    },
    description: {
        type: String,
        default: ""
    },
    discountType: {
        type: String,
        enum: {
            values: ['percentage', 'fixed'],
            message: '{VALUE} khong duoc ho tro'
        },
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: [true, "gia tri giam gia khong duoc rong"],
        min: [0, "gia tri giam gia khong duoc nho hon 0"]
    },
    minOrderValue: {
        type: Number,
        default: 0,
        min: [0, "gia tri don hang khong duoc nho hon 0"]
    },
    maxDiscountValue: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        required: [true, "ngay bat dau khong duoc rong"],
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, "ngay ket thuc khong duoc rong"]
    },
    usageLimit: {
        type: Number,
        default: 100 // Mac dinh 100 luot dung
    },
    usedCount: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual check hieu luc
promotionSchema.virtual('isValid').get(function () {
    let now = new Date();
    return this.status &&
        !this.isDeleted &&
        now >= this.startDate &&
        now <= this.endDate &&
        (this.usageLimit === null || this.usedCount < this.usageLimit);
});

module.exports = new mongoose.model(
    'promotion', promotionSchema
);
