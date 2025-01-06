require("dotenv").config()

const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")
const createResponse = require("../utils/createResponse")

const getProduct = async (req, res) => {
    const token = req.headers.authorization
    if (!token)
        return createResponse(
            res,
            StatusCodes.UNAUTHORIZED,
            "You must log in to continue",
        )

    try {
        const { productName } = req.params
        const tenders = await Tender.find({ itemName: productName })
            .populate("bidders")
            .sort({ closedOn: -1 })
            .exec()

        let afterDerivations = tenders.map(tender => tender.applyDerivations())        
        return createResponse(res, StatusCodes.OK, { tenders: afterDerivations })
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
