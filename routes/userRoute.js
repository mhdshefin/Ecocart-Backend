import express from 'express'
import { adminLogin, getUser, loginUser, registerUser, updateUserName, updateUserProfile } from '../controller/userController.js'
import userAuth from '../middleware/userAuth.js'
import upload from '../middleware/multer.js'

const userRoter = express.Router()

userRoter.post('/login', loginUser)
userRoter.post('/register', registerUser)
userRoter.post('/adminlogin', adminLogin)
userRoter.post('/get', userAuth, getUser)
userRoter.put('/profile', upload.fields([{ name: 'profileImage', maxCount: 1 }]), userAuth, updateUserProfile)
userRoter.put('/username', userAuth, updateUserName)

export default userRoter