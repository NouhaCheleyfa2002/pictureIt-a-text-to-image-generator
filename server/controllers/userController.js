import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const registerUser = async (req, res)=>{
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.json({success:false, message:'missing details'})
        }

        //encrypt the password that is givin by user    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //create object where we will store all the user's data that will be stored in the database
        const userData = {
            name,
            email,
            password: hashedPassword
        }

        //save the user data in the mongodb
        const newUser = new userModel(userData)
        const user = await newUser.save()

        //generate token with unique id
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        //send this token in the response
        res.json({success: true, token, user: {name: user.name}}
        )

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
}


const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body;
        //find the user with the email id provided
        const user = await userModel.findOne({email})

        if(!user){
          return res.json({success:false, message:'user does not exist'})
        }

        //compare passwords
        const isMatch = await  bcrypt.compare(password, user.password)

        if (isMatch) {
            //generate one token and send it in the response
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

             res.json({success: true, token, user: {name: user.name}})

        }else{
            return res.json({success:false, message:'invalid credentials'})
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const userCredits = async (req, res)=>{
    try {
        const {userId} = req.body
        //we want to add one middleware that will find the user id from the token and add it in the body

        //find the user by id
        const user = await userModel.findById(userId)
        res.json({success: true, credits: user.creditBalance, user:{name: user.name}})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


export {registerUser, loginUser, userCredits}