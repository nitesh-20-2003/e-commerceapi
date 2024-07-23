const jwt=require('jsonwebtoken');
const { StatusCodes } = require("http-status-codes");
const createjwt=({payload})=>
    {
    const token=jwt.sign(payload,process.env.jwt_secret,{
        expiresIn:process.env.expiry
    })
    return token;
}
 const attach_cookietoresp=({res,user})=>
    {
      const token = createjwt({ payload: user});
      const oneDay = 1000 * 60 * 60 * 24;
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure:process.env.NODE_ENV==='production',
        signed:true,
      })
     
     return  res.status(StatusCodes.CREATED).json({ user:user});
    }
const isvalidtoken=({token })=>jwt.verify(token,process.env.jwt_secret)
module.exports = {
  createjwt,
  isvalidtoken,
  attach_cookietoresp,
};