import dotenv from 'dotenv'
dotenv.config()

import express, { application } from 'express'
import {register} from '../controllers/authController.js'
import User from '../models/user.js'
import passport from 'passport'
import {
    getOneUser,
    getAllUsers,
    addUser,
    editUser,
    deleteUser,
    deleteSelf,
    getUsersByManager
} from '../controllers/userCRUDController.js'
import axios from 'axios';

//function name: requireAdmin/requireManager
//input parameters: req, res, next:the next function which will be called after this middleware
//this function will authenticate that the user is 
//  1 logged in
//  2 is an admin/manager
const requireAdmin = (req, res, next)=> {
    console.log("req.session.user: " , req.session.user)
    console.log("req.user: " , req.user)
    if(req.isAuthenticated()){
      if(req.user.role === 'admin'){
        console.log('Admin logged in')
        return next()
      }
      return res.status(401).json({message:'Unathorized'})
    }
    //res.redirect(`${process.env.FRONTEND_URL}/login`)//user not logged in, redirected to login page
    return res.status(401).json({message:'Unathorized'})
}
const requireManager = (req, res, next) => {
  if(req.isAuthenticated()){
    if(req.user.role === 'manager'){
      console.log('Manager logged in')
      return next()
    }
    return res.status(401).json({message:'Unathorized'})
  }
  //res.redirect(`${process.env.FRONTEND_URL}/login`)//user not logged in, redirected to login page
  return res.status(401).json({message:'Unathorized'})
}
const requireAuth = (req, res, next)=>{
  if(req.isAuthenticated()){
    return next()
  }else{
    return res.status(401).json({message:'Unauthorized'})
  }
}

const router = express.Router()

router.post('/register', register)
router.get('/user/:email', requireAdmin, getOneUser)
router.get('/users',  getAllUsers)
router.post('/addUser', requireAdmin, addUser)
router.put('/editUser', requireAdmin, editUser)
router.delete('/deleteUser/:email', deleteUser)
router.delete('/deleteSelf', requireAuth, deleteSelf) 
router.get('/getUsersByManager/:managerEmail', requireManager, getUsersByManager)

//Passport Local login (email and password)
// router.post('/auth/login', 
//   passport.authenticate('local', {
//     // successRedirect: `${process.env.FRONTEND_URL}/dashboard`,
//     // failureRedirect:  `${process.env.FRONTEND_URL}/login`

//   })
// )
router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    req.logIn(user, (err) => {
      if (err) return next(err)
      console.log('User authenticated with email/password successfully:', req.user?.email)
      return res.status(200).json({ 
        message: 'Login successful', 
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      })
    })
  })(req, res, next)
})
router.post('/auth/login', async (req, res) => {
  const EMAIL_API_BASE = process.env.VITE_API_BASE || 'https://verify-email-server.onrender.com';
  try {
    const response = await axios.post(`${EMAIL_API_BASE}/api/auth/login`, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (apiError) {
    res.status(apiError.response?.status || 500).json(apiError.response?.data || { error: 'Login failed' });
  }
});

//Google OAuth login
//uses google login to authenticate a user 
//called on front end
router.get('/auth/google', (req, res, next) =>{
  const { role } = req.query  //check if role query parameter was passed in url example: localhost:5000/auth/google?role=admin
  if(role){
    req.session.role = role //if role was passed in query parameters save to session 
  }else{req.session.role = 'customer'}
  next() //go to passport.authenticate
  }, passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'consent' }))//consent is so google displays concent screen
//google auth will call this 
//do not call this route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    //session now active
    console.log('User authenticated with google successfully:', req.user?.email)
    res.redirect(`${process.env.FRONTEND_URL}/${req.user.role}`) //redirects user to specific role dashboard
  }
)
//logout
router.get('/auth/logout', (req, res, next) => {
    req.logout((err)=>{
        if(err){ 
            console.error('logout error:', err)
            return next(err) 
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid')
            res.status(200).json({message:'logged out sucessfully'})
        })
    })
})

//check auth status
//check the status of a user if they are authenticated or not
router.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
      }
    });
  } else {
    res.json({ authenticated: false });
  }
})

const EMAIL_API_BASE = process.env.VITE_API_BASE || 'https://verify-email-server.onrender.com';

export default router;