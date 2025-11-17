const express = require('express')
const Router = express.Router()
const {sendConnectionsHandler} = require('../controllers/sendConnectionsController')

Router.route('/').post(sendConnectionsHandler)

module.exports = Router
