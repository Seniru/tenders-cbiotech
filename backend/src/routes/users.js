const express = require("express")
const router = express.Router()

const requireRole = require("../middlewares/requireRole")
const { getUsers, createUser, deleteUser } = require("../controllers/users")

router.get("/", requireRole("admin"), getUsers)
router.post("/", requireRole("admin"), createUser)
router.delete("/", requireRole("admin"), deleteUser)

module.exports = router
