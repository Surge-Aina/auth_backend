import User from "../models/user.js"

export const register = async (req, res) => {
    const { email, password, name, role} = req.body
    try{
        //check if username already taken
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }
        //save user to db
        user = new User({name, email, password, role})
        const registeredUser = await user.save()
        return res.status(201).json(registeredUser)

    }catch(error){
        console.error('could not register', error)
        return res.status(500).json({message:'could not register user'})
    }
}