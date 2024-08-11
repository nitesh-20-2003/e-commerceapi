const express = require("express");
const router = express.Router();
const { authenticatepayload,authorizePermissions } = require('../middleware/authentication');

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../constrollers/ProductsControllers");

const {
  getSingleProductReviews,
} = require("../constrollers/ReviewsControllers");
router
  .route("/")
  .post([authenticatepayload,authorizePermissions("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticatepayload,authorizePermissions("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticatepayload,authorizePermissions("admin")], updateProduct)
  .delete([authenticatepayload,authorizePermissions("admin")], deleteProduct);

  router.route('/:id/reviews').get(getSingleProductReviews);
module.exports = router;
