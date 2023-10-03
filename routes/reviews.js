const express = require("express");
const router = express.Router({ mergeParams: true });
const {reviewSchema } = require('../schema');
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/CatchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) { throw new ExpressError(error.message, 400) }
    else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    // console.log(req.body.review);   
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${req.params.id}`); 
}))

router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull: {review : reviewId}});
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;