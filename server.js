const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cookieParcer = require("cookie-parser")
const fileUpload = require('express-fileupload')
const cors = require('cors')

const app = express()
app.use(cors())

//Middleware
app.use(express.json())
app.use(cookieParcer())
app.use(fileUpload({
    useTempFiles:true
}))

const PORT = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.json({msg:"This is msg"})
})

app.listen(PORT,()=>{
    console.log("Server is running");    
})



//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/upload'))


// Connect Mongodb
const URI = process.env.MONGODB_URL;

mongoose.connect(URI,{
    family: 4
}).then(()=>{
    console.log("MongoDB Connected");
}).catch(err =>{
    console.log(err);
    
})
