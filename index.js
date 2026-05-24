require('dotenv').config()
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog')

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');

const checkForAuthenticationCookie = require('./middlewares/authentication');

const app = express();
const Port = process.env.PORT || 3000;
// Connect to MongoDB
mongoose.connect(process.env.DB_URL).then(() => {
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
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}); 
    res.render('home', { 
        user: req.user,
        blogs: allBlogs,
     });
});

app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

// start the server on the specified port
app.listen(Port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
