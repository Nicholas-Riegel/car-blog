// ---------------------------Constants and Variables-------------------------------

const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const methodOverride = require('method-override')
const port = 3000
const Car = require('./models/car')

//----------------------------Middleware--------------------------------------------

app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

//----------------------------DB Connection--------------------------------------------

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', ()=>{
    console.log(`Connected to db collection: ${mongoose.connection.name}.`);
})

//----------------------------Routes--------------------------------------------

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

// GET	/blog/:id	Read	show	Display a specific car’s details.
app.get('/car/:id', async (req, res) => {
    const car = await Car.findById(req.params.id)
    res.render('showCar.ejs', {car})
})

// GET	/blog/:id/edit	Read	edit	Show a form to edit an existing car’s details.
app.get('/car/:id/edit', async (req, res)=>{
    const car = await Car.findById(req.params.id)
    res.render('editCar.ejs', {car})
})

// PUT	/blog/:id	Update	update	Update a specific car’s details.
app.put('/car/:id', async (req, res)=>{
    await Car.findByIdAndUpdate(req.params.id, {
        name: req.body['car-name'],
        description: req.body['car-description']
    })
    res.redirect(`/cars`)
})

// DELETE	/blog/:id	Delete	delete	Remove a specific car from the list.
app.delete('/car/:id', async (req, res)=>{
    await Car.findByIdAndDelete(req.params.id)
    res.redirect('/cars')
})

//----------------------------Service--------------------------------------------

app.listen(port, ()=>{
    console.log(`App listening on port ${port}.`);
})