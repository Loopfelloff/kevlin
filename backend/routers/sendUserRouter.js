const express = require('express')
const Router = express.Router()
const {sendUserHandler} = require("../controllers/sendUsers")


Router.route("/").post(sendUserHandler)

module.exports = Router
