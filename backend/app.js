require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookie_parser = require('cookie-parser')
const connectDB = require('./config/database')
const mongoose = require('mongoose')
const port = process.env.PORT || 5000

const corsOptions = require('./config/corsOptions')
const signupController = require('./routers/signupRouter')
const loginController  = require('./routers/loginRouter')
const verifyPassportJWT = require('./middlewares/verifyPassportJWT') 
const homeController =  require('./routers/homeRouter')
const cloudinaryMiddleware = require('./middlewares/cloudinaryMiddleware')
const profilePicController = require('./routers/profilePicRouter')
const googleController = require('./routers/googleLoginRouter')
const sendUserController  = require('./routers/sendUserRouter')
const userConnectionController = require('./routers/userConnectionRouter')

connectDB()

app.use(cookie_parser())
app.use(cors(corsOptions))
app.use(express.json())

app.use('/signup' , signupController)
app.use('/login' , loginController)
app.use('/auth' , googleController)

app.use('/home' , verifyPassportJWT)
app.use('/home' , homeController)

app.use("/uploadProfile", [verifyPassportJWT, cloudinaryMiddleware]);
app.use("/uploadProfile", profilePicController);

app.use("/sendUsers" , verifyPassportJWT)
app.use("/sendUsers", sendUserController)

app.use("/connectUser" , verifyPassportJWT)
app.use("/connectUser" , userConnectionController)


mongoose.connection.once("open", ()=>{
    console.log("connected to mongoDB")
    app.listen(port, '0.0.0.0', ()=>{
	console.log("the server is listening at port : " , port)
    })
})
