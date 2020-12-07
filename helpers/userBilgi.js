const { json } = require('body-parser')
const { response } = require('express')
const User = require('../model/User')

module.exports ={
    userBilgi : async (_id) => {
        let uname
        await User.findById(_id,(error,user)=>{
            console.log(user)
            uname=user
        })
        await "aaa"
        console.log("--------------------",uname)
        //return uname

    }
}