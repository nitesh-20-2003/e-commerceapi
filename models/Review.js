const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.statics.calculateAverageRating=async function(productId){
  const result=await this.aggregate([
    {$match:{product:productId}},
    {$group:{
      _id:null,averageRating:{$avg:'$rating'},
      numOFReviews:{$sum:1},
    }},
  ]);
  console.log(result)
}
ReviewSchema.post('save',async function(){
  await this.constructor.calculateAverageRating(this.product);
  console.log('post save hook called');
})
ReviewSchema.post("remove", async function () {
    await this.constructor.calculateAverageRating(this.product);
  console.log("post hook  removed");
});
module.exports = mongoose.model("Review_schema", ReviewSchema);
