const mongoose = require('mongoose')
const User = require('./User')
const Sohbet = require('./Sohbet')

const SohbetUserSchema = new mongoose.Schema({
    sohbet: {type: mongoose.Schema.Types.ObjectId, ref: 'Sohbet' ,required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true},
    destinationUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true},
})

module.exports = mongoose.model('SohbetUser', SohbetUserSchema)