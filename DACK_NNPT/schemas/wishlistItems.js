let mongoose = require('mongoose');

// Mỗi document = một sản phẩm trong một wishlist (chi tiết, tách khỏi header).
let wishlistItemSchema = mongoose.Schema({
    // Wishlist chứa dòng này (ref collection wishlists).
    wishlist: {
        type: mongoose.Types.ObjectId,
        ref: 'wishlist',
        required: true
    },
    // Sản phẩm được thêm vào wishlist (ref collection products).
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true
    }
}, {
    // createdAt / updatedAt cho dòng chi tiết.
    timestamps: true
});

// Unique (wishlist, product): cùng một wishlist không trùng hai dòng cùng sản phẩm.
wishlistItemSchema.index({ wishlist: 1, product: 1 }, { unique: true });

module.exports = new mongoose.model('wishlistItem', wishlistItemSchema);
