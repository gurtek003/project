const express = require('express');
const restaurantRoutes = express.Router();
const Restaurant = require('../models/restaurant');
const authenticateToken = require('./authenticateToken'); // Import the authenticateToken middleware

// GET ADD NEW RESTAURANT /api/restaurants/new 
restaurantRoutes.get('/new', authenticateToken, function(req, res) { // Add middleware here
    res.render('addRestaurantForm');
});

// POST ADD NEW RESTAURANT  /api/restaurants/new
restaurantRoutes.post('/', authenticateToken, async function(req, res) { // Add middleware here
    try {
        const newRestaurantData = {
            name: req.body.name,
            borough: req.body.borough,
            cuisine: req.body.cuisine,
            address: {
                building: req.body.building,
                street: req.body.street,
                zipcode: req.body.zipcode
            },
            restaurant_id: req.body.restaurant_id,
        };

        const restaurant = await Restaurant.addNewRestaurant(newRestaurantData);
        res.redirect('/api/restaurants');
    } catch (err) {
        res.status(400).send('Adding new restaurant failed');
    }
});

// GET DISPLAY ALL RESTAURANTS /api/restaurants
restaurantRoutes.get('/', authenticateToken, async function(req, res) { // Add middleware here
    try {
        let page = Number(req.query.page);
        let perPage = Number(req.query.perPage);
        let borough = req.query.borough;

        const restaurants = await Restaurant.getAllRestaurants(page, perPage, borough);
        res.render('restaurants', { restaurants: restaurants });
    } catch (err) {
        res.status(500).send('Error retrieving restaurants');
    }
});

// GET SEARCH BY ID /api/restaurants/searchbyid
restaurantRoutes.get('/searchbyid', authenticateToken, function(req, res) { // Add middleware here
    res.render('getRestaurantByID');
});

// POST SEARCH BY ID /api/restaurants/searchbyid
restaurantRoutes.post('/searchbyid', authenticateToken, async function(req, res) { // Add middleware here
    try {
        const id = req.body.id;
        const restaurant = await Restaurant.findOne({ restaurant_id: id });

        if (restaurant) {
            res.render('restaurant', { restaurant: restaurant });
        } else {
            res.status(404).send('Restaurant not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving restaurant');
    }
});

// GET to render the form to input restaurant ID for deletion
restaurantRoutes.get('/deletebyid', authenticateToken, function(req, res) { // Add middleware here
    res.render('deleteRestaurantByID');
});

// POST to delete restaurant by ID
restaurantRoutes.post('/deletebyid', authenticateToken, async function(req, res) { // Add middleware here
    try {
        const id = req.body.id;
        const deletedRestaurant = await Restaurant.findOneAndDelete({ restaurant_id: id });

        if (deletedRestaurant) {
            res.redirect(`/api/restaurants?deletedId=${id}`);
        } else {
            res.status(404).send('Restaurant not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting restaurant');
    }
});

// GET form to select borough for top restaurants
restaurantRoutes.get('/top', authenticateToken, async function(req, res) { // Add middleware here
    try {
        res.render('getTopRestaurants');
    } catch (err) {
        res.status(500).send('Error rendering form');
    }
});

// POST to get top restaurants by selected borough
restaurantRoutes.post('/top', authenticateToken, async function(req, res) { // Add middleware here
    try {
        let selectedBorough = req.body.borough;
        let restaurants = await Restaurant.getTopRestaurants(selectedBorough);
        res.render('restaurants', { restaurants: restaurants });
    } catch (err) {
        res.status(500).send('Error retrieving top restaurants');
    }
});

// GET route for the form
restaurantRoutes.get('/restaurants-form', authenticateToken, function(req, res) { // Add middleware here
    res.render('restaurantsForm'); // Render the form view
});

// POST route to handle form submission
restaurantRoutes.post('/restaurants-result', authenticateToken, async function(req, res) { // Add middleware here
    try {
        const { page, perPage, borough } = req.body; // Retrieve form data
        console.log('Received page:', page);
        console.log('Received perPage:', perPage);
        console.log('Received borough:', borough);

        // Use the retrieved data to query restaurant information
        const restaurants = await Restaurant.getRestaurantsByPage(page, perPage, borough);

        res.render('restaurantsOutput', { restaurants }); // Render the output view with the retrieved data
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).send('Error retrieving restaurants');
    }
});

// GET UPDATE RESTAURANT /api/restaurants/update 
restaurantRoutes.get('/update', authenticateToken, function(req, res) { // Add middleware here
    const id = req.query.restaurantId;

    if (id) {
        res.redirect(`/api/restaurants/${id}/edit`);
    } else {
        res.render('updateRestaurantByID');
    }
});

// GET UPDATE RESTAURANT /api/restaurants/:id/edit 
restaurantRoutes.get('/:id/edit', authenticateToken, async function(req, res) { // Add middleware here
    try {
        const id = req.params.id;
        const restaurant = await Restaurant.findOne({ restaurant_id: id });

        if (restaurant) {
            res.render('updateRestaurant', { restaurant: restaurant });
        } else {
            res.status(404).send('Restaurant not found');
        }
    } catch (err) {
        res.status(500).send('Error retrieving restaurant');
    }
});

// POST UPDATE RESTAURANT  /api/restaurants/:id 
restaurantRoutes.post('/:id', authenticateToken, async function(req, res) { // Add middleware here
    try {
        const id = req.params.id;
        const updatedRestaurantData = {
            name: req.body.name,
            borough: req.body.borough,
            cuisine: req.body.cuisine,
            address: {
                building: req.body.building,
                street: req.body.street,
                zipcode: req.body.zipcode
            }
        };

        const updatedRestaurant = await Restaurant.updateRestaurantById(updatedRestaurantData, id);
        res.redirect('/api/restaurants');
    } catch (err) {
        res.status(500).send('Error updating restaurant');
    }
});

module.exports = restaurantRoutes;