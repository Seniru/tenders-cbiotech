require("dotenv").config()

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { StatusCodes } = require("http-status-codes")

const User = require("../models/User")
const createResponse = require("../utils/createResponse")

const { JWT_SECRET } = process.env

const login = async (req, res) => {
	let { email, password } = req.body
	let user = await User.findOne({ email }).exec()
	if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")

	if (bcrypt.compareSync(password, user.password)) {
		let token = jwt.sign({
			username: user.username,
			email: user.email,
			role: user.role
		}, JWT_SECRET)
		return createResponse(res, StatusCodes.OK, { token })
	}
	return createResponse(res, StatusCodes.UNAUTHORIZED, "Invalid password")
}

module.exports = {
	login
}