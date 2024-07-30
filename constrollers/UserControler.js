const {StatusCodes}=require('http-status-codes');
const { CustomAPIError, UnauthenticatedError, NotFoundError, BadRequestError } =require('../errors');
 const Users=require('../models/User');
const User = require('../models/User');
const getAllUsers=async(req,res)=>
{
  const users = await Users.find({role:'user'}).select("-password");
       res.status(StatusCodes.OK).json(users);
}
const getsingleUsers = async (req, res) => {
  const id=req.params.id;
  console.log(req.params);
  if(!id) throw new BadRequestError('please provide the fcking id..');
  const user= await Users.findById({_id:id}).select('-password');
  if(!user)
    throw new NotFoundError('User does not exists');
  res.status(StatusCodes.OK).json(user);
};
const showCurrentUsers = async (req, res) => 
  {
  res.status(StatusCodes.OK).json({user:req.user});
};
const UpdateUsers = async (req, res) => {
 

};
const UpdateUserspassword = async (req, res) => 
  {
const {oldpassword,newpassword}=req.body;
 if(!oldpassword||!newpassword){
  throw new BadRequestError('plz provide both types of passwords..');
 }
 console.log(req.user);
 const user=await User.findOne({_id:req.user.userId});
 console.log(req.user);
 const isPasswordCorrect=await user.comparePassword(oldpassword);
 if(isPasswordCorrect) {
  throw new UnauthenticatedError('invalid credentials');
 }
 user.password=password;
 await user.save();
 res.status(StatusCodes.OK).json({msg:'Sucess password updated'});
};
module.exports=
{
    getAllUsers,getsingleUsers,showCurrentUsers,UpdateUsers,UpdateUserspassword
}