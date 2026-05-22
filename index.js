const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user');
const checkForAuthenticationCookie = require('./middlewares/authentication');

const app = express();
const Port = process.env.PORT || 3000;
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogify').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));


app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

// define a route handler for the default home page
app.get('/', (req, res) => {
    res.render('home', { 
        user: req.user
     });
});

app.use('/user', userRoutes);

// start the server on the specified port
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
