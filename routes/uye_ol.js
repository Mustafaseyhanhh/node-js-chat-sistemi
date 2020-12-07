const express = require('express')
const router = express.Router()
const User = require('../model/User')

router.get('/uye-ol',function(req,res){
    res.statusCode = 200
    res.setHeader("Content-Type", "text/html");
    if (req.session.login){
        res.redirect('/sohbetler')
    }else{
        res.render('tema/uye-ol', {layout: 'empty'})
    }
})

router.post('/uye-ol-db',function(req,res){
    if (req.body.username.length>=6){
        User.create({username:req.body.username,password:req.body.password},(error,user)=>{
            if(error){
                req.session.sessionFlash ={
                    type: 'danger',
                    message: 'Bu kullanıcı adı alınmış. Lütfen farklı bir kullanıcı adı seçiniz'
                }
                res.redirect('/uye-ol')
            }else{
                req.session.userId = user._id
                req.session.login = true
                res.redirect('/tanitim')
            }
        })
    }else{
        req.session.sessionFlash ={
            type: 'danger',
            message: 'Kullanıcı adınız en az 6 karakter olmalıdır'
        }
        res.redirect('/uye-ol')
    }
    
})


router.get('/tanitim',function(req,res){
    res.render('tema/tanitim', {layout: 'empty'})
})

module.exports = router