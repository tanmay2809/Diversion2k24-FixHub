const express = require("express");
const router = express.Router();
const { saveCustomerSupport } = require("../controllers/customerSupport");

router.post("/saveCustomerSupport", saveCustomerSupport);

module.exports = router;