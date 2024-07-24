const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getsingleUsers,
  showCurrentUsers,
  UpdateUsers,
  UpdateUserspassword,
} = require("../constrollers/UserControler");
// const {starter}=require('../constrollers/RouteController');
router.route("/").get(getAllUsers);
router.route("/showme").get(showCurrentUsers);
router.route("/:id").get(getsingleUsers);
router.route("/updateuser").patch(UpdateUsers);
router.route("/UpdateUserspassword").post(UpdateUserspassword);
module.exports = router;
