const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique:true,
    required: [true, "Please provide the email"],
    minlength: 3,
    maxlength: 50,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide the password"],
    minlength: 3,
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});
userSchema.pre('save',async function(){
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
})
userSchema.methods.comparePassword=async function(candidatepassword){
  const isMatch = await bcrypt.compare(candidatepassword,this.password);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);
