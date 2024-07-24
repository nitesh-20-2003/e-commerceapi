const { CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError}=require('../errors');
  const {
      createjwt,
  isvalidtoken,
  attach_cookietoresp
  }=require('../utils');
  const authenticateUser=async(req,res,next)=>{
    const token = req.signedCookies.token;
    if(!token)
        {
            console.log('error,no token present');
        }
        console.log('token present');
        next();
  };
  module.exports =authenticateUser;