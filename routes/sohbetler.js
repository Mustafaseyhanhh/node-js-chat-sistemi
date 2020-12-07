const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../model/User')
const Sohbet = require('../model/Sohbet')
const SohbetUser = require('../model/SohbetUser')
const Mesaj = require('../model/Mesaj')
const SocketUser = require('../model/SocketUser')

router.get('/sohbetler',function(req,res){
    if (req.session.login){
        SohbetUser.aggregate([{
            $match: {
                user: mongoose.Types.ObjectId(req.session.userId)
            }
        },{
            $lookup: {
                from: 'users',
                localField: 'destinationUser',
                foreignField: '_id',
                as: 'destinationUser'
            }
        },
        {
            $unwind: '$destinationUser',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },{
            $unwind: '$user',
        },
        {
            $lookup: {
                from: 'sohbets',
                localField: 'sohbet',
                foreignField: '_id',
                as: 'sohbet'
            }
        },{
            $unwind: '$sohbet',
        },
        {
            $project: {
                _id: true,
                sohbet: '$sohbet',
                destinationUser: '$destinationUser',
                user: '$user'
            }
        }],(error,sohbetUser)=>{
            console.log("-------------------------")
            console.log(sohbetUser)
            sohbetUser.forEach(sohbet => {
                
                Mesaj.find({sohbet:sohbet.sohbet._id,okundu:false,sahibi:sohbet.destinationUser._id},(error,mesajlar)=>{
                    //console.log(mesajlar.length)
                    sohbet['okundu']=mesajlar.length
                })
                Mesaj.findOne({sohbet:sohbet.sohbet._id},(error,sonmesaj)=>{
                    sohbet['sonmesaj']=sonmesaj.mesaj
                }).sort( '-date' )
                SocketUser.findOne({user:sohbet.destinationUser._id},(error,status)=>{
                    if(status){
                        sohbet["status"]=status.status
                    }else{
                        sohbet["status"]='offline'
                    }
                    //console.log(sohbet["status"])
                    
                })
            })
            //console.log(sohbetUser)
            res.render('tema/sohbetler', {
                layout: 'main',
                pagename: 'Sohbetler',
                sohbetler: true,
                sohbetUser:sohbetUser,
                userId: req.session.userId
            })
        })
    }else{
        res.redirect('/')
    }
})

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