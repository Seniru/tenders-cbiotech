const mongoose = require("mongoose")

const BidderSchema = new mongoose.Schema({
    bidder: String,
    manufacturer: String,
    currency: String,
    quotedPrice: Number,
    packSize: String,
    bidBond: Boolean,
    pr: Boolean,
    pca: Boolean,
})

const Bidder = mongoose.model("Bidder", BidderSchema)

module.exports = Bidder
