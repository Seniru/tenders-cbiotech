const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { StatusCodes } = require("http-status-codes")

const User = require("../models/User")
const createResponse = require("../utils/createResponse")

const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        return createResponse(res, StatusCodes.OK, { users })
    } catch (error) {
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body
        if (!password)
            return createResponse(res, StatusCodes.BAD_REQUEST, "You must provide a password")
        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(password, salt)
        const user = new User({
            username,
            email,
            role,
            password: hashedPassword,
        })
        await user.save()
        return createResponse(res, StatusCodes.CREATED, {
            user: {
                username,
                email,
                role,
            },
        })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errMsg = error.errors[Object.keys(error.errors)[0]].message
            return createResponse(res, StatusCodes.BAD_REQUEST, errMsg)
        }
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        const { email } = req.body
        if (!email)
            return createResponse(res, StatusCodes.BAD_REQUEST, "Email is required to delete")
        if (email === req.user.email)
            return createResponse(res, StatusCodes.UNAUTHORIZED, "Can't delete yourself")

        let user = await User.findOneAndDelete({ email }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")

        return createResponse(res, StatusCodes.OK, {
            username: user.username,
            email: user.email,
            role: user.role,
        })
    } catch (error) {
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const editUserPassword = async (req, res) => {
    try {
        let { email, password: newPassword } = req.body
        if (!email || !newPassword)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Email and password is required for the operation",
            )

        if (email !== req.user.email)
            return createResponse(
                res,
                StatusCodes.UNAUTHORIZED,
                "Not authorized to change other users' passwords",
            )

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(newPassword, salt)

        let user = await User.findOneAndUpdate({ email }, { password: hashedPassword }).exec()

        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")

        return createResponse(res, StatusCodes.OK, {
            username: user.username,
            email: user.email,
            role: user.role,
        })
    } catch (error) {
        return createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    editUserPassword,
}
