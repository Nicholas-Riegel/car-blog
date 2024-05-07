const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    authorName: {type: String, required: true},
    body: {type: String, required: true},
    carId: { type: String, require: true },
    userId: { type: String, require: true }
})

module.exports = mongoose.model('Post', postSchema)