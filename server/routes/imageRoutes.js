import express from 'express'
import { generateImage } from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

//provide the user id using the middleware userAuth
imageRouter.post('/generate-image', userAuth, generateImage)

export default imageRouter