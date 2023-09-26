const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Mongo connection open!");
    })
    .catch(error => {
        console.log("Mongo connection error!");
        console.log(error);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 30) + 20;

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            price: price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo cumque veniam voluptate quia ex placeat atque beatae magnam, minima quasi aspernatur officia nam qui nihil dolorem tempora tenetur esse iusto"
        })
        console.log(camp.title);
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})