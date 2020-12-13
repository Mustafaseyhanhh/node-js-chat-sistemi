const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    durum:{type: String,default : 'Bana selam verebilirsin :)'},
    profilImage:{type: Boolean, default: false},
    date: {type: Date, default: Date.now},
    banned: {type: Boolean, default: false},
    sms: {type: Number, default: 200},
    gunlukRandom: {type: Number, default: 20},
    sonRandomId: {type: String},
    premium: {type: Number, default: 1},
})

module.exports = mongoose.model('User', UserSchema)

// 4 //premium
// 3 //platin
// 2 //gold
// 1 //standart