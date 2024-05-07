const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

router.use(express.static('public'));

// the /auth part of the url is already defined in the server

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs", {
        user: false,
        usernameError: false,
        passwordError: false,
        username: null, 
    });
});

router.post("/sign-up", async (req, res) => {
    
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    if (userInDatabase) {
        return res.render('auth/sign-up.ejs', {
            user: false,
            usernameError: "Username already taken.",
            passwordError: false
        });
    }
    
    if (req.body.password !== req.body.confirmPassword) {
        return res.render("auth/sign-up.ejs", {
                username: req.body.username,
                user: false,
                usernameError: false,
                passwordError: "Passwords do not match."
        });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    // The number 10 in the hashSync method represents the amount of salting we want the hashing function to execute: the higher the number, the harder it will be to decrypt the password. However, higher numbers will take longer for our application when we’re checking a user’s password, so we need to keep it reasonable for performance reasons.
    
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    });
    
    req.session.user = {
        name: user.username,
        id: user._id
    };
    
    req.session.save(() => {
        res.redirect("/cars");
    });

});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs", {
        user: false,
        errorMessage: null
    });
});

router.post("/sign-in", async (req, res) => {
    
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (!userInDatabase) {
        return res.render('auth/sign-in.ejs', {
            user: false,
            errorMessage: "Username or password incorrect."
        });
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    
    if (!validPassword) {
        return res.render('auth/sign-in.ejs', {
            user: false,
            errorMessage: "Username or password incorrect."
        });
    }
    
    req.session.user = {
        name: userInDatabase.username,
        id: userInDatabase._id.toString()
    };
      
    req.session.save(() => { // Have to use this because you set mongo db to save the sessions, so now all changes to session are async
        res.redirect("/cars");
    });
  
});

router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/cars");
    });
});
    
  
module.exports = router;
