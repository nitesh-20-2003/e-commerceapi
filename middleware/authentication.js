const { CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,UnautthorizedError}=require('../errors');
  const {
      createjwt,
  isvalidtoken,
  attach_cookietoresp
  }=require('../utils');
  const authenticatepayload=async(req,res,next)=>{
    const token = req.signedCookies.token;
    if(!token)
        {
           throw new UnauthenticatedError('Authentication Invalid..')
        }
        try {
            const payload=isvalidtoken({token});
            req.user = { name: payload.name, payload_id: payload.user_id, role: payload.role };
            next();
        } catch (error) 
        {
            throw new UnauthenticatedError('Authentication Invalid');
        }
  };
  const authorizePermissions=(...roles)=>
 {
  return async(req,res,next)=>{
    if(!roles.includes(req.user.role))
      {
        throw new UnautthorizedError('unauthrized to acess...')
      };

    next();
  };
   
  };
  module.exports ={authenticatepayload,authorizePermissions};