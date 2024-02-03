const expressAsyncHandler = require("express-async-handler");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const PaymentModel = require("../models/paymentSchema");
// const Payment = require("../models/")

const razorpay = new Razorpay({
  key_id: "rzp_test_j3uMC3pJNVXJpR",
  key_secret: "iVdd7vf9Qopo1TKflmLWF8Ue",
});
// @desc : register new user
// @route: POST /users/register
// @access: public
const verifyPaymentDetails = expressAsyncHandler(async (req, res) => {
  // do a validation
  const secret = "12345678";
  console.log(req.body);
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  console.log(digest, req.headers["x-razorpay-signature"]);
  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    require("fs").writeFileSync(
      "payment1.json",
      JSON.stringify(req.body, null, 4)
    );
    try {
      const payment = await PaymentModel.create({
        tutor_id: tid,
        payment_id: razorpay_id,
        student_id: sid,
        service_used: service,
        amount: amount,
      });
      res
        .status(201)
        .json({ message: "Payment created successfully", payment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(500).json({ error: error.message });
  }
  res.json({ status: "ok" });
});

const performPayment = expressAsyncHandler(async (req, res) => {
  const payment_capture = 1;
  const amount = 499;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };
  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  performPayment,
  verifyPaymentDetails,
};
