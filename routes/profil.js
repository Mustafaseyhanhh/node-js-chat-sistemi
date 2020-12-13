const path = require('path')
const express = require('express')
const router = express.Router()
const expressFileUpload = require('express-fileupload')
const User = require('../model/User')
const hataMesaj = require('../helpers/hataMesaj').hataMesaj

const Jimp = require('jimp');

router.get('/',function(req,res){
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

router.post('/sifre-degistir',function(req,res){

    if (req.session.login){
        User.findOne({_id:req.session.userId},(err,user)=>{
            console.log(req.body.password1.length)
            if (user.password == req.body.esifre){
                if (req.body.password1 == req.body.password2){
                    if (req.body.password1.length>=6){
                        user.password=req.body.password1
                        user.save()
                        req = hataMesaj(req,"success","Onaylandı","Şifreniz başarı ile değiştirildi")
                    }else{
                        req = hataMesaj(req,"danger","Hata","yeni şifreniz en az 6 karakter uzunluğunda olmalıdır.")
                    }
                }else{
                    req = hataMesaj(req,"danger","Hata","Girmiş olduğunuz şifreler aynı değil")
                }
            }else{
                req = hataMesaj(req,"danger","Hata","Girmiş olduğunuz eski şifreniz yanlış")
            }
            res.redirect('/profil')
        })
        
    }else{
        res.redirect('/')
    }
})

router.post('/chat-name-degistir',function(req,res){

    if (req.session.login){
        User.findOne({_id:req.session.userId},(err,user)=>{
            User.findOne({username:req.body.cname},(err,user2)=>{
                if (user2){
                    req = hataMesaj(req,"danger","Hata","Girmiş olduğunuz chat name başka bir kullanıcı tarafından kullanılıyor. Lütfen farklı bir isim deneyiniz")
                }else{
                    user.username = req.body.cname
                    user.save()
                    req = hataMesaj(req,"success","Onaylandı","Chat isminiz başarı ile değiştirildi")
                }
                res.redirect('/profil')
            })
        })
        
    }else{
        res.redirect('/')
    }
})

router.post('/profil-resmi-degistir',function(req,res){

    if (req.session.login){
        resim=req.files.resim
        resim.mv(path.resolve(__dirname,'../media/profil',req.session.userId))
        req = hataMesaj(req,"success","Onaylandı","Profil resminiz değiştirildi")
        res.redirect('/profil')
    }else{
        res.redirect('/')
    }
})

router.post('/durum-degistir',function(req,res){

    if (req.session.login){
        User.findOne({_id:req.session.userId},(err,user)=>{
            if (req.body.durum.length<=200){
                user.durum = req.body.durum
                user.save()
                req = hataMesaj(req,"success","Onaylandı","Durum güncellendi")
                res.redirect('/profil')
            }else{
                req = hataMesaj(req,"danger","Hata","Durum metniniz maksimum 200 karakter olmalıdır.")
                res.redirect('/profil')
            }
        })
          
    }else{
        res.redirect('/')
    }
})

module.exports = router