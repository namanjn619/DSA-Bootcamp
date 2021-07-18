const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Bootcamp = require('../models/bootcamp');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js');

const reviews = require('../controllers/reviews');
//------------------------------------------//
//MiddleWare:
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
//------------------------------------------//
router.post('/', validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', catchAsync(reviews.deleteReview));
//------------------------------------------//
module.exports = router;
