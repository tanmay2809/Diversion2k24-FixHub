const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique:true
    },
    address:{
      type: String,
      required:true,
    },
    pincode:{
      type:String,
      required:true,
    },
    latt:{
      type:Number,
      required:true,
    },
    lon:{
      type:Number,
      required:true,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("users", studentSchema);