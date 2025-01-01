const mongoose = require("mongoose")

const TenderSchema = new mongoose.Schema({
    closedOn: Date,
    itemName: String,
    tenderNumber: String,
    quantity: Number,
    conversionRates: Object,
    bidders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bidder" }],
})

const Tender = new mongoose.model("Tender", TenderSchema)

module.exports = Tender
