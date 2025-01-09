const express = require("express")
const router = express.Router()

const requireRole = require("../middlewares/requireRole")
const {
    getTendersSummary,
    getTendersOnDate,
    createTender,
    deleteTender,
} = require("../controllers/tenders")

router.get("/", requireRole("viewer"), getTendersSummary)
router.post("/", requireRole("contributor"), createTender)
router.get("/:date", requireRole("viewer"), getTendersOnDate)
router.delete("/:tenderNumber", requireRole("contributer"), deleteTender)

module.exports = router
