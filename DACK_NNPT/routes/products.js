var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products');//dbContext
let inventoryModel = require('../schemas/inventories')
let reviewModel = require('../schemas/reviews')
let { CheckLogin, checkRole } = require('../utils/authHandler')
const { default: slugify } = require('slugify');
let mongoose = require('mongoose')

async function getReviewSummary(productId) {
  const summary = await reviewModel.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (!summary.length) {
    return { averageRating: 0, reviewCount: 0 };
  }

  return {
    averageRating: Number(summary[0].averageRating.toFixed(1)),
    reviewCount: summary[0].reviewCount,
  };
}

/* GET users listing. */
router.get('/', async function (req, res, next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  let queries = req.query;
  let minPrice = queries.minprice !== undefined ? Number(queries.minprice) : 0;
  let maxPrice = queries.maxprice !== undefined ? Number(queries.maxprice) : Number.MAX_SAFE_INTEGER;

  if (Number.isNaN(minPrice)) minPrice = 0;
  if (Number.isNaN(maxPrice)) maxPrice = Number.MAX_SAFE_INTEGER;

  let titleQ = queries.title ? queries.title : '';
  let result = await productModel.find({
    isDeleted: false,
    title: new RegExp(titleQ, 'i'),
    price: {
      $gte: minPrice,
      $lte: maxPrice
    }
  }).populate({
    path: 'category',
    select: 'name'
  })
  // result = result.filter(
  //   function (e) {
  //     return e.price >= minPrice && e.price <= maxPrice
  //       && e.title.toLowerCase().includes(titleQ.toLowerCase())
  //   }
  // )
  res.send(result);
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({
      isDeleted: false,
      _id: id
    })
    if (result) {
      const reviewSummary = await getReviewSummary(id);
      res.send({
        ...result.toObject(),
        averageRating: reviewSummary.averageRating,
        reviewCount: reviewSummary.reviewCount,
      });
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.get('/:id/reviews', async function (req, res, next) {
  try {
    const product = await productModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    const reviews = await reviewModel
      .find({ product: req.params.id, isDeleted: false })
      .populate({ path: 'user', select: 'username avatarUrl' })
      .sort({ createdAt: -1 });

    const summary = await getReviewSummary(req.params.id);
    res.send({ ...summary, reviews });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post('/:id/reviews', CheckLogin, async function (req, res, next) {
  try {
    const { rating, comment } = req.body;
    const ratingValue = Number(rating);

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).send({ message: 'rating phai tu 1 den 5' });
    }

    const product = await productModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    let review = await reviewModel.findOne({
      product: req.params.id,
      user: req.user._id,
    });

    if (review) {
      review.rating = ratingValue;
      review.comment = (comment || '').toString().trim();
      review.isDeleted = false;
      await review.save();
    } else {
      review = await reviewModel.create({
        product: req.params.id,
        user: req.user._id,
        rating: ratingValue,
        comment: (comment || '').toString().trim(),
      });
    }

    review = await review.populate({ path: 'user', select: 'username avatarUrl' });
    const summary = await getReviewSummary(req.params.id);

    res.send({
      message: 'Danh gia thanh cong',
      review,
      ...summary,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// POST create product (Admin only)
router.post('/', CheckLogin, checkRole('admin'), async function (req, res, next) {
  let session = await mongoose.startSession();
  session.startTransaction()
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      }),
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      images: req.body.images,
      status: req.body.status
    });
    newProduct = await newProduct.save({ session });
    let newInventory = new inventoryModel({
      product: newProduct._id
    })
    newInventory = await newInventory.save({ session });
    newInventory = await newInventory.populate('product')
    session.commitTransaction();
    session.endSession()
    res.send(newInventory)
  } catch (error) {
    session.abortTransaction();
    session.endSession()
    res.send(error.message)
  }
})
// PUT update product (Admin only)
router.put('/:id', CheckLogin, checkRole('admin'), async function (req, res, next) {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id;

    if (updateData.title) {
        updateData.slug = slugify(updateData.title, { lower: true });
    }

    const updatedItem = await productModel.findByIdAndUpdate(id, updateData, { new: true });
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// DELETE soft delete product (Admin only)
router.delete('/:id', CheckLogin, checkRole('admin'), async function (req, res, next) {
  try {
    let id = req.params.id;
    //c1
    // let result = await productModel.findOne({
    //   isDeleted: false,
    //   _id: id
    // })
    // if (result) {
    //   let keys = Object.keys(req.body);
    //   for (const key of keys) {
    //     result[key] = req.body[key]
    //   }
    //   await result.save()
    //   res.send(result)
    // }
    // else {
    //   res.status(404).send({ message: "ID NOT FOUND" });
    // }
    //c2
    let updatedItem = await productModel.findByIdAndUpdate(id, {
      isDeleted: true
    }, {
      new: true
    });
    res.send(updatedItem)
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
