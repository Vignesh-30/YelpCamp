const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Joi = require('joi');
const {campGroundSchema} = require('./schema');
const methodOverride = require("method-override");
const ExpressError = require("./utilities/ExpressError");
const catchAsync = require("./utilities/CatchAsync");
const app = express();
const ejsmate = require('ejs-mate');

app.engine('ejs', ejsmate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Mongo connection open!");
    })
    .catch(error => {
        console.log("Mongo connection error!");
        console.log(error);
    });


const validateCampground = (req, res, next) => {
    const { error } = campGroundSchema.validate(req.body);
    if (error) { throw new ExpressError(error.message, 400) }
    else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/edit/:id", catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);

    res.render("campgrounds/edit", { campground });
}));

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {

    const newCamp = new Campground(req.body);

    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body, { new: true });
    res.redirect(`/campgrounds/${id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
});
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});