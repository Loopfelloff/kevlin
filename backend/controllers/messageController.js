const User = require("../models/userModel")
const Message = require("../models/messageModel")


const sendMessage = async(req, res)=>{
    try {
    	
	if(!req.body.receiver) return res.status(400).json({msg:'missing receiver in the request header'})
	if(!req.body.message) return res.status(400).json({msg:'missing message in the request header'})

	let {receiver , message} = req.body

	message = message.trim()

	const foundUser = await User.findOne({email : req.user.email}).exec()

	if(!foundUser) return res.status(404).json({msg : 'the user account has been deleted'})

	const foundReceiver = await User.findOne({_id : receiver}).exec()

	if(!foundReceiver) return res.status(404).json({msg:'the receiver no longer exists'})

	const result = await Message.create({

	    sender  : foundUser._id	,
	    receiver : foundReceiver._id,
	    message : message
	})

	console.log(result)

	res.status(200).json({msg : 'successful insertion of message'})

    } catch (error) {
    	
	res.status(500).json({msg : error.stack})
    }
}

const getMessage = async(req, res)=>{
    try {
    	
	if(!req.body?.communicator) return res.status(400).json({msg:'missing receiver in the request header'})

	const {communicator}  = req.body

	const foundUser = await User.findOne({email : req.user.email}).exec()

	if(!foundUser) return res.status(404).json({msg : 'the user account has been deleted'})

	const foundCommunicator = await User.findOne({_id : communicator}).exec()

	if(!foundCommunicator) return res.status(404).json({msg:'the receiver no longer exists'})


	const messages = (await Message.find({$or: [{ sender : foundUser._id.toString() , receiver : foundCommunicator._id.toString() } , {sender: foundCommunicator._id.toString(), receiver : foundUser._id.toString()}]})).map(item=>{
	    return (item.sender.toString() === foundUser._id.toString() ) ? {sentByMe : true , message : item.message , messageId : item._id.toString()} : {sentByMe : false , message : item.message , messageId : item._id.toString()} 
	})
	

	res.status(200).json({msg : 'successful retrieval' , result : messages})


	

    } catch (error) {
    	
	console.log(error.stack)
	res.status(500).json({msg : error.stack})
    }
}


module.exports = {sendMessage , getMessage}
