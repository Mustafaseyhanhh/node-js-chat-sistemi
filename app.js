const path = require('path')
const exphbs  = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const express = require ('express')
const expressSession = require('express-session')
const expressFileUpload = require('express-fileupload')

//Modelleri Ekliyoruz.
const User = require('./model/User')
const Sohbet = require('./model/Sohbet')
const SohbetUser = require('./model/SohbetUser')
const Mesaj = require('./model/Mesaj')
const SocketUser = require('./model/SocketUser')

//Helpers fonksiyonları dahil ediliyor
const ifEsitMi = require('./helpers/ifEsitMi').ifEsitMi
const userBilgi = require('./helpers/userBilgi').userBilgi
const ifMesajSayisi = require('./helpers/ifMesajSayisi').ifMesajSayisi

const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = 3000
const hostname = 'localhost'

app.engine('handlebars', exphbs({
    defaultLayout: "main",   
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers : {
        ifEsitMi:ifEsitMi,
        userBilgi:userBilgi,
        ifMesajSayisi:ifMesajSayisi

    }}))

app.set('view engine', 'handlebars')
app.use('/media',express.static(__dirname + '/media'))
app.use(express.static(__dirname + '/static/'))

app.use(expressFileUpload())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/chat_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(expressSession({
    secret: 'testoretone',
    resave: false,
    saveUninitialized: true
}));

//Bildiri alanları
app.use((req, res, next)=> {
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
});

//Hata bildirimleri
app.use((req, res, next)=> {
    res.locals.hata = req.session.hata
    delete req.session.hata
    next()
});

const main = require('./routes/main')
const uye_ol = require('./routes/uye_ol')
const uye_girisi = require('./routes/uye_girisi')
const sohbetler = require('./routes/sohbetler')
const sohbet = require('./routes/sohbet')
const paketler = require('./routes/paketler')
const random = require('./routes/random')
const kesfet = require('./routes/kesfet')
const profil = require('./routes/profil')
app.use('/', main)
app.use('/', uye_ol)
app.use('/', uye_girisi)
app.use('/', sohbetler)
app.use('/', paketler)
app.use('/', random)
app.use('/', kesfet)
app.use('/profil', profil)
app.use('/', sohbet)

io.use(function(socket, next) {
    var handshakeData = socket.request;
    id1=handshakeData._query['id1']
    id2=handshakeData._query['id2']
    //console.log("user id:",id1)
    SocketUser.findOne({user:id1},(error,socketUser)=>{
        //console.log("sonketId:",socket.id)
        if (socketUser){
            //console.log("Eski Üye")
            socketUser.socketId=socket.id
            socketUser.status="online"
            socketUser.date=Date.now()
            socketUser.save()
        }else{
            //console.log("Yeni Üye")
            SocketUser.create({socketId:socket.id,user:id1})
        }
    })
    if (id2 != "false"){
        SohbetUser.findOne({user:id1,destinationUser:id2},(error,sohbetUser)=>{
            Sohbet.findOne({_id:sohbetUser.sohbet},(error,sohbet)=>{
                socket.join(sohbet.room)
                //console.log("room:",sohbet.room)
            })
        })
    }
    next();
});

io.on('connection', socket => {
    console.log("connection","socketId:",socket.id)
    socket.on('chat message', (msg) => {
        //console.log('message: ' + msg[0] +'***'+ msg[1]+'***'+ msg[2]+'***'+ msg[3]);
        SohbetUser.findOne({user:msg[2],destinationUser:msg[3]},(error,sohbetUser)=>{
            Sohbet.findOne({_id:sohbetUser.sohbet},(error,sohbet)=>{
                Mesaj.create({mesaj:msg[0],sahibi:msg[2],sohbet:sohbet})
                //Mesaj.create({mesaj:msg,sahibi:msg[2],sohbet:sohbet})
                io.sockets.in(sohbet.room).emit('chat message',msg)
            })
        })

        
    })
    socket.on("disconnect", () =>{
        console.log("disconnect","socketId:",socket.id)
        SocketUser.findOne({socketId:socket.id},(error,socketUser)=>{
            if (socketUser){
                socketUser.status='offline'
                socketUser.save()
            }else{
                console.log("socketUser bulunamadı. ", socket.id)
            }
        })
    })
})


http.listen(port, hostname, () => {
    console.log("listen on *:3000")
})

/*
/404 = Bunlunamadı
/sohbetler = sohbet listesinin görüneceği alan
/arama = kullanıcı isinleri ile arama yapılabilecek alan
/sohbet = kişisek sohbet ekranı
/random = random olarak kullanı atılacak alan
/anasayfa = zaman tünelinin olduğu alan
/profil = kişisel bilgilerin bulunduğu alan
/paylas = paylaşım yapabileceği alan

/üye-ol
/üye-girişi
/profil-düzünle
/paketler
/paket-satın-al
/paket-gönder
*/