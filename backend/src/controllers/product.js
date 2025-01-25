require("dotenv").config()

const { StatusCodes } = require("http-status-codes")
const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")
const createResponse = require("../utils/createResponse")

const getProduct = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return createResponse(res, StatusCodes.UNAUTHORIZED, "You must log in to continue")

    try {
        const { productName } = req.params
        const { latestOnly } = req.query
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null
        const tenders = await Tender.find({ itemName: productName })
            .populate("bidders")
            .sort({ closedOn: -1 })
            .exec()

        let afterDerivations = tenders.map((tender) => tender.applyDerivations())

        // apply filters and options
        // date range
        if (fromDate || toDate)
            afterDerivations = afterDerivations.filter(
                (tender) =>
                    (!fromDate || tender.closedOn >= fromDate) &&
                    (!toDate || tender.closedOn <= toDate),
            )

        // latest only
        if (latestOnly === "true") afterDerivations = [afterDerivations[0]]

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
