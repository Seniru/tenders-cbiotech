require("dotenv").config()

const os = require("os")
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require("morgan")

const tendersRoute = require("./routes/tenders")
const productRoute = require("./routes/product")
const authRoute = require("./routes/auth")
const usersRoute = require("./routes/users")
const logger = require("./utils/logger")
const { StatusCodes } = require("http-status-codes")
const createResponse = require("./utils/createResponse")

// middlewares
app.use(cors())
app.use(express.json())
app.use(
    morgan("dev", {
        stream: { write: (message) => logger.info(message.trim()) },
    }),
)

// routes
app.use("/api/tenders", tendersRoute)
app.use("/api/product", productRoute)
app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)

app.use((err, req, res, next) => {
    logger.error(err.stack)
    createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error")
    next()
})

/*const start = async () => {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/test"
    const SERVER_PORT = process.env.SERVER_PORT || 8888

    logger.info("Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    logger.info("Connected to MongoDB!")

    logger.info("Starting server...")
    app.listen(SERVER_PORT, () => {
        let networkInterfaces = os.networkInterfaces()
        let address = networkInterfaces.wlo1 && networkInterfaces.wlo1[0].address
        logger.info("Server listening on")
        logger.info(`\tLocal:\thttp://127.0.0.1:${SERVER_PORT}`)
        address && logger.info(`\tIP:\thttp://${address}:${SERVER_PORT}`)
    })
}

start()*/

let isConnected = false
mongoose.set("strictQuery", false)

async function connectDB() {
  if (isConnected) return;
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/test"
  try {
    await mongoose.connect(MONGO_URI)
    isConnected = true
    logger.info("Connected to MongoDB")
  } catch (error) {
    logger.error("MongoDB connection error:", error)
  }
}

// Vercel serverless handler
module.exports = async (req, res) => {
  if (!isConnected) await connectDB()
  return app(req, res);
}
