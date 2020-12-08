const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
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

module.exports = router