const { StatusCodes } = require("http-status-codes")
const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")
const createResponse = require("../utils/createResponse")

const getTendersSummary = async (req, res) => {
    try {
        const searchString = req.query.q || ""
        const itemNames = await Tender.distinct("itemName", {
            itemName: { $regex: searchString, $options: "i" },
        })
        const latestTenders = await Promise.all(
            itemNames.map(async (itemName) => {
                let latestTender = await Tender.findOne({ itemName })
                    .populate("bidders")
                    .sort({ closedOn: -1 })
                    .exec()

                latestTender = latestTender.applyDerivations()
                if (latestTender && latestTender.bidders.length > 0) {
                    latestTender.bidders.sort((a, b) => a.quotedUnitPrice - b.quotedUnitPrice)
                    latestTender.bidders = latestTender.bidders[0]
                }

                return {
                    itemName: latestTender.itemName,
                    bidder: latestTender.bidders.bidder,
                    manufacturer: latestTender.bidders.manufacturer,
                    currency: latestTender.bidders.currency,
                    quotedPrice: latestTender.bidders.quotedPrice,
                }
            }),
        )

        return createResponse(res, StatusCodes.OK, { tenders: latestTenders })
    } catch (error) {
        console.error(error)
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getTendersOnDate = async (req, res) => {
    try {
        let { date } = req.params
        let startDate = new Date(date)
        let endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 1)

        let tenders = await Tender.find({
            closedOn: {
                $gte: startDate,
                $lt: endDate,
            },
        })
            .populate("bidders")
            .exec()

        let afterDerivations = tenders.map((tender) => tender.applyDerivations())
        return createResponse(res, StatusCodes.OK, {
            tenders: afterDerivations,
        })
    } catch (error) {
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const createTender = async (req, res) => {
    try {
        const { bidders } = req.body
        if (!Array.isArray(bidders))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Request must include bidder data")

        const tender = new Tender({
            closedOn: req.body.closedOn,
            itemName: req.body.itemName,
            tenderNumber: req.body.tenderNumber,
            quantity: req.body.quantity,
            conversionRates: req.body.conversionRates,
        })
        await tender.save()

        let bidderPromises = []
        for (let bidderData of bidders) {
            bidderPromises.push(
                (async () => {
                    let bidder = new Bidder(bidderData)
                    await bidder.save()
                    tender.bidders.push(bidder._id)
                })(),
            )
        }
        await Promise.all(bidderPromises)
        await tender.save()

        return createResponse(res, StatusCodes.CREATED, req.body)
    } catch (error) {
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const editTenderBidder = async (req, res) => {
    try {
        let { tenderNumber, bidder: bidderName } = req.params

        let tender = await Tender.findOne({ tenderNumber }).populate("bidders").exec()
        if (!tender) return createResponse(res, StatusCodes.NOT_FOUND, "Tender not found")

        let bidderData = tender.bidders.filter((bidder) => bidder.bidder == bidderName)
        if (bidderData.length == 0)
            return createResponse(
                res,
                StatusCodes.NOT_FOUND,
                "Bidder not found for the given tender",
            )

        let bidder = await Bidder.findByIdAndUpdate(bidderData[0]._id, {
            bidder: req.body.bidder,
            manufacturer: req.body.manufacturer,
            currency: req.body.currency,
            quotedPrice: req.body.quotedPrice,
            packSize: req.body.packSize,
            bidBond: req.body.bidBond,
            pr: req.body.pr,
            pca: req.body.pca,
        }).exec()

        if (!bidder)
            return createResponse(
                res,
                StatusCodes.NOT_FOUND,
                "Bidder not found for the given tender",
            )
        return createResponse(res, StatusCodes.OK, {
            bidder: {
                previous: bidder,
                current: req.body,
            },
        })
    } catch (error) {
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const deleteTender = async (req, res) => {
    try {
        let { tenderNumber } = req.params
        if (!tenderNumber)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "tenderNumber should be provided to delete",
            )

        let tender = await Tender.findOneAndDelete({ tenderNumber })
        if (!tender) return createResponse(res, StatusCodes.NOT_FOUND, "Tender not found")
        return createResponse(res, StatusCodes.OK, { tender })
    } catch (error) {
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

module.exports = {
    getTendersSummary,
    getTendersOnDate,
    createTender,
    editTenderBidder,
    deleteTender,
}
