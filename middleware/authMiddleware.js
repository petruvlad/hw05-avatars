const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
  
    const token = req.headers.authorization.replace("Bearer ", "");

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

 
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    
    if (!user) {
      throw new Error();
    }

    
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
}

module.exports = authMiddleware;
