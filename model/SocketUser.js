const mongoose = require('mongoose')
const User = require('./User')

const SocketUserSchema = new mongoose.Schema({
    socketId: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true},
    status: {type: String, default:'online'},
    date: {type: Date, default: Date.now},
})

module.exports = mongoose.model('SocketUser', SocketUserSchema)