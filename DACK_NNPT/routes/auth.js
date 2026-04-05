var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, validatedResult, ChangePasswordValidator } = require('../utils/validator')
let { CheckLogin } = require('../utils/authHandler')
let crypto = require('crypto')
let { sendMail } = require('../utils/sendMail')
let cartModel = require('../schemas/carts')
let wishlistModel = require('../schemas/wishlists')
//login
router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let result = await userController.QueryLogin(username, password);
    if (!result) {
        res.status(404).send("thong tin dang nhap khong dung")
    } else {
        res.cookie("TOKEN_NNPTUD_C3", result, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false
        })
        res.send(result)
    }
})
router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let roleModel = require('../schemas/roles');
        let defaultRole = await roleModel.findOne({ name: /user/i }) || await roleModel.findOne({});
        
        let newUser = await userController.CreateAnUser(
            username, password, email, defaultRole._id
        )
        let newCart = new cartModel({
            user: newUser._id
        })
        newCart = await newCart.save()
        let newWishlist = new wishlistModel({
            user: newUser._id
        })
        await newWishlist.save()
        newCart = await newCart.populate('user')
        res.send(newCart)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.get('/me', CheckLogin, function (req, res, next) {
    res.send(req.user)
})
router.post('/changepassword', CheckLogin, ChangePasswordValidator, validatedResult, async function (req, res, next) {
    let { oldpassword, newpassword } = req.body;
    let user = req.user;
    let result = await userController.ChangePassword(user, oldpassword, newpassword);
    if (!result) {
        res.status(404).send("thong tin dang nhap khong dung")
    } else {
        res.send("doi thanh cong")
    }

})
router.post('/logout', CheckLogin, async function (req, res, next) {
    res.cookie("TOKEN_NNPTUD_C3", null, {
        maxAge: 0
    })
    res.send("logout")
})
function generateRandomPassword(length = 12) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let out = '';
    for (let i = 0; i < length; i++) {
        out += chars[crypto.randomInt(0, chars.length)];
    }
    return out;
}

router.post("/forgotpassword", async function (req, res, next) {
    let { email } = req.body;
    let user = await userController.GetUserByEmail(email);
    if (user) {
        const newPassword = generateRandomPassword(12);
        user.password = newPassword;
        user.forgotPasswordToken = null;
        user.forgotPasswordTokenExp = null;
        await user.save();
        await sendMail(user.email, newPassword);
    }
    res.send("kiem tra mail")
})

//forgotpassword
//permission
module.exports = router;