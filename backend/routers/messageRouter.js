const express = require('express')
const Router = express.Router()
const {sendMessage , getMessage} = require('../controllers/messageController')

Router.route("/").post(sendMessage)
Router.route("/getMessage").post(getMessage)

module.exports  = Router
