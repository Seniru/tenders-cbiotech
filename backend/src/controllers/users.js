const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { StatusCodes } = require("http-status-codes")

const User = require("../models/User")
const createResponse = require("../utils/createResponse")

const getUsers = async (req, res) => {
	try {
		const users = await User.find({})
		console.log(users)
		return createResponse(res, StatusCodes.OK, { users })
	} catch (error) {
		return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
	}
}

const createUser = async (req, res) => {
	try {
		const { username, email, password, role } = req.body
		if (!password) return createResponse(res, StatusCodes.BAD_REQUEST, "You must provide a password");
		let salt = await bcrypt.genSalt(10)
		let hashedPassword = await bcrypt.hash(password, salt)
		const user = new User({
			username,
			email,
			role,
			password: hashedPassword
		})
		await user.save()
		return createResponse(res, StatusCodes.CREATED, { user: {
			username,
			email,
			role
		} })
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			let errMsg = error.errors[Object.keys(error.errors)[0]].message
			return createResponse(res, StatusCodes.BAD_REQUEST, errMsg)
		}
		return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
	}
}

module.exports = {
	getUsers, createUser
}