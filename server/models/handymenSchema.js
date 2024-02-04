const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const handymenSchema = new Schema(
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
      unique: true,
    },
    skills: [String],
  
  },
  { timeStamps: true }
);

module.exports = mongoose.model("handymen", handymenSchema);