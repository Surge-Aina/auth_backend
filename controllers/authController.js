import User from '../models/user.js'
import bcrypt from 'bcrypt'
import axios from 'axios'
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
export const register = async(req, res, next) => {
    const { email, password, name, role } = req.body
    try {
        //check if username already taken
        let user = await User.findOne({ email })
        if (user) {
            return res.status(409).json({ message: 'User already exists' })
        }

        // Proxy registration to Jaskaran's API
        const EMAIL_API_BASE = process.env.VITE_API_BASE || 'https://verify-email-server.onrender.com'
        try {
            const response = await axios.post(`${EMAIL_API_BASE}/register`, req.body, {
                    headers: { 'Content-Type': 'application/json' }
                })

            return res.status(response.status).json(response.data)
        } catch (apiError) {
            return res.status(apiError.response?.status || 500).json(apiError.response?.data || { error: 'Registration failed' })
        }
    } catch (error) {
        console.error('could not register', error)
        return res.status(500).json({ message: 'could not register user' })
    }
}