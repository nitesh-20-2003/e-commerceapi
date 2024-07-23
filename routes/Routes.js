const express = require("express");
const router = express.Router();
const {register,login,logout}=require('../constrollers/AuthControllers');
// const {starter}=require('../constrollers/RouteController');
router.route('/logout').get(logout);
router.route("/register").post(register);
router.route("/login").post(login);
module.exports = router;
