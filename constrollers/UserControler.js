const {StatusCodes}=require('http-status-codes');
const { CustomAPIError, UnauthenticatedError, NotFoundError, BadRequestError } =require('../errors');
 const Users=require('../models/User');
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
const showCurrentUsers = async (req, res) => {
  res.send("show current users");
};
const UpdateUsers = async (req, res) => {
  res.send("update users");
};
const UpdateUserspassword = async (req, res) => {
  res.send("Updare password");
};
module.exports=
{
    getAllUsers,getsingleUsers,showCurrentUsers,UpdateUsers,UpdateUserspassword
}