const express = require("express")
const router = express.Router()

const requireRole = require("../middlewares/requireRole")
const {
    getUsers,
    createUser,
    deleteUser,
    editUserPassword,
} = require("../controllers/users")

router.get("/", requireRole("admin"), getUsers)
router.post("/", requireRole("admin"), createUser)
router.delete("/", requireRole("admin"), deleteUser)
router.patch("/", requireRole("viewer"), editUserPassword)

module.exports = router
