const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let NeighborhoodSchema = new Schema({
    geometry: {
        coordinates: [[[Number]]],
        type: { type: String }
    },
    name: String
});

let Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);

module.exports = Neighborhood;
