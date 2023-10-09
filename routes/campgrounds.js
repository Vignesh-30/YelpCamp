const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/CatchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campground = require("../controllers/campgrounds");

router.route("/")
    .get(catchAsync(campground.index))
    .post(isLoggedIn, validateCampground, catchAsync(campground.postNewCampground))

router.get("/new", isLoggedIn, campground.renderLoginForm);

router.route("/:id")
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campground.postEditForm))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));

module.exports = router;