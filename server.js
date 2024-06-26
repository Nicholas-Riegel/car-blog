// ---------------------------Constants and Variables-------------------------------

const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require("connect-mongo");
const port = 3002

//-----------------------------Models and Controllers---------------------------------------------

const Car = require('./models/car')
const Post = require('./models/post')
const authController = require("./controllers/auth.js");
const isSignedIn = require('./middleware/is-signed-in.js')

//----------------------------Middleware--------------------------------------------

app.use(express.urlencoded({extended: false}))
app.use(express.static('public'));
app.use(methodOverride('_method'))
app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);

//----------------------------DB Connection--------------------------------------------

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', ()=>{
    console.log(`Connected to db collection: ${mongoose.connection.name}.`);
})

//----------------------------Routes--------------------------------------------

// CAR ROUTES

// Authorization
app.use("/auth", authController);

// GET	/cars	Display homepage with list of all cars.
app.get('/cars', async (req, res)=>{
    const allCars = await Car.find();
    res.render('home.ejs', {
        user: req.session.user,
        allCars
    })
})

// GET	/cars/new	Show a form to add a new car.
app.get('/cars/new', isSignedIn, (req, res)=>{
    if (req.session.user){
        res.render('newCar.ejs', {user: req.session.user})
    } else {
        res.redirect("/auth/sign-in")
    }
})

// POST	/car   Add a new car to the list.
app.post('/cars', isSignedIn, async (req, res)=>{
    await Car.create({
        name: req.body['car-name'],
        pictureUrl: req.body['picture-url'],
        description: req.body['car-description'],
        userId: req.session.user.id
    })
    res.redirect('/cars')
})

// GET	/car/:id	Display a specific car’s details and all posts.
app.get('/cars/:id', async (req, res) => {
    const user = req.session.user;
    const car = await Car.findById(req.params.id)
    const allPosts = await Post.find({ carId: req.params.id })
    res.render('showCar.ejs', {
        car, 
        allPosts,
        user
    })
})

// GET	/car/:id/edit	Show a form to edit an existing car’s details.
app.get('/cars/:id/edit', isSignedIn, async (req, res)=>{
    const user = req.session.user;
    const car = await Car.findById(req.params.id)
    res.render('editCar.ejs', {car, user})
})

// PUT	/blog/:id	Update a car’s details.
app.put('/cars/:id', isSignedIn, async (req, res)=>{
    await Car.findByIdAndUpdate(req.params.id, {
        name: req.body['car-name'],
        pictureUrl: req.body["picture-url"],
        description: req.body['car-description']
    })
    res.redirect(`/cars/${req.params.id}`)
})

// DELETE	/car/:id	Delete a car from the list.
app.delete('/cars/:id', isSignedIn, async (req, res)=>{
    await Car.findByIdAndDelete(req.params.id)
    await Post.deleteMany({carId: req.params.id})
    res.redirect('/cars')
})


// COMMENT-POST ROUTES

// POST	/cars/:carId/posts	Add a new post under a car
app.post('/cars/:carId/posts', isSignedIn, async (req, res)=>{
    const userId = req.session.user.id.toString()
    await Post.create({
        authorName: req.body['author-name'],
        body: req.body['post-body'],
        carId: req.params.carId,
        userId
    })
    res.redirect(`/cars/${req.params.carId}`)
})

// GET	/cars/:carId/posts/:postId/edit	   Show a form to edit an existing post
app.get('/cars/:carId/posts/:postId/edit', isSignedIn, async (req, res)=>{
    const post = await Post.findById(req.params.postId)
    if (req.session.user){
        res.render('editPost.ejs', {
            carId: req.params.carId,
            post,
            user: req.session.user
        })
    } else {
        res.redirect('/auth/sign-up')
    }
})

// PUT	/cars/:carId/posts/:postId	    Update a post
app.put('/cars/:carId/posts/:postId', isSignedIn, async (req, res)=>{
    await Post.findByIdAndUpdate(req.params.postId, {
        title: req.body['post-title'],
        body: req.body['post-body']
    })
    res.redirect(`/cars/${req.params.carId}`)
})

// DELETE	/cars/:carId/posts/:postId	Delete a post
app.delete('/cars/:carId/posts/:postId', isSignedIn, async (req, res)=>{
    await Post.findByIdAndDelete(req.params.postId)
    res.redirect(`/cars/${req.params.carId}`)
})

//----------------------------Service--------------------------------------------

app.listen(port, ()=>{
    console.log(`App listening on port ${port}.`);
})