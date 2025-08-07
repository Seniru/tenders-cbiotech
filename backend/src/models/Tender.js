const mongoose = require("mongoose")
const determinePackSize = require("../utils/determinePackSize")

const TenderSchema = new mongoose.Schema({
    closedOn: { type: Date, required: true, minlength: 1 },
    itemName: { type: String, required: true, minlength: 1 },
    tenderNumber: { type: String, required: true, unique: true, minlength: 1 },
    quantity: { type: String, default: "1", minLength: 1 },
    conversionRates: { type: Object, default: {} },
    bidders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bidder" }],
})

TenderSchema.methods.applyDerivations = function () {
    const DISCOUNTED_RATE = 1.0511

    const overriddenDiscountRate = Object.entries(this.conversionRates).find((entry) =>
        entry[0].toUpperCase().includes("DISCOUNT"),
    )?.[1]

    const discount = Number(overriddenDiscountRate || DISCOUNTED_RATE)

    let conversionRates = this.conversionRates || {}
    let bidders = this.bidders
    let shouldApplyDiscountedRate = overriddenDiscountRate != null ||
        bidders.length > 1 &&
        bidders.every((bidder) =>
            bidder.bidder.toLowerCase().match(/.*(slim|cliniqon).*/)
                ? bidder.currency.toUpperCase() == "LKR"
                : bidder.currency.toUpperCase() != "LKR",
        )

    let biddersAfterDerives = bidders.map((bidder) => {
        let packSize = determinePackSize(bidder.packSize)
        let quotedPriceLKR =
            bidder.quotedPrice * (bidder.currency == "LKR" ? 1 : conversionRates[bidder.currency])

        // apply discounted rate
        if (
            shouldApplyDiscountedRate &&
            bidder.bidder.toLowerCase().match(/.*(slim|cliniqon).*/) &&
            bidder.currency == "LKR"
        )
            quotedPriceLKR /= discount

        let quotedUnitPriceLKR = quotedPriceLKR / packSize

        // for RES tenders there will be no PRs
        // if (this.tenderNumber.startsWith("RES")) bidder.pr = null
        // no bid bond and pr for SPC/CPU tenders
        if (this.tenderNumber.includes("CPU")) {
            bidder.pr = null
            bidder.bidBond = null
        }

        return {
            ...bidder.toObject(),
            quotedPriceLKR,
            quotedUnitPriceLKR,
        }
    })

    return {
        ...this.toObject(),
        bidders: biddersAfterDerives.sort(
            (b1, b2) => b1.quotedUnitPriceLKR - b2.quotedUnitPriceLKR,
        ),
    }
}

const Tender = new mongoose.model("Tender", TenderSchema)

module.exports = Tender
