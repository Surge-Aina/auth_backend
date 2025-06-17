import User from '../models/user.js'

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'username not found'})
        }
        //validate password
        if(password === user.password){
            return res.status(200).json(user)
        }
        else{
            return res.status(400).json({message: 'password incorrect'})
        }
    }catch(error){
        console.error('could not login')
    }
}