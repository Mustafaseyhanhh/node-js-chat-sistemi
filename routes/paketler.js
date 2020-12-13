const express = require('express')
const router = express.Router()
const Paket = require('../model/Paket')

router.get('/paketler',function(req,res){
    if (req.session.login){
        sayfaIsmi="Paketler"
        Paket.find({},(err,paketler)=>{
            res.render('tema/paketler', {
                layout: 'main',
                pagename: 'Paketler',
                paketler: true,
                userId: req.session.userId,
                paketler:paketler
            })
        })
    }else{
        res.redirect('/')
    }
})

module.exports = router