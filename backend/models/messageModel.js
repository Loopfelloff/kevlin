const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender : {required : true , type:mongoose.Schema.Types.ObjectId},
    receiver : {required : true , type:mongoose.Schema.Types.ObjectId},
    message : {required : true , default:'' , type:String}
},{timestamps : true})

module.exports = mongoose.model('message', messageSchema)
