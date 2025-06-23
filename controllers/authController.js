import User from '../models/user.js'
import bcrypt from 'bcrypt'
//import { login } from '../utils/loginUtils.js'

//function: login
//parameters: req, res
//returns:nothing
//description:testing function to redirect to the frontend login url
// export const login = async(req, res) => {
//      res.redirect(`${process.env.FRONTEND_URL}/login`)
// }

//function: register
//parameters: req, res, next
//returns: redirects to dashboard after registering new user
//description: takes in email, password, name, and role from the request body and creates a new user
//              this user is then saved to the databse if there is not one alreay present withe the email
export const register = async (req, res, next) => {
    const { email, password, name, role} = req.body
    try{
        //check if username already taken
        let user = await User.findOne({email})
        if(user){
            return res.status(409).json({message: 'User already exists'})
        }
        //save user to db
        const hashedPassword = await bcrypt.hash(password, 10)
        user = new User({name, email, password:hashedPassword, role})
        const registeredUser = await user.save()
        console.log("User registered")
        //login user to express-session using passport
        req.login(registeredUser, (error)=>{
            if(error) return next(error)
            //return res.redirect('/dashboard')
            return res.status(200).json('user registered successfully')
        })
        

    }catch(error){
        console.error('could not register', error)
        return res.status(500).json({message:'could not register user'})
    }
}