const becomePartner = require("../models/CustomerSupportForm");

const saveCustomerSupport = async (req, res) => {
    try {
        // Extract data from the request body
        const { rname,email,reason } = req.body;

        // Create a new instance of the DataModel
        const newData = new becomePartner({ rname,email,reason });

        // Save the data to the database
        const savedData = await newData.save();

        res.status(201).json({
            success: true,
            savedData,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { saveCustomerSupport };