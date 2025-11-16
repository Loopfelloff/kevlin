const User = require("../models/userModel")
const UserConnection = require("../models/userConnection")

const userConnectionHandler = async (req, res)=>{

    try {

	if(!req.body.connectionId) return res.status(400).json({msg : 'missing connectionId in the req header'})

	const {connectionId} = req.body

	const foundUser = await User.findOne({email : req.user.email}).exec()

	if(!foundUser) return res.status(404).json({msg : 'the user account has been deleted'})

	const foundReceiverUser = await User.findOne({_id : connectionId}).exec()

	if(!foundReceiverUser) return res.status(404).json({msg : 'the receiver account has been deleted'})

	const duplication = await UserConnection.findOne({to : connectionId}).exec()

	if(duplication) return res.status(409).json({msg : 'connection already established'}) 

	const result = await UserConnection.create({
	    from : foundUser._id, 
	    to : foundReceiverUser._id 
	})


	res.status(200).json({msg : 'connection established'})
    	
    } catch (error) {
	res.status(500).json({msg : `${error.stack}`})	
    }

}

module.exports = {userConnectionHandler}


