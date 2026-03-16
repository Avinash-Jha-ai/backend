const blacklistModel = require("../models/blacklist.model");
const userModel =require("../models/user.model");
const jwt =require("jsonwebtoken");

async function authUser(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }

    const istokenblacklist =await blacklistModel.findOne({
        token
    })

    if(istokenblacklist){
        return res.status(401).json({
            message:"invalid token"
        })
    }

    let decoded
    try{
        decoded =jwt.verify(
            token,
            process.env.JWT_SECRET,
        )

        req.user =decoded

        next()
    }catch(err){
        return res.status(401).json({
            message:"invalid token"
        })
    }
}

module.exports ={authUser}