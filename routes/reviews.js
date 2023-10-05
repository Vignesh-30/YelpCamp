const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post("/", isLoggedIn, validateReview, catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;  
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'Review posted successfully!');
    res.redirect(`/campgrounds/${req.params.id}`); 
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull: {review : reviewId}});
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;