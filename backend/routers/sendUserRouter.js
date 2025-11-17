const express = require('express')
const Router = express.Router()
const {sendUserHandler} = require("../controllers/sendUsersController")


Router.route("/").post(sendUserHandler)

module.exports = Router
