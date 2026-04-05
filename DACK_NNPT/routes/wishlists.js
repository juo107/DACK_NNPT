let express = require('express')
let router = express.Router()
let wishlistModel = require('../schemas/wishlists')
let wishlistItemModel = require('../schemas/wishlistItems')
let productModel = require('../schemas/products')
let { CheckLogin } = require('../utils/authHandler')

router.get('/', CheckLogin, async function (req, res, next) {
    let user = req.user
    let w = await wishlistModel.findOne({
        user: user._id
    })
    if (!w) {
        res.send([])
        return
    }
    let items = await wishlistItemModel.find({
        wishlist: w._id
    }).populate('product')
    res.send(items)
})

router.post('/add', CheckLogin, async function (req, res, next) {
    let { product } = req.body
    let getProduct = await productModel.findOne({
        _id: product,
        isDeleted: false
    })
    if (!getProduct) {
        res.status(404).send("product khong ton tai")
        return
    }
    let user = req.user
    let w = await wishlistModel.findOne({
        user: user._id
    })
    if (!w) {
        w = await wishlistModel.create({
            user: user._id
        })
    }
    try {
        let item = await wishlistItemModel.create({
            wishlist: w._id,
            product: product
        })
        let populated = await wishlistItemModel.findById(item._id).populate('product')
        res.send(populated)
    } catch (err) {
        if (err.code === 11000) {
            res.send("da co trong wishlist")
            return
        }
        next(err)
    }
})

router.post('/remove', CheckLogin, async function (req, res, next) {
    let { product } = req.body
    let user = req.user
    let w = await wishlistModel.findOne({
        user: user._id
    })
    if (!w) {
        res.status(404).send("wishlist khong ton tai")
        return
    }
    let result = await wishlistItemModel.deleteOne({
        wishlist: w._id,
        product: product
    })
    if (result.deletedCount === 0) {
        res.status(404).send("product khong ton tai trong wishlist")
        return
    }
    res.send("ok")
})

router.post('/clear', CheckLogin, async function (req, res, next) {
    let user = req.user
    let w = await wishlistModel.findOne({
        user: user._id
    })
    if (!w) {
        res.send({ deletedCount: 0 })
        return
    }
    let result = await wishlistItemModel.deleteMany({
        wishlist: w._id
    })
    res.send({ deletedCount: result.deletedCount })
})

module.exports = router
