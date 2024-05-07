const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

// necessary for deployment
router.use(express.static('public'));

// the /auth part of the url is already defined in the server
// get sign up page
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs", {
        user: false,
        usernameError: false,
        passwordError: false,
        username: null, 
    });
});

// post data from the sign up page
router.post("/sign-up", async (req, res) => {
    
    // check to see if username already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    // if username already taken, return error message
    if (userInDatabase) {
        return res.render('auth/sign-up.ejs', {
            user: false,
            usernameError: "Username already taken.",
            passwordError: false
        });
    }
    
    // if passwords don't match return error message
    if (req.body.password !== req.body.confirmPassword) {
        return res.render("auth/sign-up.ejs", {
                username: req.body.username,
                user: false,
                usernameError: false,
                passwordError: "Passwords do not match."
        });
    }

    // else encript password
    // "The number 10 in the hashSync method represents the amount of salting we want the hashing function to execute: the higher the number, the harder it will be to decrypt the password. However, higher numbers will take longer for our application when we’re checking a user’s password, so we need to keep it reasonable for performance reasons." --GA
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    // set encrypted password to req.body
    req.body.password = hashedPassword;
    
    // create a user in db with username and encrypted password
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    });
    
    // set session user with unsername and id from db
    req.session.user = {
        name: user.username,
        id: user._id
    };
    
    // save session asynchronously because using data from db
    req.session.save(() => {
        res.redirect("/cars");
    });

});

// get sign in page
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs", {
        user: false,
        errorMessage: null
    });
});

// post data from sign-in page
router.post("/sign-in", async (req, res) => {
    
    // check if user in db
    const userInDatabase = await User.findOne({ username: req.body.username });

    // if user not in db return error message
    if (!userInDatabase) {
        return res.render('auth/sign-in.ejs', {
            user: false,
            errorMessage: "Username or password incorrect."
        });
    }

    // check password is correct for username
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    
    // if password invalid, return error message
    if (!validPassword) {
        return res.render('auth/sign-in.ejs', {
            user: false,
            errorMessage: "Username or password incorrect."
        });
    }
    
    // else set session with username and id from db
    req.session.user = {
        name: userInDatabase.username,
        id: userInDatabase._id.toString()
    };
    
    // Have to use this because you set mongo db to save the sessions, so now all changes to session are async
    req.session.save(() => { 
        res.redirect("/cars");
    });
  
});

// destroy session on sign out
router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/cars");
    });
});
    
  
module.exports = router;
