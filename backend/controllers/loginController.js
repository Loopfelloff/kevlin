const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const loginHandler = async (req ,res ,next)=>{

    try {
	if(!req.body?.email ||  req.body?.email.trim() === '') return res.status(400).json({msg : 'missing email in the request header'}) 
	if(!req.body?.password || req.body?.password.trim() === '') return res.status(400).json({msg : 'missing password in the request header'}) 

	const { email , password} = req.body

	
	const foundUser = await User.findOne({email}).exec()
	
	const result = await User.verifyUser(email , password)

	const payload = {email : foundUser.email , username : foundUser.fullName ,profileImageUrl : foundUser.profileImageUrl  } 

	const accessToken =  jwt.sign(payload , process.env.ACCESS_TOKEN_SECRET , {expiresIn : '30m'})
	const refreshToken = jwt.sign(payload , process.env.REFRESH_TOKEN_SECRET , {expiresIn : '30d'})

	res.cookie( 'accessToken' , accessToken , {
	    httpOnly : true,
	    maxAge : 30 * 24 * 60 * 60 * 1000
	} )
	res.cookie( 'refreshToken' , refreshToken , {
	    httpOnly : true,
	    maxAge : 30 * 24 * 60 * 60 * 1000
	} )

	foundUser.refreshToken = refreshToken

	await foundUser.save()

	return res.status(200).json({msg : 'successfully logged in' , result: payload }) 
    	
    } catch (err) {		
	return res.status(500).json({msg : `${err.name}`})
    }

}

module.exports = {loginHandler}
