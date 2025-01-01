const express = require("express")
const router = express.Router()

const { getTendersSummary } = require("../controllers/tenders")

router.get("/", getTendersSummary)

module.exports = router
