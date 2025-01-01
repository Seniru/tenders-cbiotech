const Bidder = require("../models/Bidder")
const Tender = require("../models/Tender")

const getProduct = async (req, res) => {
    try {
        const { productName } = req.params
        const tenders = await Tender.find({ itemName: productName })
            .populate("bidders")
            .exec()
        res.json(tenders)
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getProduct,
}
