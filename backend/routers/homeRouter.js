const express = require('express')
const Router = express.Router()
const {homeHandler} = require('../controllers/homeController')


Router.route('/').post(homeHandler)

module.exports = Router

