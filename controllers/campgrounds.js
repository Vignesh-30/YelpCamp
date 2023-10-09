const Campground = require('../models/campground');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderLoginForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.postNewCampground = async (req, res, next) => {
    const newCamp = new Campground(req.body);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Campground added successfully!');
    res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.showCampground = async (req, res, next) => {
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
};

module.exports.renderEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground cannot be found!');
        return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
};

module.exports.postEditForm = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body, { new: true })
    req.flash('success', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!');
    res.redirect("/campgrounds");
};