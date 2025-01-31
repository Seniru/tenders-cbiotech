require("dotenv").config()

const { StatusCodes } = require("http-status-codes")
const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")
const createResponse = require("../utils/createResponse")
const applyFilters = require("../utils/applyFilters")
const prepareSheets = require("../utils/prepareSheets")

const getProduct = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return createResponse(res, StatusCodes.UNAUTHORIZED, "You must log in to continue")

    try {
        let { productName } = req.params
        let requestingSpreadsheet = productName.includes(".xlsx")
        if (requestingSpreadsheet) productName = productName.substring(0, productName.length - 5)

        const { latestOnly } = req.query
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null
        const minBidders = req.query.minBidders !== undefined ? parseInt(req.query.minBidders) : 0
        const maxBidders =
            req.query.maxBidders !== undefined ? parseInt(req.query.maxBidders) : Infinity
        const matchBidders = req.query.matchBidders?.split(",") || []

        const tenders = await Tender.find({ itemName: productName })
            .populate("bidders")
            .sort({ closedOn: -1 })
            .exec()

        let afterDerivations = tenders.map((tender) => tender.applyDerivations())
        afterDerivations = applyFilters(afterDerivations, {
            minBidders,
            maxBidders,
            matchBidders,
            fromDate,
            toDate,
        })

        // latest only
        if (latestOnly === "true") afterDerivations = [afterDerivations[0]]

        if (requestingSpreadsheet) return prepareSheets(afterDerivations, res)

        return createResponse(res, StatusCodes.OK, {
            tenders: afterDerivations,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProduct,
}
