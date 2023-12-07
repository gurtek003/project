var https = require('https');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes = require('./routes/userRoutes');
const neighborhoodRoutes = require('./routes/neighborhoodRoutes');
const exphbs = require('express-handlebars');

const app = express();
app.use(cors());
app.use(express.json());

// Set up Handlebars as view engine
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', '.hbs');


mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, function() {
    console.log("Server is running on Port: " + port);
});

