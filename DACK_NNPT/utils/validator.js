let { body, validationResult } = require('express-validator')
module.exports = {
    validatedResult: function (req, res, next) {
        let result = validationResult(req);
        if (result.errors.length > 0) {
            // Lấy lỗi đầu tiên và gửi thông báo đơn giản về Frontend
            const firstError = result.errors[0];
            return res.status(400).send(firstError.msg);
        }
        next();
    },
    CreateAnUserValidator: [
        body('email').notEmpty().withMessage("email khong duoc de trong").bail().isEmail().withMessage("email sai dinh dang").normalizeEmail(),
        body('username').notEmpty().withMessage("username khong duoc de trong").bail().isAlphanumeric().withMessage("username khong duoc chua ki tu dac biet"),
        body('password').notEmpty().withMessage("password khong duoc de trong").bail().isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        }).withMessage("password phai co it nhat 8 ki tu trong do co it nhat 1 ki tu chu hoa, 1 ki tu chu thuong,1 ki tu so va 1 ki tu dac biet"),
        body('role').notEmpty().withMessage("role khong duoc de trong").bail().isMongoId().withMessage("role phai la ID"),
        body('avatarUrl').optional().isArray().withMessage("avatarURl pahi la 1 mang"),
        body('avatarUrl.*').isURL().withMessage("URL khong hop le"),
    ],
    RegisterValidator: [
        body('email').notEmpty().withMessage("email khong duoc de trong").bail().isEmail().withMessage("email sai dinh dang").normalizeEmail(),
        body('username').notEmpty().withMessage("username khong duoc de trong").bail().isAlphanumeric().withMessage("username khong duoc chua ki tu dac biet"),
        body('password').notEmpty().withMessage("password khong duoc de trong").bail().isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        }).withMessage("password phai co it nhat 8 ki tu trong do co it nhat 1 ki tu chu hoa, 1 ki tu chu thuong,1 ki tu so va 1 ki tu dac biet"),
    ],ChangePasswordValidator: [
        body('oldpassword').notEmpty().withMessage("email khong duoc de trong"),
        body('newpassword').notEmpty().withMessage("password khong duoc de trong").bail().isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        }).withMessage("password phai co it nhat 8 ki tu trong do co it nhat 1 ki tu chu hoa, 1 ki tu chu thuong,1 ki tu so va 1 ki tu dac biet"),
    ],
    ModifyAnUserValidator: [
        body('email').isEmpty().withMessage("email khong duoc thay doi"),
        body('username').isEmpty().withMessage("username khong duoc thay doi"),
        body('password').optional().isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        }).withMessage("password phai co it nhat 8 ki tu trong do co it nhat 1 ki tu chu hoa, 1 ki tu chu thuong,1 ki tu so va 1 ki tu dac biet"),
        body('role').isEmpty().withMessage("role khong duoc thay doi"),
        body('avatarUrl').optional().isArray().withMessage("avatarURl pahi la 1 mang"),
        body('avatarUrl.*').isURL().withMessage("URL khong hop le"),
    ]
}