import User from '../models/user.js'
//import { login } from '../utils/loginUtils.js'

//function: login
//parameters: req, res
//returns:nothing
//description:testing dunction to redirect to the frontend login url
export const login= async(req, res) => {
     res.redirect(`${process.env.FRONTEND_URL}/login`)
}

//function: deleteAdmin
//parameters:req, res
//returns:deleted user email
//description:deletes an admin from the database and returns that users email
export const deleteAdmin = async(req, res) => {
    const {email} = req.body;
    try{
        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'email not found'})
        }
        const deletedUser = await User.deleteOne({email})
        return res.status(200).json(deletedUser.email)
    }catch(error){
        console.error('could not delette user')
        return res.status(500).json({error: 'could not delete user'})
    }
}

//function: getUser
//parameters: req, res
//returns: user
//description: checks if user exists and returns user 
export const getUser = async(req, res) => {
    const email = req.params.email
    try{
        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'email not found'})
        }
         res.status(200).json(user)
    }catch(error){
        console.error('could not find user')
         res.status(500).json({error: 'error finding user'})
    }
}