var https = require('https');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes = require('./routes/userRoutes');
const neighborhoodRoutes = require('./routes/neighborhoodRoutes');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser'); 
const authenticateToken = require('./authenticateToken'); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

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

app.use('/api/restaurants', authenticateToken, restaurantRoutes); 
app.use('/api/neighborhoods', authenticateToken, neighborhoodRoutes); 
app.use('/', userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, function() {
    console.log("Server is running on Port: " + port);
});
