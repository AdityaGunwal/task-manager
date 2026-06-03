require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function auth(req,res,next){

    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            message:"No token"
        });
    }

    try{

        const decoded =
        jwt.verify(token,SECRET);

        req.user = decoded;

        next();

    }
    catch{

        res.status(401).json({
            message:"Invalid token"
        });

    }

}

module.exports = auth;