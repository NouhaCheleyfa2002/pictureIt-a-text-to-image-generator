import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    creditBalance: {type: Number, default: 5},
})

//if the user model already available then it will use that user model, if it's not then it will create the new user model using the schema
const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;