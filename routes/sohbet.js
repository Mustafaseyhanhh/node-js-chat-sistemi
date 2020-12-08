const express = require('express')
const router = express.Router()
const User = require('../model/User')
const SohbetUser = require('../model/SohbetUser')
const Mesaj = require('../model/Mesaj')

router.get('/sohbetler/:destinationId',function(req,res){
    id1=req.session.userId
    id2=req.params.destinationId
    _id=id1
    if (req.session.login){
        User.findOne({_id},(error, user1) => {
            _id=id2
            User.findOne({_id},(error, user2) => {
                SohbetUser.findOne({user:user1,destinationUser:user2},(error,sohbetUser)=>{
                    Mesaj.findOne({sohbet:sohbetUser.sohbet},(error,mesaj)=>{
                        if(mesaj == null){
                            Mesaj.create({mesaj:"Selam. Nasılsın?",sahibi:user1,sohbet:sohbetUser.sohbet})
                        }
                        Mesaj.countDocuments({sohbet:sohbetUser.sohbet},(err, count)=>{
                            if (count>=100){
                                count=count-100
                            }else{
                                count=0
                            }
                            Mesaj.find({sohbet:sohbetUser.sohbet},(error,mesajlar)=>{ 
                                mesajlar.forEach(mesaj=>{
                                    if (id1 != mesaj.sahibi){
                                        mesaj.okundu=true
                                        mesaj.save()
                                    }
                                })
                                res.render('tema/sohbet', {
                                    layout: 'empty',
                                    mesajlar:mesajlar,
                                    id1: id1,
                                    id2: id2,
                                    pagename: 'randomSohbet',
                                    userId: req.session.userId
                                })
                            }).sort({ _id: 1 }).limit(100).skip(count)
                        })
                    })
                })
            })
        })
    }else{
        req.session.sessionFlash ={
            type: 'danger',
            message: 'Oturum süreniz dolmuş. Lütren tekrar giriş yapınız.'
        }
        res.redirect('/')
    }
})

module.exports = router