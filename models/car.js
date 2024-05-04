const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String, require: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
})

module.exports = mongoose.model('Car', carSchema)