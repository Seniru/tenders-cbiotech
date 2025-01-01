const express = require("express")
const router = express.Router()

router.get("/", (req, res) => res.send("Tenders route"))

module.exports = router
