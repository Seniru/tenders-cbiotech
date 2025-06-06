const mongoose = require("mongoose")
const { StatusCodes } = require("http-status-codes")
const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")
const createResponse = require("../utils/createResponse")
const applyFilters = require("../utils/applyFilters")
const prepareSheets = require("../utils/prepareSheets")

const getTendersSummary = async (req, res, next) => {
    try {
        const searchString = req.query.q || ""
        const minBidders = req.query.minBidders || 0
        const maxBidders = req.query.maxBidders || Infinity
        const matchBidders = req.query.matchBidders?.split(",") || []
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null

        const itemNames = await Tender.distinct("itemName", {
            itemName: { $regex: searchString, $options: "i" },
        })

        let latestTenders = await Promise.all(
            itemNames.map(async (itemName) => {
                let latestTender = await Tender.findOne({ itemName })
                    .populate("bidders")
                    .sort({ closedOn: -1 })
                    .exec()

                latestTender = latestTender.applyDerivations()
                let lowestBidder = null
                if (latestTender && latestTender.bidders.length > 0) {
                    latestTender.bidders.sort((a, b) => a.quotedUnitPrice - b.quotedUnitPrice)
                    lowestBidder = latestTender.bidders[0]
                }

                return {
                    itemName: latestTender.itemName,
                    closedOn: latestTender.closedOn,
                    quantity: latestTender.quantity,
                    bidder: lowestBidder?.bidder,
                    bidders: latestTender.bidders,
                    manufacturer: lowestBidder?.manufacturer,
                    currency: lowestBidder?.currency,
                    quotedPrice: lowestBidder?.quotedPrice,
                }
            }),
        )

        latestTenders = applyFilters(latestTenders, {
            minBidders,
            maxBidders,
            matchBidders,
            fromDate,
            toDate,
        })

        // remove unneccessary data
        latestTenders = latestTenders.map((tender) => ({
            itemName: tender.itemName,
            bidder: tender.bidder,
            manufacturer: tender.manufacturer,
            currency: tender.currency,
            quotedPrice: tender.quotedPrice,
            quantity: tender.quantity,
        }))

        return createResponse(res, StatusCodes.OK, { tenders: latestTenders })
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
