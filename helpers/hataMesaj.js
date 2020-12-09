module.exports ={
    hataMesaj : (req,type,title,message) => {
        if (type == "success"){
            iconname="checkmark-circle"
        }else{
            iconname="close-circle"
        }
        req.session.hata ={
            type: type,
            title: title,
            message: message,
            iconname: iconname,
        }
        return req
    }
}