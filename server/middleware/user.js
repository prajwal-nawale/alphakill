// const jwt=require("jsonwebtoken");
// const { JWT_USER_SECRET }=process.env
// function userMiddleware(req,res,next){
//     const token=req.headers.token;
//     const decoded=jwt.verify(token,JWT_USER_SECRET);
//     if(!decoded){
//         res.status(403).json({
//             message:"user not authenticated"
//         })
//     }else{
//     req.userId=decoded.id;
//     next();
//     }

// }

// module.exports={
//     userMiddleware: userMiddleware
// }


const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = process.env;

function userMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    
    if (!authHeader) {
      return res.status(403).json({
        message: "No token provided",
        success: false
      });
    }
    
    // Handle both "Bearer token" and just "token" formats
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!token) {
      return res.status(403).json({
        message: "No token provided",
        success: false
      });
    }
    
    const decoded = jwt.verify(token, JWT_USER_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({
        message: "Invalid token",
        success: false
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({
        message: "Token expired",
        success: false
      });
    }
    
    res.status(500).json({
      message: "Internal server error during authentication",
      success: false
    });
  }
}

module.exports = {
  userMiddleware
};