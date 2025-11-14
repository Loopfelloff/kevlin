const regenerateMiddleware = require('./regenerateMiddleware')
const passport = require('passport')
require('../config/passport')

const verifyPassportJWT = (req, res ,next)=>{
    const jwtResolvingFunction = (err, user ,info)=>{

	if(err) res.status(500).json({msg : err}) // network failure types.

	if (!user){
	    return regenerateMiddleware(req, res ,next)
	} 

	req.user = user


	return next()

    }
    const verification = passport.authenticate('jwt' , {session:false} , jwtResolvingFunction)
    verification(req, res , next)
}

module.exports  = verifyPassportJWT 

