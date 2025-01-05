const express = require("express")
const router = express.Router()

const requireRole = require("../middlewares/requireRole")
const { getUsers, createUser } = require("../controllers/users")

router.get("/", requireRole("admin"), getUsers)
router.post("/", requireRole("admin"), createUser)

module.exports = router
