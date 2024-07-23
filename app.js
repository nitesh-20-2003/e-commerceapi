const express=require('express');
require('dotenv').config();
const app=express();
require('express-async-errors');
const morgan=require('morgan');
const cookie_parser=require('cookie-parser');
const jwt=require('jsonwebtoken')
//db
const connectDB=require('./db/connect');

//routes
const router=require('./routes/Routes');
const authrouter=require('./routes/Routes');
// error_handler middleware
const notFound=require('./middleware/not-found');
const error_handler=require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('./public'))
app.use(cookie_parser(process.env.jwt_secret));
app.get('/',(req,res)=>
    {
      console.log(req.signedCookies);
    res.send('hello world');
})
app.use('/api/v1/auth',authrouter);
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
