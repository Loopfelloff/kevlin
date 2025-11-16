const express = require('express')
const Router = express.Router()
const {userConnectionHandler} = require('../controllers/userConnectionController')

Router.route("/").post(userConnectionHandler)

module.exports = Router

