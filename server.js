// ---------------------------Constants and Variables-------------------------------

const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const methodOverride = require('method-override')
const port = 3000

//----------------------------Middleware--------------------------------------------
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
//----------------------------DB Connection--------------------------------------------
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', ()=>{
    console.log(`Connected to db collection: ${mongoose.connection.name}.`);
})
//----------------------------Routes--------------------------------------------

// GET	/blog	Read	index	Display a list of all blog.
app.get('/cars', (req, res)=>{
    res.render('home.ejs')
})
// GET	/blog/new	Read	new	Show a form to add a new blog.
// POST	/blog	Create	create	Add a new blog to the list.
// GET	/blog/:id	Read	show	Display a specific puppy’s details.
// GET	/blog/:id/edit	Read	edit	Show a form to edit an existing puppy’s details.
// PUT	/blog/:id	Update	update	Update a specific puppy’s details.
// DELETE	/blog/:id	Delete	delete	Remove a specific blog from the list.

//----------------------------Service--------------------------------------------
app.listen(port, ()=>{
    console.log(`App listening on port ${port}.`);
})