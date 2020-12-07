const mongoose = require('mongoose')
const User = require('./User')
const Sobet = require('./Sohbet')

const MesajSchema = new mongoose.Schema({
    mesaj: {type: String, required: true},
    sahibi: {type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true},
    sohbet: {type: mongoose.Schema.Types.ObjectId, ref: 'Sohbet' ,required: true},
    okundu: {type: Boolean, default: false},
    date: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Mesaj', MesajSchema)