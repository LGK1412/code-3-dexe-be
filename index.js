const express = require('express');
const helmet = require('helmet');
const cors = require('cors')
const cookirParser = require('cookie-parser')
const mongoose = require('mongoose')
require('dotenv').config();

const passport = require('passport')
const GoogleStartegy = require('passport-google-oauth20')

const authRouter = require('./routers/authRouter.js')
const testRouter = require('./routers/testRouter.js')

const app = express()

//
const cookieParser = require('cookie-parser');

app.use(cookieParser());
//

app.use(cors()) // cái này thì tuỳ người để trống hoặc để  cái link của fe vào cho nó dảm bảo chỉ nhận cái fe đó 
app.use(helmet())
app.use(cookirParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connect DB successfull!")
}).catch((err) => {
    console.log('Connect DB failed...' + err)
})

app.use('/api/auth', authRouter)
app.use('/api/example', testRouter)

app.get('/', (req, res) => {
    res.json({ message: "Hello from server" })
})

app.listen(process.env.PORT, () => {
    console.log('listening...' + process.env.PORT)
})