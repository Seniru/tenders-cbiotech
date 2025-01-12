require("dotenv").config()

const bcrypt = require("bcrypt")

const mongoose = require("mongoose")
const Tender = require("../models/Tender")
const Bidder = require("../models/Bidder")
const User = require("../models/User")

const MONGO_URI = process.env.MONGO_URI

const populate = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MongoDB")

        await Bidder.deleteMany({})
        await Tender.deleteMany({})

        // Create tenders
        const tendersData = []
        for (let i = 0; i < 5; i++) {
            // each product may have 1 to 3 tenders
            for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
                const tender = new Tender({
                    closedOn: new Date(`2025-01-${i + 1}`),
                    itemName: `Item ${i + 1}`,
                    tenderNumber: `T${10000 + i * 100 + j}`,
                    quantity: Math.floor(Math.random() * 1000) + 1,
                    conversionRates: {
                        USD: 1,
                        EUR: (Math.random() * 0.5 + 0.5).toFixed(2),
                    },
                    bidders: [],
                })
                tendersData.push(tender)
            }
        }
        await Tender.insertMany(tendersData)
        console.log("Tenders saved")

        // Create bidders and associate them with tenders
        const bidderPromises = []
        for (let i = 0; i < tendersData.length; i++) {
            const numBidders = Math.floor(Math.random() * 6) // 0 to 5 bidders per tender
            for (let j = 0; j < numBidders; j++) {
                const bidder = new Bidder({
                    bidder: `Bidder ${Math.floor(Math.random() * 1000)}`,
                    manufacturer: `Manufacturer ${String.fromCharCode(65 + j)}`,
                    currency: "USD",
                    quotedPrice: Math.floor(Math.random() * 10000) + 1000,
                    packSize: `Pack of ${Math.floor(Math.random() * 5) + 1}`,
                    bidBond: Math.random() > 0.5,
                    pr: Math.random() > 0.5,
                    pca: Math.random() > 0.5,
                })
                bidderPromises.push(
                    bidder.save().then((savedBidder) => {
                        tendersData[i].bidders.push(savedBidder._id)
                    }),
                )
            }
        }

        // Wait for all bidders to be created
        await Promise.all(bidderPromises)
        console.log("Bidders saved")

        // Save tenders with updated bidders
        await Promise.all(tendersData.map((tender) => tender.save()))
        console.log("Tenders updated with bidders")

        // Close MongoDB connection
        mongoose.connection.close()
        console.log("MongoDB connection closed")
    } catch (error) {
        console.error("Error:", error)
        mongoose.connection.close()
    }
}

// populate()

// Create super user
const createUser = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MongoDB")

        // password should be hashed
        let hashedPassword = bcrypt.hashSync("pass", 10)
        const user = new User({
            username: "seniru",
            email: "senirupasan@gmail.com",
            password: hashedPassword,
            role: "admin",
        })
        await user.save()
        console.log("User saved")

        mongoose.connection.close()
        console.log("MongoDB connection closed")
    } catch (error) {
        console.error("Error:", error)
        mongoose.connection.close()
    }
}

createUser()
