const jwt = require("jsonwebtoken");
// const dotenv =require('dotenv')

const generateToken = (userId) =>{
  
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};



module.exports = {generateToken};
