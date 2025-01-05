require("dotenv").config()

const jwt = require("jsonwebtoken")
const createResponse = require("../utils/createResponse")
const { StatusCodes } = require("http-status-codes")

const actionLevels = {
	viewer: 1,
	contributor: 2,
	admin: 3
}

const requireRole = (role) => (req, res, next) => {
	let token = req.headers.authorization
	if (!token) return createResponse(res, StatusCodes.UNAUTHORIZED, "You must log in to continue")
	token = token.split(" ")[1]

	try {
		let decoded = jwt.verify(token, process.env.JWT_SECRET)
		if (actionLevels[decoded.role] < actionLevels[role]) return createResponse(res, StatusCodes.UNAUTHORIZED, "Not authorized for this action")
		req.user = decoded
		next()
	} catch (error) {
		return createResponse(res, StatusCodes.UNAUTHORIZED, "Invalid token")
	}
}

module.exports = requireRole

