import express from 'express'
import {loginAdmin, loginManager, loginWorker, loginCustomer} from '../controllers/loginController.js'
import { register } from '../controllers/registerController.js'
import User from '../models/user.js'

const router = express.Router()

router.post('/login/admin', loginAdmin)
router.post('/login/manager', loginManager)
router.post('/login/worker', loginWorker)
router.post('/login/customer', loginCustomer)



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



router.post('/register', register)

export default router;