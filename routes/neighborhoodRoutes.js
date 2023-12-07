const express = require('express');
const neighborhoodRoutes = express.Router();

let Neighborhood = require('../models/neighborhood');

// GET /api/neighborhoods
neighborhoodRoutes.route('/').get(function(req, res) {
    Neighborhood.find()
        .then(neighborhoods => {
            res.json(neighborhoods);
        })
        .catch(err => {
            res.status(500).send('error retrieving neighborhoods');
        });
});

module.exports = neighborhoodRoutes;
