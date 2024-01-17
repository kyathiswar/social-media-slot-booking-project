import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
import  express  from 'express'
import hbs from 'hbs'
import bodyParser from 'body-parser'
import  jwt  from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import {readposts1,  readpeople,  insertposts1, insertpeople, likefun, sharefun, deletefun} from './operation.js'
const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/cinema",{
    useNewUrlParser: true,
    useUnifiedTopology: true

})

const screen1model = mongoose.model('screen1',{
    seatno: {type:Number},
    status: {type:String}
})

const screen2model = mongoose.model('screen2',{
    seatno: {type:Number},
    status: {type:String}
})

const screen3model = mongoose.model('screen3',{
    seatno: {type:Number},
    status: {type:String}
})

const moviesmodel = mongoose.model('movies',{
    name: {type:String},
    rate: {type:Number},
    screenNo: {type:Number}
})

var screen1Res
screen1model.find()
.then((output)=>{
      screen1Res = output
})
.catch((err)=>{
    console.log(err)
})

var screen2Res
screen2model.find()
.then((output)=>{
      screen2Res = output
})
.catch((err)=>{
    console.log(err)
})

var screen3Res
screen3model.find()
.then((output)=>{
      screen3Res = output
})
.catch((err)=>{
    console.log(err)
})

var moviesRes
moviesmodel.find()
.then((output)=>{
      moviesRes = output
})
.catch((err)=>{
    console,log(err)
})

app.set('view engine','hbs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
     extended: true
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"public")))


app.get('/',(req, res)=>{
    res.render("login")
})


app.get('/cinema',(req,res)=>{
    res.render("cinema",{
        movies:moviesRes,
        screen1:screen1Res,
        screen2:screen2Res,
        screen3:screen3Res
    })
})

app.post('/login',async (req,res)=>{
    const output = await readpeople(req.body.profile)
    const password = output[0].password
    if(password === req.body.password)
    {
        const secret = "abcalskdjf3oiuaisuflakjsdflsdkjflaksjfdlkjsfljk"
        const payload = {"profile":output[0].profile, "name":output[0].name, "headline":output[0].headline}
        const token = jwt.sign(payload,secret)
        res.cookie("token",token)
        res.redirect("/posts1")

    }
    else
    {
        res.send("Incorrect UserName or Password")
    }
    
})

app.get('/posts1',verifyLogin,async (req,res)=>{
    const output = await readposts1()
    res.render("posts",{
        data: output,
        userInfo: req.payload
    })
})

app.post('/like',async(req,res)=>{
     await likefun(req.body.content)
     res.redirect('/posts1')
})


app.post('/share',async(req,res)=>{
    await sharefun(req.body.content)
    res.redirect('/posts1')
})

app.post('/delete',async(req,res)=>{
    await  deletefun(req.body.content)
    res.redirect('/posts1')
})

app.post('/addposts1', async(req, res)=>{
    await insertposts1(req.body.profile,req.body.content)
    res.redirect("/posts1")

})





function verifyLogin(req, res, next){
    const secret = "abcalskdjf3oiuaisuflakjsdflsdkjflaksjfdlkjsfljk"
    const token = req.cookies.token
    jwt.verify(token, secret, (err,payload)=>{
        if (err) return res.sendStatus(403)
        req.payload = payload
    })
    next()
}

app.post('/addpeople', async (req,res )=>{
    if(req.body.password === req.body.cnfpassword)
    {
        await insertpeople(req.body.name, req.body.profile, req.body.password, req.body.headline, )
        res.redirect('/')
    }
    else
    {
        res.send("Password and Confirm Password did not Match")
    }

})


app.get('/register',(req,res)=>{
    res.render("register")
})

app.listen(3000,()=>{
    console.log("listening...")
})