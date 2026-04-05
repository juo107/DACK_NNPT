let express = require('express')
let router = express.Router()
let cartModel = require('../schemas/carts')
let { CheckLogin } = require('../utils/authHandler')
let inventoryModel = require('../schemas/inventories')

router.get('/', CheckLogin, async function (req, res, next) {
    let user = req.user;
    let cart = await cartModel.findOne({
        user: user._id
    }).populate('items.product');
    res.send(cart.items)
})
router.post('/add', CheckLogin, async function (req, res, next) {
    let { product, quantity } = req.body;
    let getProduct = await inventoryModel.findOne({
        product: product
    })
    if (!getProduct) {
        res.status(404).send("product khong ton tai");
        return;
    }
    let user = req.user;
    let cart = await cartModel.findOne({
        user: user._id
    })
    let index = cart.items.findIndex(
        function (e) {
            return e.product == product
        }
    )
    if (index > -1) {
        if (getProduct.stock >= (cart.items[index].quantity + quantity)) {
            cart.items[index].quantity += quantity
            await cart.save();
            res.send(cart)
        } else {
            res.status(404).send("product khong con du hang");
        }
    } else {
        if (getProduct.stock >= quantity) {
            cart.items.push({
                product: product,
                quantity: quantity
            })
            await cart.save();
            res.send(cart)
        } else {
            res.status(404).send("product khong con du hang");
        }

    }
})
router.post('/remove', CheckLogin, async function (req, res, next) {
    let { product, quantity } = req.body;
    let getProduct = await inventoryModel.findOne({
        product: product
    })
    if (!getProduct) {
        res.status(404).send("product khong ton tai");
        return;
    }
    let user = req.user;
    let cart = await cartModel.findOne({
        user: user._id
    })
    let index = cart.items.findIndex(
        function (e) {
            return e.product == product
        }
    )
    if (index > -1) {
        if (cart.items[index].quantity > quantity) {
            cart.items[index].quantity -= quantity;
            await cart.save()
            res.send(cart);
        } else {
            if (cart.items[index].quantity == quantity) {
                cart.items.splice(index, 1);
                await cart.save();
                res.send(cart);
            } else {
                res.status(404).send("khong duoc xoa ve am");
            }
        }
    } else {
        res.status(404).send("product khong ton tai");
    }
})

// POST: Clear all items from cart
router.post('/clear', CheckLogin, async function (req, res, next) {
    try {
        let user = req.user;
        let result = await cartModel.findOneAndUpdate(
            { user: user._id },
            { $set: { items: [] } },
            { new: true }
        );
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;