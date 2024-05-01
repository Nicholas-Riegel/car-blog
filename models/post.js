const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' }
})

module.exports = mongoose.model('Post', postSchema)