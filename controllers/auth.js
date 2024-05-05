const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.use(express.static('public'));


const User = require("../models/user.js");

// the /auth part of the url is already defined in the server

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs", {user: false});
});

router.post("/sign-up", async (req, res) => {
    
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    if (userInDatabase) {
        return res.send("Username already taken.");
    }
    
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    // The number 10 in the hashSync method represents the amount of salting we want the hashing function to execute: the higher the number, the harder it will be to decrypt the password. However, higher numbers will take longer for our application when we’re checking a user’s password, so we need to keep it reasonable for performance reasons.
    
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    });
    
    req.session.user = {
        username: user.username,
    };
    
    req.session.save(() => {
        res.redirect("/cars");
    });

});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs", {user: false});
});

router.post("/sign-in", async (req, res) => {
    
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }
    
    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
        username: userInDatabase.username,
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
