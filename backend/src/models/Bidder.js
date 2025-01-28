const mongoose = require("mongoose")

const BidderSchema = new mongoose.Schema({
    bidder: { type: String, required: true, minlength: 1 },
    manufacturer: { type: String, required: true, minlength: 1 },
    currency: { type: String, required: true, minlength: 1 },
    quotedPrice: { type: Number, required: true },
    packSize: { type: String, default: "1" },
    bidBond: Boolean,
    pr: Boolean,
    pca: Boolean,
})

const Bidder = mongoose.model("Bidder", BidderSchema)

module.exports = Bidder
