const mongoose = require("mongoose");

// Define schema for payment
const paymentSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: true,
    unique: true,
  },
  tutor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tutor",
    required: true,
  },
  student_id: {
type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  service_used: {
    type: [String], // Array of strings
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Create a model based on the schema
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
