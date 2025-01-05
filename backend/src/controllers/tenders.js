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
                // todo: quoted price should be quotedPriceLKR later
                const latestTender = await Tender.findOne({ itemName })
                    .populate({
                        path: "bidders",
                        select: [
                            "bidder",
                            "manufacturer",
                            "currency",
                            "quotedPrice",
                        ],
                    })
                    .sort({ closedOn: -1 })
                    .exec()

                if (latestTender && latestTender.bidders.length > 0) {
                    latestTender.bidders.sort(
                        (a, b) => a.quotedPrice - b.quotedPrice,
                    )
                    latestTender.bidders = [latestTender.bidders[0]]
                }

                return latestTender
            }),
        )

        return createResponse(res, StatusCodes.OK, { tenders: latestTenders })
    } catch (error) {
        return createResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
        )
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

        return createResponse(res, StatusCodes.OK, { tenders })
    } catch (error) {
        return createResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
        )
    }
}

const createTender = async (req, res) => {
    try {
        const { bidders } = req.body
        if (!Array.isArray(bidders))
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Request must include bidder data",
            )

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
        return createResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
        )
    }
}

module.exports = {
    getTendersSummary,
    getTendersOnDate,
    createTender,
}
