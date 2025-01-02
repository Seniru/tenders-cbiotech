require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

const tendersRoute = require("./routes/tenders")
const productRoute = require("./routes/product")
const authRoute = require("./routes/auth")

app.use(cors())
app.use(express.json())

app.use("/api/tenders", tendersRoute)
app.use("/api/product", productRoute)
app.use("/api/auth", authRoute)

const start = async () => {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/test"
    const SERVER_PORT = process.env.SERVER_PORT || 8888

    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB!")

    console.log("Starting server...")
    app.listen(SERVER_PORT, () => {
        console.log("Server listening on", SERVER_PORT)
    })
}

start()
