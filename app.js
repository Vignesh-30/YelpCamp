const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utilities/ExpressError");
const app = express();
const ejsmate = require('ejs-mate');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

app.engine('ejs', ejsmate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use(express.static(path.join(__dirname, 'public')))

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
});


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