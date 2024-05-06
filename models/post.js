const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    // title: {type: String, required: true},
    authorName: {type: String, required: true},
    body: {type: String, required: true},
    // carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', require: true },
    carId: { type: String, require: true },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
    userId: { type: String, require: true }

})

module.exports = mongoose.model('Post', postSchema)