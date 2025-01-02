const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
})

const User = new mongoose.model("User", UserSchema)

module.exports = User
