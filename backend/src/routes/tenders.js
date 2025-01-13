const express = require("express")
const router = express.Router()

const requireRole = require("../middlewares/requireRole")
const {
    getTendersSummary,
    getTendersOnDate,
    createTender,
    editTenderBidder,
    editTender,
    deleteTender,
    addTenderBidder,
    deleteTenderBidder,
} = require("../controllers/tenders")

router.get("/", requireRole("viewer"), getTendersSummary)
router.post("/", requireRole("contributor"), createTender)
router.get("/:date", requireRole("viewer"), getTendersOnDate)
router.delete("/:tenderNumber", requireRole("contributor"), deleteTender)
router.put("/:tenderNumber", requireRole("contributor"), editTender)
router.post("/:tenderNumber/bidders", requireRole("contributor"), addTenderBidder)
router.put("/:tenderNumber/:bidder", requireRole("contributor"), editTenderBidder)
router.delete("/:tenderNumber/:bidder", requireRole("contributor"), deleteTenderBidder)

module.exports = router
