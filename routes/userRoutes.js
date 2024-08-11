const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getsingleUsers,
  showCurrentUsers,
  UpdateUsers,
  UpdateUserspassword,
} = require("../constrollers/UserControler");
const {authenticatepayload,authorizePermissions}=require('../middleware/authentication');
// const {starter}=require('../constrollers/RouteController');
router.route("/").get(authorizePermissions('admin','owner'),getAllUsers);
router.route("/showme").get(showCurrentUsers);
router.route("/updateuser").patch(UpdateUsers);
router.route("/UpdateUserspassword").post(UpdateUserspassword);
router.route("/:id").get(getsingleUsers);
module.exports = router;
