const express = require('express');
const router = express.Router();
const {campGroundSchema } = require('../schema');
const catchAsync = require("../utilities/CatchAsync");
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");


router.get("/", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate("author").populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Campground cannot be found!');
        return res.redirect("/campgrounds");
    }   

    res.render("campgrounds/show", {campground});
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground cannot be found!');
        return res.redirect("/campgrounds");
    }   

    res.render("campgrounds/edit", { campground });
}));

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Campground added successfully!');
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campp = await Campground.findByIdAndUpdate(id, req.body, { new: true } )
    req.flash('success', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!');
    res.redirect("/campgrounds");
}));

module.exports = router;