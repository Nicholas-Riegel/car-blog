// ---------------------------Constants and Variables-------------------------------

const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const methodOverride = require('method-override')
const port = 3000
const Car = require('./models/car')
const Post = require('./models/post')

//----------------------------Middleware--------------------------------------------

app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

//----------------------------DB Connection--------------------------------------------

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', ()=>{
    console.log(`Connected to db collection: ${mongoose.connection.name}.`);
})

//----------------------------Routes--------------------------------------------

// CAR ROUTES

// GET	/cars	Read	index	Display a list of all cars.
app.get('/cars', async (req, res)=>{
    const allCars = await Car.find();
    res.render('home.ejs', {allCars})
})

// GET	/cars/new	Read	Show a form to add a new car.
app.get('/cars/new', (req, res)=>{
    res.render('newCar.ejs')
})

// POST	/car	Create	Add a new car to the list.
app.post('/cars', async (req, res)=>{
    await Car.create({
        name: req.body['car-name'],
        description: req.body['car-description']
    })
    res.redirect('/cars')
})

// GET	/car/:id	Read	show	Display a specific car’s details.
app.get('/cars/:id', async (req, res) => {
    const car = await Car.findById(req.params.id)
    const allPosts = await Post.find({ carId: req.params.id })
    res.render('showCar.ejs', {car, allPosts})
})

// GET	/car/:id/edit	Read	edit	Show a form to edit an existing car’s details.
app.get('/cars/:id/edit', async (req, res)=>{
    const car = await Car.findById(req.params.id)
    res.render('editCar.ejs', {car})
})

// PUT	/blog/:id	Update	update	Update a specific car’s details.
app.put('/cars/:id', async (req, res)=>{
    await Car.findByIdAndUpdate(req.params.id, {
        name: req.body['car-name'],
        description: req.body['car-description']
    })
    res.redirect(`/cars/${req.params.id}`)
})

// DELETE	/car/:id	Delete	delete	Remove a specific car from the list.
app.delete('/cars/:id', async (req, res)=>{
    await Car.findByIdAndDelete(req.params.id)
    res.redirect('/cars')
})


// POST ROUTES

// POST	/cars/:carId/posts	Create	Add a new post to the list.
app.post('/cars/:carId/posts', async (req, res)=>{
    await Post.create({
        title: req.body['post-title'],
        body: req.body['post-body'],
        carId: req.params.carId
    })
    res.redirect(`/cars/${req.params.carId}`)
})

// GET	/cars/:carId/posts/:postId/edit	Read	edit	Show a form to edit an existing car’s details.
app.get('/cars/:carId/posts/:postId/edit', async (req, res)=>{
    const post = await Post.findById(req.params.postId)
    res.render('editPost.ejs', {
        carId: req.params.carId,
        post
    })
})

// PUT	/cars/:carId/posts/:postId	Update	update	Update a specific car’s details.
app.put('/cars/:carId/posts/:postId', async (req, res)=>{
    await Post.findByIdAndUpdate(req.params.postId, {
        title: req.body['post-title'],
        body: req.body['post-body']
    })
    res.redirect(`/cars/${req.params.carId}`)
})

// DELETE	/cars/:carId/posts/:postId	Delete	delete	Remove a specific car from the list.
app.delete('/cars/:carId/posts/:postId', async (req, res)=>{
    await Post.findByIdAndDelete(req.params.postId)
    res.redirect(`/cars/${req.params.carId}`)
})

//----------------------------Service--------------------------------------------

app.listen(port, ()=>{
    console.log(`App listening on port ${port}.`);
})