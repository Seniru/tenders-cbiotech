const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")

const getTendersSummary = async (req, res) => {
    try {
        const itemNames = await Tender.distinct("itemName")
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

        res.json(latestTenders)
    } catch (error) {
        res.status(500).send(error)
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

        console.log(tenders)
        res.send(tenders)
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getTendersSummary,
    getTendersOnDate,
}
