import express, { application } from 'express'
import {login, deleteAdmin, getUser} from '../controllers/loginController.js'
import { register } from '../controllers/registerController.js'
import User from '../models/user.js'
import passport from 'passport'
import {
    getOneUser,
    getAllUsers,
    addUser,
    editUser,
    deleteUser
} from '../controllers/userCRUDController.js'

//function name: requireAdmin
//input parameters: req, res, next:the next function which will be called after this middleware
//this function will authenticate that the user is 
//  1 logged in
//  2 is an admin
const requireAdmin = (req, res, next)=> {
    //todo authenticate admin
    next()
}

const router = express.Router()

router.post('/login', login)
router.get('/admin/user/:email', requireAdmin, getOneUser)
router.get('/admin/users', requireAdmin, getAllUsers)
router.post('/admin/addUser', requireAdmin, addUser)
router.put('/admin/editUser', requireAdmin, editUser)
router.delete('/admin/deleteUser',requireAdmin, deleteUser)

router.delete('/admin/delete', deleteAdmin)

//test function: getUsers
//function used for testing the database
const getUsers = async(req, res) => {
    try{
        const users = await User.find()
        if(!users) return res.status(404).json({message:"Lists not found"})
        res.status(200).json(users)
    }catch(error){
        console.error('could not get users', error)
    }
}
router.get('/', getUsers)
router.get('/getUser/:email', getUser)

router.post('/register', register)

//Google OAuth login
//uses google login to authenticate a user 
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    console.log('User authenticated successfully:', req.user?.email)
    res.redirect(`${process.env.FRONTEND_URL}/admin`)
  }
)
//Google OAuth logout
router.get('/auth/google/logout', (req, res, next) => {
    req.logout((err)=>{
        if(err){ 
            console.error('Google auth logout error:', err)
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
        name: req.user.name
      }
    });
  } else {
    res.json({ authenticated: false });
  }
})

export default router;