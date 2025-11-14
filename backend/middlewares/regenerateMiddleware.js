const User = require('../models/userModel')
const util = require('util')
const jwt = require('jsonwebtoken')
const verifyJWT = util.promisify(jwt.verify)

const regenerateMiddleware = async (req, res  , next)=>{
    
    try{
	const {refreshToken} = req.cookies	

	if(!refreshToken) return res.status(403).json({msg : 'login once again'})
	
	let foundUser = await verifyJWT(refreshToken , process.env.REFRESH_TOKEN_SECRET)

	let user = await User.findOne({email : foundUser.email}).exec()

	if(!user) res.status(404).json({msg: 'the user is deleted'})

	if(user.refreshToken !== refreshToken) return res.status(403).json({msg:'logged into another device relogin to access here'})

	const decoded = {
	    fullName : foundUser.fullName,
	    email : foundUser.email,
	    profileImageUrl : foundUser.profileImageUrl
	}

	const newAccessToken = jwt.sign(decoded , process.env.ACCESS_TOKEN_SECRET , {
	    expiresIn: '30m',
	})
	const newRefreshToken = jwt.sign(decoded , process.env.REFRESH_TOKEN_SECRET ,{
	    expiresIn: '30d',
	})

	req.cookies('accessToken' , newAccessToken , {
	    httpOnly:true, 
	    maxAge : 30*24*60*60*1000
	} )
	req.cookies('refreshToken' , newRefreshToken , {
	    httpOnly:true, 
	    maxAge : 30*24*60*60*1000
	} )

	user.refreshToken = newRefreshToken

	await user.save()

	req.user = decoded

	return next()
    }
    catch(err)
    {
	
	return res.status(500).json({msg : err.stack})
    }
    
}

module.exports = regenerateMiddleware
