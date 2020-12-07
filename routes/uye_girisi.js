const express = require('express')
const router = express.Router()
const User = require('../model/User')
const { use } = require('./main')

router.get('/',function(req,res){
    res.statusCode = 200
    //console.log(req.session)
    res.setHeader("Content-Type", "text/html");
    if (req.session.login){
        res.redirect('/sohbetler')
    }else{
        res.render('tema/uye-girisi', {layout: 'empty'})
    }
})

router.post('/uye-giris-kontrol',function(req,res){
    res.statusCode = 200
    const {username, password} = req.body
    User.findOne({username, password},(error, user) => {
        if (user){
            req.session.userId = user._id
            req.session.login = true
            res.redirect('/sohbetler')
        }else{
            res.statusCode = 401
            req.session.sessionFlash ={
                type: 'danger',
                message: 'Kullanıcı adı şifre bulunamadı'
            }
            res.redirect('/')
        }
    })
})


module.exports = router