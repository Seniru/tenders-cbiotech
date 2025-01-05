const express = require("express")
const router = express.Router()

const { getProduct } = require("../controllers/product")
const requireRole = require("../middlewares/requireRole")

router.get("/:productName", requireRole("viewer"), getProduct)

module.exports = router
