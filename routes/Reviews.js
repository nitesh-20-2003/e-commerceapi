const express = require("express");
const router = express.Router();
const {
  createReviews,
  getAllReviews,
  getSingleReviews,
  updateReviews,
  deleteReviews,
} = require("../constrollers/ReviewsControllers");
const {
  authenticatepayload,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .post([authenticatepayload, authorizePermissions("admin")], createReviews)
  .get(getAllReviews);

router
  .route("/:id")
  .get(getSingleReviews)
  .patch([authenticatepayload, authorizePermissions("admin")], updateReviews)
  .delete([authenticatepayload, authorizePermissions("admin")], deleteReviews);
module.exports = router;
