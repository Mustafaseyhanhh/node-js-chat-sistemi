const express = require('express')
const router = express.Router()
const User = require('../model/User')

router.get('/paketler',function(req,res){
    res.statusCode = 200
    if (req.session.login){
        sayfaIsmi="Paketler"
        res.render('tema/paketler', {
            layout: 'main',
            pagename: 'Paketler',
            paketler: true,
            userId: req.session.userId
        })
    }else{
        res.redirect('/')
    }
})

module.exports = router