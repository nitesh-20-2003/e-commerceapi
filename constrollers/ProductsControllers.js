const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
const path = require("path");
const prodctsss = require("../mockData/products.json");

const createProduct = async (req, res) => {
  req.body.user = req.user.payload_id;

  // Map the products to bulkWrite operations
  const bulkOps = prodctsss.map((ele) => {
    ele.user = req.user.payload_id;
    return {
      updateOne: {
        filter: { name: ele.name }, // Match by name
        update: { $set: ele }, // Update the product data
        upsert: true, // Insert if the product does not exist
      },
    };
  });

  try {
    const result = await Product.bulkWrite(bulkOps);
    res
      .status(StatusCodes.OK)
      .json({ msg: "Products created/updated", result });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  const product = await Product.find({});
  res.status(StatusCodes.OK).json({ products: product })

};

const getSingleProduct = async (req, res) => {
  const product = await Product.findById({ _id: req.params.id })
   .populate('reviews');
  res.status(StatusCodes.OK).send({ user: product });
};

const updateProduct = async (req, res) => {
  const { name, company } = req.body;
  const product = await Product.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  product
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete({ _id: id });
  await Product.remove();
  res.status(StatusCodes.OK).json("success product deleted");
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("plz select the image");
  }
  const productimg = req.files.image;
 
  if (!productimg.mimetype.startsWith("image")) {
    throw new BadRequestError("please upload image only");
  }
  const maxsize = 1024 * 1024;
  if (productimg.size > maxsize) 
    {
    throw new BadRequestError("please upload image smaller than 1MB ");
  }
  const image_path = path.join(
    __dirname,
    "../public/Uploads/" + `${productimg.name}`
  );
  console.log(image_path)
  await productimg.mv(image_path);
  res.status(StatusCodes.OK).json({ image: productimg.name });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
