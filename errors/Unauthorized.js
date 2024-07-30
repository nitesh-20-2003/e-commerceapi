const { request } = require('express');
const {StatusCodes}=require('http-status-codes');
const  CustomAPIError=require('./custom-api');
class UnautthorizedError extends CustomAPIError
{
    constructor(message){
        super(message);
        this.statusCode=StatusCodes.FORBIDDEN;
    }

}
module.exports =UnautthorizedError;