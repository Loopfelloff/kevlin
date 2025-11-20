// monkey boy i will fuck you
const express = require('express')
const {createServer} = require("http")
const app = express()
const {Server} = require('socket.io')
const server = createServer(app) 

const userMap= {}

const io = new Server(server ,{ 
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})


io.on('connection' , (socket)=>{
    console.log(`${socket.id}: has connected`)
    socket.on('register', (fullName)=>{
	userMap[fullName] = socket.id
	console.log(userMap)	
    })
    socket.on('sendMessage' , (message , receiver , sender , senderId)=>{
	console.log(`message`)
	console.log(message)
	console.log(`receiver`)
	console.log(receiver[0].id)
	console.log(`sender`)
	console.log(sender)
	console.log(`senderId`)
	console.log(senderId)
	console.log(userMap[receiver[0].fullName])
	io.to(userMap[receiver[0].fullName]).emit('receiveMessage' , message , sender , senderId)
    })
    socket.on('disconnect', (reason)=>{
	console.log(`${userMap[socket.id]} disconnected becuase of : ${reason}`)
    })
})


module.exports = {io , server, app , express}
