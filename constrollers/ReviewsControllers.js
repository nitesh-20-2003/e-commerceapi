const Reviews = require("../models/Review");
const Product = require("../models/Product");

const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
const {
  createjwt,
  isvalidtoken,
  attach_cookietoresp,
  CreateUserToken,
} = require("../utils");
const path = require("path");
const { findOneAndUpdate } = require("../models/User");

const createReviews = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findById({ _id: productId });
  console.log(isValidProduct);
  if (!isValidProduct) {
    throw new NotFoundError(`no product with id: ${productId}`);
  }
  const alreadySubmitted = await Reviews.findOne({
    product: productId,
    user: req.user.payload_id,
  });
  if (alreadySubmitted) {
    throw new BadRequestError(`already submiitd revies for the product`);
  }
  req.body.user = req.user.payload_id;
  const review = await Reviews.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
  res.send("review created");
};

const getAllReviews = async (req, res) => {
  const AllReviews = await Reviews.find({}).populate({
    path:'product',
    select:'name price'
  });
  res.status(StatusCodes.OK).json({ AllReviews });
};

const getSingleReviews = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const Review = await Reviews.findOne({ _id: id });
  res.status(StatusCodes.OK).json({ Review: Review });
};

const updateReviews = async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const existingReview = await Reviews.findById(id);
  if (!existingReview) {
    throw new BadRequestError("No review exists for the given id");
  }

  if (req.user.role !== "admin") {
    throw new BadRequestError("Unauthorized to access");
  }

  const updatedReview = await Reviews.findByIdAndUpdate(
    { _id: id },
    { rating, title, comment },
    { new: true }
  );
     await updatedReview.save();
  res.status(StatusCodes.OK).json({ review: updatedReview });
};

const deleteReviews = async (req, res) => {
  const { id } = req.params;
  const Review = await Reviews.findOne({ _id: id });
  if (!Review) throw new BadRequestError("No review exitsts");
  if (req.user.role !== "admin")
    throw new BadRequestError("unauthorized to access");
  const Revie = await Reviews.findOneAndDelete({ _id: id });
  await Revie.remove();
  res.status(StatusCodes.OK).send(`Review with id:${id} deleted Succefully...`);
};
const getSingleProductReviews=async(req,res)=>{
  const {id:productId}=req.params;
  const revies=await Reviews.find({product:productId});
  res.status(StatusCodes.OK).json({revies,count:revies.length})
}
module.exports = {
  createReviews,
  getAllReviews,
  getSingleReviews,
  updateReviews,
  deleteReviews,
  getSingleProductReviews
};
