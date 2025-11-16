const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userConnectionSchema = new Schema({
    from : {required : true , type: mongoose.Schema.Types.ObjectId},
    to : {required : true , type: mongoose.Schema.Types.ObjectId}
}, {timestamps : true})
module.exports = mongoose.model('userconnection' , userConnectionSchema)
