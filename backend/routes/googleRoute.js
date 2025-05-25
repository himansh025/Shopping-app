
const express = require("express");
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User= require('../models/UserModel')
const Seller= require('../models/SellerModel')
const { generateToken } = require("../middleware/generateToken");


router.post('/google' ,async (req, res) => {
  const { token, role } = req.body; // role: 'user' or 'seller'

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
  
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name,picture, sub } = payload;

    const username = email.split('@')[0] + '_' + sub.slice(-5); // e.g., johndoe_1a2b3

    let user;

    if (role === 'seller') {
      user = await Seller.findOne({
         $or:[
          {email},
          {username}
      ] 
     });
      if (!user) {
        user = await Seller.create({
          email,
          fullname: name,
          username,
          password: 123456,
          role:"seller",
          profileImage: picture,
          isVerified: true
        });
      }
    } else {
      user = await User.findOne({
        $or:[
            {email},
            {username}
        ]});
      if (!user) {
        user = await User.create({
          email,
          fullname: name,
          username,
          password: 123456,
          profileImage: picture,
          isVerified: true
        });
      }
    }

  const tokenjwt= await  generateToken(user._id);

    res.status(200).json({ token: tokenjwt, user });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
}
);

 module.exports = router;