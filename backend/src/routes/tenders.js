const express = require("express")
const router = express.Router()

const requireRole = require("../middlewares/requireRole")
const {
    getTendersSummary,
    getTendersOnDate,
} = require("../controllers/tenders")

router.get("/", requireRole("viewer"), getTendersSummary)
router.get("/:date", requireRole("viewer"), getTendersOnDate)

module.exports = router
