const express = require('express')
const router = express.Router()





router.get('/404',function(req,res){
    res.statusCode = 404
    res.setHeader("Content-Type", "text/html");
    res.render('tema/404', {layout: 'empty'})
})

module.exports = router