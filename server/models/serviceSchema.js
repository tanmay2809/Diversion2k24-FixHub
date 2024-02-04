const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  tid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tutor",
    required: true,
  },
  sid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  question: {
    type: [String],
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;