const express = require('express')
const router = express.Router()
const User = require('../model/User')

router.get('/profil',function(req,res){
    res.statusCode = 200
    if (req.session.login){
        res.render('tema/profil', {
            layout: 'main',
            pagename: 'Profil',
            profil: true,
            userId: req.session.userId
        })
    }else{
        res.redirect('/')
    }
})

module.exports = router