const JWTStrategy = require('passport-jwt').Strategy
const passport = require('passport')
const User = require('../models/userModel')

let cookieExtractor = (req)=>{
    let accessToken = null

    if(req?.cookies)
	{
	accessToken = req.cookies['accessToken']
    }

    return accessToken
}

let option = {
    jwtFromRequest:cookieExtractor,
    secretOrKey : process.env.ACCESS_TOKEN_SECRET
}

passport.use(new JWTStrategy(option , async (payload, cb)=>{
    try{
	const foundUser = await User.findOne({email : payload?.email})
	const toSend = {
	    fullName : foundUser.fullName,
	    email : foundUser.email,
	    profileImageUrl : foundUser.profileImageUrl
	}

	if(foundUser) cb(null , toSend)
	else cb(null , false)
    }
    catch(error){
	return cb(error)	// network error
    }
}))
