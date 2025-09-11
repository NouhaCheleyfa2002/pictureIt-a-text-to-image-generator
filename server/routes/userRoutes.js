import express from 'express'
import {registerUser, loginUser, userCredits} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()
//userAuth middleware will convert the token into user id
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/credits',userAuth, userCredits)


export default userRouter

