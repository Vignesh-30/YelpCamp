const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
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



app.get("/", (req, res) => {
    res.render("home");
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
})

app.get("/campgrounds/edit/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    res.render("campgrounds/edit", { campground });
})

app.post("/campgrounds", async (req, res) => {
    const newCamp = new Campground(req.body);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
})

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body, { new: true });
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})