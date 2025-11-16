const Users = require('../models/userModel')
const UserConnection = require('../models/userConnection')

const sendUserHandler = async (req , res)=>{
    try {

	const foundUser = await Users.findOne({email : req.user.email}).exec()

	if(!foundUser) return res.status(404).json({msg : 'the user has been deleted'})

	const connectionUsers = await UserConnection.find({from : foundUser._id.toString()})


	const connectionUsersId = connectionUsers.map(item => item.to.toString())

    
	const results = await Users.find()
	    
	const toSend = results.map(item =>{
	    return { id : item._id,  fullName : item.fullName , email : item.email , profileImageUrl : item.profileImageUrl}
	})

	const toSendFiltered = toSend.filter(item=>{
	    if (connectionUsersId.indexOf(item.id.toString()) === -1 && item.id.toString() !== foundUser._id.toString()) return true
	    else return false
	})

	res.status(200).json({msg: 'successful retreival' , result : toSendFiltered})
		
    } catch (error) {
	return res.status(500).json({msg : `${error.name}`})	
    }
}

module.exports = {sendUserHandler}
