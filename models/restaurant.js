const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RestaurantSchema = new Schema({
    address: {
        building: String,
        coord: [Number],
        street: String,
        zipcode: String
    },
    borough: String,
    cuisine: String,
    grades: [{
        date: Date,
        grade: String,
        score: Number
    }],
    name: String,
    restaurant_id: String
});

let Restaurant = mongoose.model('Restaurant', RestaurantSchema);

// db.initialize("Your MongoDB Connection String Goes Here")
Restaurant.initialize = function(connectionString) {
    return mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
}

// db.addNewRestaurant(data)
Restaurant.addNewRestaurant = function(data) {
    let restaurant = new Restaurant(data);
    return restaurant.save();
}

// db.getAllRestaurants(page, perPage, borough)
Restaurant.getAllRestaurants = function(page, perPage, borough) {
    let query = {};
    if (borough) {
        query.borough = borough;
    }
    return Restaurant.find(query).skip((page - 1) * perPage).limit(perPage).sort('restaurant_id').exec();
}

// db.getRestaurantById(Id)
Restaurant.getRestaurantById = function(id) {
    return Restaurant.findById(id).exec();
}

// updateRestaurantById(data,Id)
Restaurant.updateRestaurantById = function(data, id) {
    return Restaurant.findByIdAndUpdate(id, data, { new: true }).exec();
}

// deleteRestaurantById(Id)
Restaurant.deleteRestaurantById = function(id) {
    return Restaurant.findByIdAndRemove(id).exec();
}

// db.getTopRestaurants(borough)
Restaurant.getTopRestaurants = function(borough) {
    return Restaurant.find({ borough: borough }).sort({ 'grades.score': -1 }).limit(5).exec();
}

// a method to retrieve restaurants by page, perPage, and borough
RestaurantSchema.statics.getRestaurantsByPage = async function(page, perPage, borough) {
    const skip = (page - 1) * perPage;
    const query = borough ? { borough } : {};

    try {
        const restaurants = await this.find(query)
            .skip(skip)
            .limit(perPage)
            .exec();

        return restaurants;
    } catch (err) {
        throw err;
    }
};
module.exports = Restaurant;
