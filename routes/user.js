const {Router} = require('express');
const User = require('../models/user');
const router = Router();

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    // handle user registration logic here
    const { fullName, userName, email, password } = req.body;
    // ... (registration logic) handle error cases like duplicate email or username
    try {
        await User.create({ 
            fullName, 
            userName, 
            email, 
            password 
        });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(400).render('signup', { error: error.message });
    }
    return res.redirect('/');
});

router.post('/signin', async (req, res) => {
    // handle user login logic here
    const { email, password } = req.body;
    // ... (authentication logic) handle error cases like user not found or invalid password
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        // console.log("Token", token);
        return res.cookie("token", token, { httpOnly: true }).redirect('/');
    } catch (error) {
        console.error("Error during signin:", error);
        return res.status(401).render('signin', { error: error.message });
    }
});



module.exports = router;
