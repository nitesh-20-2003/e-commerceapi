const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
const jwt = require("jsonwebtoken");
const { createjwt,
  isvalidtoken,
  attach_cookietoresp} = require('../utils');
const register = async (req, res, next) =>
   {
    const {email,name,password}=req.body;
    const emailAlreadyexits=await User.findOne({email});
    if(emailAlreadyexits){
        throw new BadRequestError('email already exists')
    }
    // first registered user is an admin
    const isFirstAccount=(await User.countDocuments({}))===0;
    const role=isFirstAccount? "admin":"user";
  try {
    const user = await User.create({name,email,password,role});
    const tokenUser={name:user.name,user_id:user._id,role:user.role};
    attach_cookietoresp({ res, user:tokenUser});
    // res.status(StatusCodes.CREATED).json({ user:tokenUser});
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") 
        {
            console.log(error)
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    next(error); // Pass other errors to the error handling middleware
  }
};

const login = async (req, res) =>
   {
 const {email,password}=req.body;
 if(!email||!password) {throw new BadRequestError('provide both credentials'); }
  const user=await User.findOne({email});
  if(!user) {throw new UnauthenticatedError('no account find register plz');}
  const ispasswordcorrect = await user.comparePassword(password);
  if(!ispasswordcorrect){throw new UnauthenticatedError("no account find register plz");}
   const tokenUser = { name: user.name, user_id: user._id, role: user.role };
   attach_cookietoresp({ res, user: tokenUser });
   res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const logout = async (req, res) => {
res.cookie("token", "logout", {
  httpOnly: true,
  expires: new Date(Date.now() + 6*1000),
});
res.status(StatusCodes.OK).json({msg:`user logedout`})
};
module.exports = {
  register,
  login,
  logout,
};
