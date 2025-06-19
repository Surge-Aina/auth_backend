import User from "../models/user.js";

//function: getOneUser
//parameters: req, res
//returns: user if present
//description: checks database for user based on the email in the url parameters
//              and returns it if found
export const getOneUser = async(req, res)=>{
    const {email} = req.params.email
    try{
        //check if user exists
        const user = await User.findOne({email})
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
         res.status(200).json(user)
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
        let user = await User.findOne({email})
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
    try{

    }catch(error){

    }
    
}
//function: deleteUser
//parameters:req, res
//returns:deleted user
//description:cheks if user exists and deletes that user
export const deleteUser = async(req, res)=>{
    try{

    }catch(error){

    }
    
}
