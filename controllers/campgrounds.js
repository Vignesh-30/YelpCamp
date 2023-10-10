const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });



module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderLoginForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.postNewCampground = async (req, res, next) => {
    const newCamp = new Campground(req.body);
    newCamp.image = req.files.map(file => ({ url: file.path, filename: file.filename }));
    newCamp.author = req.user._id;
    const match = await geocoder.forwardGeocode({
        query: newCamp.location,
        limit: 1
    }).send()
    newCamp.geometry = match.body.features[0].geometry;
    await newCamp.save();
    console.log(newCamp);
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

    res.render("campgrounds/show", { campground });
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
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    camp.image.push(...imgs);
    await camp.save();
    if (req.body.deleteimages) {
        for (let filename of req.body.deleteimages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteimages } } } });
    }
    console.log
    req.flash('success', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!');
    res.redirect("/campgrounds");
};