const User = require('../models/userModel.js')

const formValidation = function(username, password , email){
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // the first one is for email
    
    const isEmailValid = regex.test(email)

    regex = /^(?=.*\d)(?=.*\W).{8}$/ 

    const isPasswordValid = regex.test(password)

    return {isUsernameValid: (username.length >= 8) ? true : false , isPasswordValid , isEmailValid}
}

const signupHandler = async (req ,res ,next)=>{

    try {
	if(!req.body?.email ||  req.body?.email.trim() === '') return res.status(400).json({msg : 'missing email in the request header'}) 
	if(!req.body?.password || req.body?.password.trim() === '') return res.status(400).json({msg : 'missing password in the request header'}) 
	if(!req.body?.password || req.body?.username.trim() === '') return res.status(400).json({msg : 'missing username in the request header'}) 

	const {username , email , password} = req.body

	const {isUsernameValid, isPasswordValid , isEmailValid} = formValidation(username, password , email)

	if(!isUsernameValid) return res.status(400).json({msg : 'wrong username format used'}) 
	if(!isEmailValid) return res.status(400).json({msg : 'wrong email format used'}) 
	if(!isPasswordValid ) return res.status(400).json({msg:'wrong password format used'})
	
	const foundUser = await User.findOne({email}).exec()
	
	if(foundUser) return res.status(409).json({msg :'user with the same email already exists'})

	const result = await User.create({
	    fullName : username,
	    email : email,
	    password : password
	})


	return res.status(200).json({msg : 'successful' , result }) 
    	
    } catch (err) {		
	return res.status(500).json({msg : `${err.name}`})
    }

}

module.exports = {signupHandler}
