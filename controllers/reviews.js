const Review = require('../models/review');
const Bootcamp = require('../models/bootcamp');

module.exports.createReview = async (req, res) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    const review = new Review(req.body.review);
    bootcamp.reviews.push(review);
    await review.save();
    await bootcamp.save();
    req.flash('success', 'Successfully Created a new Solution');
    res.redirect(`/bootcamps/${bootcamp._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Bootcamp.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted your Solution');
    res.redirect(`/bootcamps/${id}`);
}