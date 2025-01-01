const express = require("express")
const router = express.Router()

const {
    getTendersSummary,
    getTendersOnDate,
} = require("../controllers/tenders")

router.get("/", getTendersSummary)
router.get("/:date", getTendersOnDate)

module.exports = router
