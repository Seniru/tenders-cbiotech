const mongoose = require("mongoose")
const { StatusCodes } = require("http-status-codes")
const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")
const createResponse = require("../utils/createResponse")
const applyFilters = require("../utils/applyFilters")
const prepareSheets = require("../utils/prepareSheets")

async function getFilteredItems({
    searchString,
    fromDate,
    toDate,
    minBidders,
    maxBidders,
    matchBidders,
}) {
    const matchQuery = {
        itemName: {
            $regex: searchString,
            $options: "i",
        },
    }

    if (minBidders != null || maxBidders != null) {
        matchQuery.bidderCount = {}
        if (minBidders != null) matchQuery.bidderCount.$gte = parseInt(minBidders)
        if (maxBidders != null) matchQuery.bidderCount.$lte = parseInt(maxBidders)
    }

    if (fromDate || toDate) {
        matchQuery.closedOn = {}
        if (fromDate != null) matchQuery.closedOn.$gte = fromDate
        if (toDate != null) matchQuery.closedOn.$lte = toDate
    }

    if (matchBidders.length > 0) {
        matchQuery.bidders = {
            $elemMatch: {
                bidder: {
                    $regex: matchBidders.join("|"),
                    $options: "i",
                },
            },
        }
    }

    const pipeline = [
        {
            $addFields: {
                bidderCount: {
                    $size: "$bidders",
                },
            },
        },
        {
            $lookup: {
                from: "bidders",
                localField: "bidders",
                foreignField: "_id",
                as: "bidders",
            },
        },
        {
            $facet: {
                data: [
                    { $match: matchQuery },
                    { $sort: { closedOn: -1 } },
                    {
                        $group: {
                            _id: "$itemName",
                            latestTender: { $first: "$$ROOT" },
                        },
                    },
                    {
                        $replaceRoot: { newRoot: "$latestTender" },
                    },
                    { $sort: { itemName: 1 } },
                ],
                count: [{ $match: matchQuery }, { $count: "tenderCount" }],
            },
        },
    ]

    return await Tender.aggregate(pipeline)
}

const getTendersSummary = async (req, res, next) => {
    try {
        const searchString = req.query.q || ""
        const minBidders = req.query.minBidders
        const maxBidders = req.query.maxBidders
        const matchBidders = req.query.matchBidders?.split(",") || []
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null

        let result = await getFilteredItems({
            searchString,
            fromDate,
            toDate,
            minBidders,
            maxBidders,
            matchBidders,
        })

        let latestTenders = result[0].data
        let tenderCount = result[0].count[0]?.tenderCount || 0

        latestTenders = latestTenders.map((tender) => Tender.hydrate(tender).applyDerivations())

        // remove unnecessary data
        latestTenders = latestTenders.map((tender) => {
            let lowestBidder = null
            if (tender && tender.bidders.length > 0) {
                tender.bidders.sort((a, b) => a.quotedUnitPrice - b.quotedUnitPrice)
                lowestBidder = tender.bidders[0]
            }

            return {
                itemName: tender.itemName,
                bidder: lowestBidder?.bidder,
                manufacturer: lowestBidder?.manufacturer,
                currency: lowestBidder?.currency,
                quotedPrice: lowestBidder?.quotedPrice,
                quantity: tender.quantity,
            }
        })

        return createResponse(res, StatusCodes.OK, { tenders: latestTenders, tenderCount })
    } catch (error) {
        next(error)
    }
}

const getTendersOnDate = async (req, res, next) => {
    try {
        let { date } = req.params
        let requestingSpreadsheet = date.includes(".xlsx")
        if (requestingSpreadsheet) date = date.substring(0, date.length - 5)

        let minBidders = req.query.minBidders !== undefined ? parseInt(req.query.minBidders) : 0
        let maxBidders =
            req.query.maxBidders !== undefined ? parseInt(req.query.maxBidders) : Infinity
        let matchBidders = req.query.matchBidders?.split(",") || []

        let startDate
        let endDate

        if (date.includes(":")) {
            date = date.split(":")
            startDate = new Date(date[0])
            endDate = new Date(date[1])
        } else {
            startDate = new Date(date)
            endDate = new Date(date)
        }
        endDate.setDate(endDate.getDate() + 1)

        let tenders = await Tender.find({
            closedOn: {
                $gte: startDate,
                $lt: endDate,
            },
        })
            .populate("bidders")
            .sort({ closedOn: -1 })
            .exec()

        let afterDerivations = tenders.map((tender) => tender.applyDerivations())

        afterDerivations = applyFilters(afterDerivations, {
            minBidders,
            maxBidders,
            matchBidders,
        })

        if (requestingSpreadsheet) return prepareSheets(afterDerivations, res)

        return createResponse(res, StatusCodes.OK, {
            tenders: afterDerivations,
        })
    } catch (error) {
        next(error)
    }
}

const createTender = async (req, res, next) => {
    try {
        const { bidders, conversionRates: conversions } = req.body
        if (!Array.isArray(bidders))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Request must include bidder data")
        if (typeof conversions !== "object")
            return createResponse(res, StatusCodes.BAD_REQUEST, "Request must include conversions")

        let givenCurrencies = Object.keys(conversions)
        for (let currency of new Set(
            bidders.map((bidder) => bidder.currency).filter((bidder) => bidder),
        )) {
            if (currency !== "LKR" && !givenCurrencies.includes(currency)) {
                return createResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    `A bidder has quoted in ${currency} but it's conversion rates are not given. ` +
                        `Please include ${currency} to LKR conversions`,
                )
            }
        }

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
        try {
            await Promise.all(bidderPromises)
            await tender.save()
        } catch (error) {
            await tender.deleteOne().exec()
            throw error
        }

        return createResponse(res, StatusCodes.CREATED, req.body)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errMsg = error.errors[Object.keys(error.errors)[0]].message
            return createResponse(res, StatusCodes.BAD_REQUEST, errMsg)
        }
        next(error)
    }
}

const editTenderBidder = async (req, res, next) => {
    try {
        let { tenderNumber, bidderId } = req.params

        let tender = await Tender.findOne({ tenderNumber }).populate("bidders").exec()
        if (!tender) return createResponse(res, StatusCodes.NOT_FOUND, "Tender not found")

        let bidderData = tender.bidders.filter((bidder) => bidder._id == bidderId)
        if (bidderData.length == 0)
            return createResponse(
                res,
                StatusCodes.NOT_FOUND,
                "Bidder not found for the given tender",
            )

        let bidder = await Bidder.findByIdAndUpdate(
            bidderId,
            {
                bidder: req.body.bidder,
                manufacturer: req.body.manufacturer,
                currency: req.body.currency,
                quotedPrice: req.body.quotedPrice,
                packSize: req.body.packSize,
                bidBond: req.body.bidBond,
                pr: req.body.pr,
                pca: req.body.pca,
                comments: req.body.comments,
            },
            { runValidators: true },
        ).exec()

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
        if (error instanceof mongoose.Error.ValidationError) {
            let errMsg = error.errors[Object.keys(error.errors)[0]].message
            return createResponse(res, StatusCodes.BAD_REQUEST, errMsg)
        }
        next(error)
    }
}

const editTenderConversionRates = async (req, res, next) => {
    try {
        let { tenderNumber } = req.params
        let { conversionRates } = req.body

        if (!conversionRates)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Request must include conversionRates field",
            )

        let tender = await Tender.findOne({ tenderNumber }).populate("bidders").exec()
        if (!tender) return createResponse(res, StatusCodes.NOT_FOUND, "Tender not found")

        for (let [currency, rate] of Object.entries(conversionRates)) {
            if (currency.length <= 1)
                return createResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    "Currency should not be an empty value",
                )
            if (isNaN(rate))
                return createResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    "Conversion rate should be a number",
                )
        }

        let quotedCurrencies = new Set(
            tender.bidders.map((bidder) => bidder.currency).filter((bidder) => bidder),
        )
        let givenCurrencies = Object.keys(conversionRates)
        for (let currency of quotedCurrencies) {
            if (currency !== "LKR" && !givenCurrencies.includes(currency)) {
                return createResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    `A bidder has quoted in ${currency} but it's conversion rates are not given. ` +
                        `Please include ${currency} to LKR conversions`,
                )
            }
        }

        tender.conversionRates = conversionRates
        await tender.save()
        return createResponse(res, StatusCodes.OK, tender.conversionRates)
    } catch (error) {
        next(error)
    }
}

const editTender = async (req, res, next) => {
    try {
        let { tenderNumber } = req.params
        let tender = await Tender.findOneAndUpdate(
            { tenderNumber },
            {
                tenderNumber: req.body.tenderNumber,
                closedOn: req.body.closedOn,
                itemName: req.body.itemName,
                quantity: req.body.quantity,
            },
            { runValidators: true },
        ).exec()
        if (!tender) return createResponse(res, StatusCodes.NOT_FOUND, "Tender not found")

        return createResponse(res, StatusCodes.OK, {
            previous: tender,
            current: req.body,
        })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errMsg = error.errors[Object.keys(error.errors)[0]].message
            return createResponse(res, StatusCodes.BAD_REQUEST, errMsg)
        }
        next(error)
    }
}

const deleteTender = async (req, res, next) => {
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
        next(error)
    }
}

const addTenderBidder = async (req, res, next) => {
    try {
        let { tenderNumber } = req.params
        if (!tenderNumber)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "tenderNumber should be provided to delete",
            )

        let tender = await Tender.findOne({ tenderNumber }).exec()
        if (!tender) return createResponse(res, StatusCodes.NOT_FOUND, "Tender not found")

        let bidder = new Bidder({
            bidder: req.body.bidder,
            manufacturer: req.body.manufacturer,
            currency: req.body.currency,
            quotedPrice: req.body.quotedPrice,
            packSize: req.body.packSize,
            bidBond: req.body.bidBond,
            pr: req.body.pr,
            pca: req.body.pca,
            comments: req.body.comments,
        })

        await bidder.save()
        tender.bidders.push(bidder._id)
        await tender.save()

        return createResponse(res, StatusCodes.CREATED, { bidder })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errMsg = error.errors[Object.keys(error.errors)[0]].message
            return createResponse(res, StatusCodes.BAD_REQUEST, errMsg)
        }
        next(error)
    }
}

const deleteTenderBidder = async (req, res, next) => {
    try {
        let { tenderNumber, bidderId } = req.params

        let tender = await Tender.findOne({ tenderNumber }).populate("bidders").exec()
        if (!tender) return createResponse(res, StatusCodes.NOT_FOUND, "Tender not found")

        let bidderData = tender.bidders.filter((bidder) => bidder._id == bidderId)
        if (bidderData.length == 0)
            return createResponse(
                res,
                StatusCodes.NOT_FOUND,
                "Bidder not found for the given tender",
            )

        let bidder = await Bidder.findByIdAndDelete(bidderId).exec()
        if (!bidder)
            return createResponse(
                res,
                StatusCodes.NOT_FOUND,
                "Bidder not found for the given tender",
            )
        return createResponse(res, StatusCodes.OK, { bidder })
    } catch (error) {
        enxt(error)
    }
}

module.exports = {
    getTendersSummary,
    getTendersOnDate,
    createTender,
    editTenderBidder,
    editTender,
    editTenderConversionRates,
    deleteTender,
    addTenderBidder,
    deleteTenderBidder,
}
