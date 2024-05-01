const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String, require: true}
})

module.exports = mongoose.model('Car', carSchema)