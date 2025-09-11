//we have to find the user id using the json web token
import jwt from 'jsonwebtoken'


const userAuth = async (req, res, next)=>{
    //we have to find the token
    const {token} =req.headers;

    if (!token) {
        return res.json({success:false, message:'Not authorized. Login again'});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            //convert the token into user id
            req.body.userId = tokenDecode.id;
        }else{
            return res.json({success:false, message:'Not authorized. Login again'});
        }

        //next method will execute the controller function that will return the user's credit 
        next();
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
};

export default userAuth;