const Users = require('../models/userModel')
const UserConnection = require("../models/userConnection")


const sendConnectionsHandler = async (req ,res)=>{
    try{

	const {email} = req.user

	const foundUser = await Users.findOne({email}).exec()

	if(!foundUser) return res.status(404).json({msg : 'user account has been deleted'})

	const userId = (await UserConnection.find({from : foundUser._id.toString()})).map(item => item.to.toString()) 

	const findConnectionUsers = (await Users.find({_id : userId})).map(item => {
	    return {id : item._id.toString(), email : item.email , profileImageUrl : item.profileImageUrl , fullName : item.fullName}
	} ) 

	res.status(200).json({msg:'successful retreival', result:findConnectionUsers , sender : req.user.fullName , senderId : foundUser._id.toString()})

    } catch (error) {
    	
	res.status(500).json({msg : `${error.stack}`})
    }
}

module.exports = {sendConnectionsHandler}
