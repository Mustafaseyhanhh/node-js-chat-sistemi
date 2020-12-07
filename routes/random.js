const express = require('express')
const router = express.Router()
const User = require('../model/User')
const Sohbet = require('../model/Sohbet')
const SohbetUser = require('../model/SohbetUser')
const Mesaj = require('../model/Mesaj')
const { db } = require('../model/User')

router.get('/random',function(req,res){
    res.statusCode = 200
    if (req.session.login){
        _id=req.session.userId
        User.findOne({_id},(error, user) => {
            if (user.gunlukRandom > 0){
                User.countDocuments({},(err, count) => {
                    var random = Math.floor(Math.random() * count)
                    User.findOne().skip(random).exec(
                        function (err, newRandomUser) {
                            user.sonRandomId=newRandomUser._id
                            user.save()
                            _id=user.sonRandomId
                            User.findOne({_id},(error, randomUser) => {
                                res.render('tema/random', {
                                    layout: 'main',
                                    pagename: 'Random',
                                    random: true,
                                    randomUserUserName: randomUser.username,
                                    randomUserUserId: randomUser._id,
                                    userId: req.session.userId
                                })
                            })
                    })
                })
            }
        })
    }else{
        req.session.sessionFlash ={
            type: 'danger',
            message: 'Oturum süreniz dolmuş. Lütren tekrar giriş yapınız.'
        }
        res.redirect('/')
    }
})

router.get('/random-hak-control',function(req,res){
    _id=req.session.userId
    User.findOne({_id},(error, user) => {
        if (user.gunlukRandom > 0){
            res.redirect('/random')
        }else{
            req.session.sessionFlash ={
                type: 'danger',
                title: 'Limit',
                message: 'Günlük random eşleşme hakkınız bitti. Paket alarak devam edebilirsiniz.',
                btnText: 'Paketleri İncele',
                link: 'https://www.google.com'
            }
            res.redirect('/random')
        }
    })
})

router.get('/random-sohbet-basla/:destinationId',function(req,res){
    id1=req.session.userId
    id2=req.params.destinationId
    _id=id1
    User.findOne({_id},(error, user1) => {
        _id=id2
        User.findOne({_id},(error, user2) => {
            console.log('----------------------------')
            SohbetUser.findOne({user:user1,destinationUser:user2},(error,sohbetUser)=>{
                if(sohbetUser){
                    console.log("Daha önce bir konuşmanız mevcut")
                }else{
                    console.log("Yeni Sohbet")
                    Sohbet.create({room:user1._id+'-'+user2._id},(error,sohbet)=>{
                        SohbetUser.create({sohbet:sohbet,user:user1,destinationUser:user2})
                        SohbetUser.create({sohbet:sohbet,user:user2,destinationUser:user1})
                    })
                }
            })
            
        })
    })
    res.redirect('/sohbetler/'+id2)
})

module.exports = router