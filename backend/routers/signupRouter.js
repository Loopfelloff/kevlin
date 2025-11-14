const express = require('express')
const Router = express.Router()
const {signupHandler} =  require('../controllers/signupController')


Router.route('/').post(signupHandler)


module.exports = Router

