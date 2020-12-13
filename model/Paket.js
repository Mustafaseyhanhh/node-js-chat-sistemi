const mongoose = require('mongoose')

const PaketSchema = new mongoose.Schema({
    paketAdi: {type: String, required: true},
    fiyat: {type: Number, required: true},
    link:{type: String, required: true},
    resim:{type: String, required: true},
    icerik: [],
})

module.exports = mongoose.model('Paket', PaketSchema)