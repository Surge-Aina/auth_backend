import User from "../models/user.js";
import bcrypt from 'bcrypt'

//function: getOneUser
//parameters: req, res
//returns: user if present
//description: checks database for user based on the email in the url parameters
//              and returns it if found
export const getOneUser = async(req, res)=>{
    const {email} = req.params
    try{
        //check if user exists
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(404).json({message: 'email not found'})
        }
         res.status(200).json(user)
    }catch(error){
        console.error('could not find user')
         res.status(500).json({error: 'error finding user'})
    }
}
//function: getAllUsers
//parameters:req, res
//returns:list of all users 
//description: returns list of all users in the database
export const getAllUsers = async(req, res)=>{
    try{
        const users = await User.find()
        if(!users){
            return res.status(400).json({message: 'no users found'})
        }
         res.status(200).json(users)
    }catch(error){
        console.error('could not find users')
         res.status(500).json({error: 'error finding users'})
    }

}
//function: addUser
//parameters:req, res
//returns: the user that was added to the data
//description: adds a user to the database and returns that user once 
//          they are added to the database
export const addUser = async(req, res)=>{
    const {name, email, password, role} = req.body
    try{
        //check if user exists
        let user = await User.findOne({email:email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }
        user = User.create(name, email, password, role)

        res.status(201).json(user)
    }catch(error){
        console.error('could not find user')
         res.status(500).json({error: 'error finding user'})
    }
    
}
//function: editUser
//parameters:req, res
//returns:user that was edited
//description:checks that the user exists and then edits that user,
//          returning the user after being edited
export const editUser = async(req, res)=>{
    const {email} = req.body
    const updateData = req.body
    try{
        if(updateData.password){
            updateData.password = await bcrypt.hash(updateData.password, 10)
        }
        const updatedUser = await User.findOneAndUpdate(
            {email},
            {$set: updateData},
            {new: true}//return updated document
        )
        if(!updatedUser){
            return res.status(404).json({message: 'User not found'})
        }
        res.status(200).json({message: 'User updated successfully', user: updatedUser})
    }catch(error){
        console.error('error updating user', error)
        res.status(500).json({message: 'unable to update user'})
    }
    
}
//function: deleteUser
//parameters:req, res
//returns:deleted user
//description:cheks if user exists and deletes that user
export const deleteUser = async(req, res)=>{
    const {email} = req.params
    try{
        let user = await User.findOneAndDelete({email:email})
        if(!user){
            console.log('user not found for deletion')
            return res.status(400).json({message: 'no user found for deletion'})
        }
        res.status(200).json({message:`user ${user.email} deleted`})
    }catch(error){
        return res.status(500).json({message: 'error deleting user'})
    }
    
}

//function: deleteSelf
//parameters:req, res
//returns:deleted user
//description:allows any user to delete their own account
export const deleteSelf = async(req,res)=>{
    //check if user is authenticated/logged in
    if(req.isAuthenticated()){
        try{
            let deletedUser = User.deleteOne({email:req.user.email})
            res.status(200).json({message:`deleted user ${deletedUser.email}`})
        }catch(error){
            console.log(error)
            res.status(500).json({message:'unable to delete own account'})
        }
    }else{
        res.status(401).json({message:'user is not loggedin'})
    }
    
}

export const getUsersByManager = async(req, res) => {
    const {managerEmail} = req.params
    try{
        const userList = User.find({manager: managerEmail})
        if(!userList) return res.status(404).json({message:'no workers found'})
        res.status(200).json(userList)
    }catch(error){
        console.error('error finding users by email ', error)
        res.status(500).json({message:'error finding users by manager'})
    }
}