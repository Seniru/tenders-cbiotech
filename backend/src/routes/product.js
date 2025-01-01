const express = require("express")
const router = express.Router()

const { getProduct } = require("../controllers/product")

router.get("/:productName", getProduct)

module.exports = router
