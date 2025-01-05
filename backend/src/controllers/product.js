require("dotenv").config()

const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")
const createResponse = require("../utils/createResponse")

const getProduct = async (req, res) => {
    const token = req.headers.authorization
    if (!token) return createResponse(res, StatusCodes.UNAUTHORIZED, "You must log in to continue")
    console.log(jwt.verify(token.split(" ")[1], process.env.JWT_SECRET))
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
