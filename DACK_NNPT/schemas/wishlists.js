let mongoose = require('mongoose');

// Header wishlist: một user chỉ một document (user unique).
// Các sản phẩm yêu thích nằm ở collection wishlistitems (wishlist + product).
// timestamps: createdAt / updatedAt cho document header.
let wishlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        unique: true,
        required: true
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model('wishlist', wishlistSchema);
