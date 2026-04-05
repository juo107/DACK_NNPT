let express = require('express')
let router = express.Router()
let { uploadExcel, uploadExcelUsers } = require('../utils/uploadHandler')
let path = require('path')
let exceljs = require('exceljs')
let fs = require('fs')
let categoriesModel = require('../schemas/categories')
let productsModel = require('../schemas/products')
let inventoryModel = require('../schemas/inventories')
let mongoose = require('mongoose')
let slugify = require('slugify')
let userModel = require('../schemas/users')
let cartModel = require('../schemas/carts')
let wishlistModel = require('../schemas/wishlists')
let roleModel = require('../schemas/roles')
let validator = require('validator')

function excelCellText(cell) {
    const v = cell && cell.value != null ? cell.value : ''
    if (typeof v === 'object' && v !== null && 'text' in v) {
        return String(v.text).trim()
    }
    if (typeof v === 'object' && v !== null && 'richText' in v && Array.isArray(v.richText)) {
        return v.richText.map((t) => t.text || '').join('').trim()
    }
    return String(v).trim()
}

router.post('/excel_users', uploadExcelUsers.single('file'), async function (req, res, next) {
    if (!req.file) {
        res.status(404).send({
            message: "file not found"
        })
        return
    }
    const pathFile = path.join(__dirname, '../uploads', req.file.filename)
    try {
        const workbook = new exceljs.Workbook()
        await workbook.xlsx.readFile(pathFile)
        const worksheet = workbook.worksheets[0]
        if (!worksheet) {
            fs.unlinkSync(pathFile)
            return res.status(400).send({ message: 'file excel khong co sheet' })
        }

        const defaultRole = await roleModel.findOne({ name: /user/i }) || await roleModel.findOne({})
        if (!defaultRole) {
            fs.unlinkSync(pathFile)
            return res.status(500).send({ message: 'chua co role trong he thong' })
        }

        const existingUsers = await userModel.find({ isDeleted: false })
        const seenUsernames = new Set(existingUsers.map((u) => u.username))
        const seenEmails = new Set(existingUsers.map((u) => String(u.email || '').toLowerCase()))

        const result = []
        for (let index = 2; index <= worksheet.rowCount; index++) {
            const row = worksheet.getRow(index)
            const username = excelCellText(row.getCell(1))
            const email = excelCellText(row.getCell(2)).toLowerCase()

            if (!username && !email) {
                continue
            }

            const errorsInRow = []
            if (!username) {
                errorsInRow.push('username khong duoc de trong')
            } else if (!validator.isAlphanumeric(username)) {
                errorsInRow.push('username chi duoc chua chu va so')
            }
            if (!email) {
                errorsInRow.push('email khong duoc de trong')
            } else if (!validator.isEmail(email)) {
                errorsInRow.push('email khong hop le')
            }
            if (seenUsernames.has(username)) {
                errorsInRow.push('username bi trung')
            }
            if (seenEmails.has(email)) {
                errorsInRow.push('email bi trung')
            }

            if (errorsInRow.length > 0) {
                result.push({ success: false, data: errorsInRow })
                continue
            }

            const session = await mongoose.startSession()
            session.startTransaction()
            try {
                const newUser = new userModel({
                    username,
                    password: username,
                    email,
                    role: defaultRole._id,
                })
                await newUser.save({ session })
                const newCart = new cartModel({ user: newUser._id })
                await newCart.save({ session })
                const newWishlist = new wishlistModel({ user: newUser._id })
                await newWishlist.save({ session })
                await session.commitTransaction()
                await session.endSession()

                seenUsernames.add(username)
                seenEmails.add(email)
                const populated = await userModel.findById(newUser._id).populate('role').select('-password')
                result.push({ success: true, data: populated })
            } catch (error) {
                await session.abortTransaction()
                await session.endSession()
                result.push({ success: false, data: [error.message || String(error)] })
            }
        }

        fs.unlinkSync(pathFile)
        res.send(
            result.map(function (r, i) {
                if (r.success) {
                    return { [i + 1]: r.data }
                }
                return { [i + 1]: Array.isArray(r.data) ? r.data.join(',') : String(r.data) }
            })
        )
    } catch (err) {
        try {
            if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
        } catch {
            // ignore
        }
        next(err)
    }
})

router.get('/:filename', function (req, res, next) {
    let pathFile = path.join(
        __dirname, '../uploads', req.params.filename
    )
    res.sendFile(pathFile)
})

router.post('/excel', uploadExcel.single('file'), async function (req, res, next) {
    if (!req.file) {
        res.status(404).send({
            message: "file not found"
        })
    } else {
        //workbook->worksheet->column/row->cell
        let workbook = new exceljs.Workbook();
        let pathFile = path.join(
            __dirname, '../uploads', req.file.filename
        )
        await workbook.xlsx.readFile(pathFile)
        let worksheet = workbook.worksheets[0];
        let result = []
        let categories = await categoriesModel.find({
        });
        let categoriesMap = new Map();
        for (const category of categories) {
            categoriesMap.set(category.name, category._id)
        }
        let products = await productsModel.find({})
        let getTitle = products.map(p => p.title)
        let getSku = products.map(p => p.sku)

        for (let index = 2; index <= worksheet.rowCount; index++) {
            let errorsInRow = []
            const element = worksheet.getRow(index);
            let sku = element.getCell(1).value;
            let title = element.getCell(2).value;
            let category = element.getCell(3).value;

            let price = Number.parseInt(element.getCell(4).value)
            let stock = Number.parseInt(element.getCell(5).value)

            if (price < 0 || isNaN(price)) {
                errorsInRow.push("price khong hop le")
            }
            if (stock < 0 || isNaN(stock)) {
                errorsInRow.push("stock khong hop le")
            }
            if (!categoriesMap.has(category)) {
                errorsInRow.push('category khong hop le')
            }
            if (getSku.includes(sku)) {
                errorsInRow.push('sku bi trung')
            }
            if (getTitle.includes(title)) {
                errorsInRow.push('title khong hop le')
            }
            if (errorsInRow.length > 0) {
                result.push({
                    success: false,
                    data: errorsInRow
                });
                continue;
            }// 

            // Không dùng transaction: MongoDB standalone không hỗ trợ (cần replica set/mongos).
            try {
                let newProduct = new productsModel({
                    sku: sku,
                    title: title,
                    slug: slugify(title, {
                        replacement: '-',
                        remove: undefined,
                        lower: true,
                        strict: false,
                    }),
                    price: price,
                    description: title,
                    category: categoriesMap.get(category)
                });
                newProduct = await newProduct.save();
                let newInventory = new inventoryModel({
                    product: newProduct._id,
                    stock: stock
                });
                newInventory = await newInventory.save();
                newInventory = await newInventory.populate('product');
                getTitle.push(title);
                getSku.push(sku);
                result.push({
                    success: true,
                    data: newInventory
                });
            } catch (error) {
                result.push({
                    success: false,
                    data: error.message
                });
            }

        }
        fs.unlinkSync(pathFile)
        res.send(result.map(function (r, index) {
            if (r.success) {
                return { [index + 1]: r.data }
            }
            return {
                [index + 1]: Array.isArray(r.data) ? r.data.join(',') : r.data
            }
        }))
    }
})

module.exports = router;