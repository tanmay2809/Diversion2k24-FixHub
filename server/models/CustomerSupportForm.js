const mongoose = require('mongoose');
const mailSender = require('../util/mailSender');
const { customerSupportEmail } = require('../template/becomePartnerEmail');
const complaintSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
    },
    rname: {
        type: String,
    },
    reason: {
        type: String,
    }
});

complaintSchema.post('save', async function (doc) {
    try {
        console.log("doc", doc)
        await mailSender(doc.email, "Greetings from FixKaro", customerSupportEmail());


    } catch (error) {
        console.error(error)
    }
})

const CustomerSupportModel = mongoose.model("CustomerSupportForm", complaintSchema);

module.exports = CustomerSupportModel;