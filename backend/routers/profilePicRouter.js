const express = require('express')
const Router = express.Router()
const {handleProfilePic} = require('../controllers/profilePicController')
Router.route('/').post(handleProfilePic)
module.exports = Router
