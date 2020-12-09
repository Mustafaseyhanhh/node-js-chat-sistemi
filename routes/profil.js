const express = require('express')
const router = express.Router()
const User = require('../model/User')
const hataMesaj = require('../helpers/hataMesaj').hataMesaj

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
                        req = hataMesaj(req,"danger","hata","yeni şifreniz en az 6 karakter uzunluğunda olmalıdır.")
                    }
                }else{
                    req = hataMesaj(req,"danger","hata","Girmiş olduğunuz şifreler aynı değil")
                }
            }else{
                req = hataMesaj(req,"danger","hata","Girmiş olduğunuz eski şifreniz yanlış")
            }
            res.redirect('/profil')
        })
        
    }else{
        res.redirect('/')
    }
})

module.exports = router