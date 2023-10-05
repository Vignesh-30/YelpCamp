const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/CatchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campground = require("../controllers/campgrounds");

router.get("/", catchAsync(campground.index));

router.get("/new", isLoggedIn, campground.renderLoginForm);

router.get("/:id", catchAsync(campground.showCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));

router.post("/", isLoggedIn, validateCampground, catchAsync(campground.postNewCampground));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campground.postEditForm));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

module.exports = router;