const express = require('express')
const router = express.Router()
const User = require('../model/User')

router.get('/kesfet',function(req,res){
    res.statusCode = 200
    if (req.session.login){
        res.render('tema/kesfet', {
            layout: 'main',
            pagename: 'Keşfet',
            kesfet: true,
            userId: req.session.userId
        })
    }else{
        res.redirect('/')
    }
})

module.exports = router