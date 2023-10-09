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
            image: [
                {
                    url: 'https://res.cloudinary.com/diree6phc/image/upload/v1696834577/YelpCamp/mwwmmabi67ioqcdnmsen.jpg',
                    filename: 'YelpCamp/mwwmmabi67ioqcdnmsen',
                  },
                  {
                    url: 'https://res.cloudinary.com/diree6phc/image/upload/v1696834580/YelpCamp/voxpnqpovzbkxumwihef.jpg',
                    filename: 'YelpCamp/voxpnqpovzbkxumwihef',
                  },
                  {
                    url: 'https://res.cloudinary.com/diree6phc/image/upload/v1696834579/YelpCamp/wyowe2kqpfcl0jzftvoq.jpg',
                    filename: 'YelpCamp/wyowe2kqpfcl0jzftvoq',
                  },
                  {
                    url: 'https://res.cloudinary.com/diree6phc/image/upload/v1696834581/YelpCamp/nuxuwmbqo7cocyaqxnaj.jpg',
                    filename: 'YelpCamp/nuxuwmbqo7cocyaqxnaj',
                  }
              
            ],
            price: price,
            author: "651d1543db349273631c7b4d",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo cumque veniam voluptate quia ex placeat atque beatae magnam, minima quasi aspernatur officia nam qui nihil dolorem tempora tenetur esse iusto"
        })
        console.log(camp.title);
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})