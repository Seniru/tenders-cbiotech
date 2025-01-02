const { StatusCodes } = require("http-status-codes")
const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")
const createResponse = require("../utils/createResponse")

const getProduct = async (req, res) => {
    try {
        const { productName } = req.params
        const tenders = await Tender.find({ itemName: productName })
            .populate("bidders")
            .exec()
        return createResponse(res, StatusCodes.OK, { tenders })
    } catch (error) {
        return createResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
        )
    }
}

module.exports = {
    getProduct,
}
