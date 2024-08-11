// packages
const express=require('express');
require('dotenv').config();
const app=express();
require('express-async-errors');
const morgan=require('morgan');
const cookie_parser=require('cookie-parser');
const fileUpload=require('express-fileupload');
const jwt=require('jsonwebtoken')
const rateLimiter=require('express-rate-limit');
const helmet=require('helmet');
const xss =require('xss-clean');
const cors=require('cors');
const mongoSanitizer=require('express-mongo-sanitize');
//db
const connectDB=require('./db/connect');
//routes
const router=require('./routes/Routes');
const productRouter=require('./routes/ProductRoutes');
const Reviews=require('./routes/Reviews');
const Orders=require('./routes/Orders');
const {
  authenticatepayload,
  authorizePermissions
} = require("./middleware/authentication");
const userroute=require('./routes/userRoutes')
const authrouter=require('./routes/Routes');


// error_handler middleware
const notFound=require('./middleware/not-found');
const error_handler=require('./middleware/error-handler');
// middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('./public'))
app.use(cookie_parser(process.env.jwt_secret));
app.set('trust proxy',1);
app.use(rateLimiter({
  windowMs:15*60*1000,
  max:60,
}))
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitizer());
app.use(express.static('./public'));
app.use(fileUpload())


// routes 
app.get('/api/v1',(req,res)=>
    {
      console.log(req.signedCookies);
      res.send(req.signedCookies);
})
app.use('/api/v1/auth',authrouter);
app.use("/api/v1/users",authenticatepayload,userroute);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/Reviews',Reviews);
app.use('/api/v1/Orders',Orders);

app.use(notFound);
app.use(error_handler);

const port=process.env.PORT||3000;
(async()=>{
try {
    await connectDB(process.env.Mongo_Uri);
   app.listen(port,console.log(`im listning at port ${port}....`))
} catch (error) {
    
    console.log(error);
}
})();

