/**
 * This program is to populate the database using existing excel sheets.
 * The worksheets should be placed in the migrate directory
 */

require("dotenv").config()

const fs = require("fs")
const ExcelJS = require("exceljs")
const mongoose = require("mongoose")
const Tender = require("../models/Tender")
const Bidder = require("../models/Bidder")

const MONGO_URI = process.env.MONGO_URI

const readBidders = (bidderDataColumns, worksheet, r) => {
    let bidders = []
    while (worksheet.getRow(r).values.length > 0) {
        let row = worksheet.getRow(r)
        let bidder = row.values[bidderDataColumns.bidder]
        if (bidder.toLowerCase() == "no offers") return { bidders: [], row: r }

        bidders.push({
            bidder: row.values[bidderDataColumns.bidder],
            manufacturer: row.values[bidderDataColumns.manufacturer],
            currency: row.values[bidderDataColumns.currency],
            quotedPrice: row.values[bidderDataColumns.quotedPrice],
            packSize: row.values[bidderDataColumns.packSize],
            bidBond: row.values[bidderDataColumns.bidBond] == "Yes",
            pr: row.values[bidderDataColumns.pr] == "Yes",
            pca: bidderDataColumns.pca == -1 ? null : row.values[bidderDataColumns.pca],
        })
        r++
    }
    return { bidders, row: r }
}

const skipUnnecessaryRows = (worksheet, r) => {
    while (worksheet.getRow(r).getCell(3).value) r++
    return r
}

const createFromSheets = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MongoDB")

        let tenders = []
        let tenderNumber = -1

        let dir = fs.opendirSync("migrate")
        let dirent
        // read one file for now
        while ((dirent = await dir.read()) !== null) {
            if (!dirent.isFile()) continue
            console.log("Opening", dirent.name)

            let workbook = new ExcelJS.Workbook()
            await workbook.xlsx.readFile(`migrate/${dirent.name}`)
            let worksheet = workbook.getWorksheet(1)
            let rowCount = worksheet.rowCount

            for (let r = 1; r <= rowCount; r++) {
                let row = worksheet.getRow(r)
                if (row.values.includes("Closed On:")) {
                    // start a new tender
                    tenderNumber++
                    // tender details
                    let closedOn = row.values[3].split(" @ ")
                    closedOn[0] = closedOn[0].split(".")
                    let d = parseInt(closedOn[0][0])
                    let m = parseInt(closedOn[0][1])
                    let y = parseInt(closedOn[0][2])

                    closedOn[1] = closedOn[1].split(" ")
                    closedOn[1][0] = closedOn[1][0].split(".")
                    let hours = parseInt(closedOn[1][0][0]) + (closedOn[1][1] == "PM" ? 12 : 0)
                    let mins = parseInt(closedOn[1][0][1])

                    tenders.push({
                        closedOn: new Date(Date.UTC(y, m - 1, d, hours, mins)),
                        itemName: worksheet.getRow(r + 1).values[3].trim(),
                        tenderNumber: worksheet.getRow(r + 2).values[3].trim(),
                        quantity: worksheet.getRow(r + 3).values[3].trim(),
                        conversions: {},
                        bidders: [],
                    })
                    console.log("\t", worksheet.getRow(r + 2).values[3])
                    r = skipUnnecessaryRows(worksheet, r + 4)
                    // currency conversion details
                    let i = 0
                    while (!worksheet.getRow(r + i).values.some((v) => v.match("Bidder"))) {
                        // conversion is in the last column (popping returns the last value)
                        let conversion = worksheet.getRow(r + i).values.pop()
                        i++
                        if (!conversion) continue
                        conversion = conversion.split(/[:=]/)
                        tenders[tenderNumber].conversions[
                            conversion[0].match(/([a-zA-Z\s])+/)[0].trim()
                        ] = parseFloat(conversion[1].match(/([\d.]+)/)[0].trim())
                    }
                    r += i

                    // bidder details
                    let availableBidderData = worksheet.getRow(r).values.map((v) => v.trim())
                    let bidderDataColumns = {
                        bidder: availableBidderData.indexOf("Bidder"),
                        manufacturer: availableBidderData.indexOf("Manufacturer"),
                        currency: availableBidderData.indexOf("Currency"),
                        quotedPrice: availableBidderData.indexOf("Quoted Price"),
                        packSize: availableBidderData.indexOf("Pack Size"),
                        bidBond: availableBidderData.indexOf("Bid Bond"),
                        pr: availableBidderData.indexOf("PR"),
                        pca: availableBidderData.indexOf("PCA"),
                    }
                    let { bidders, row: newR } = readBidders(bidderDataColumns, worksheet, r + 1)
                    tenders[tenderNumber].bidders = bidders
                    r = newR

                    // save the tender
                    // saving the tender could be done in the above steps aswell
                    // but I find it much safer this way as I can see every data being read
                    // which helps me to identify errors (errors within the sheet mostly)
                    console.log("\t\t", "Saving tender...")

                    let tender = new Tender({
                        itemName: tenders[tenderNumber].itemName,
                        closedOn: tenders[tenderNumber].closedOn,
                        tenderNumber: tenders[tenderNumber].tenderNumber,
                        quantity: tenders[tenderNumber].quantity,
                        conversionRates: tenders[tenderNumber].conversions,
                        bidders: [],
                    })
                    await tender.save()

                    let bidderPromises = []
                    for (let bidderData of tenders[tenderNumber].bidders) {
                        bidderPromises.push(
                            (async () => {
                                let bidder = new Bidder(bidderData)
                                await bidder.save()
                                tender.bidders.push(bidder._id)
                            })(),
                        )
                    }
                    await Promise.all(bidderPromises)
                    await tender.save()
                    console.log("\t\t", "Saved!")
                }
            }
        }
        console.log("Finished!")
        mongoose.connection.close()
        console.log("MongoDB connection closed!")
    } catch (error) {
        console.error("Error:", error)
        mongoose.connection.close()
    }
}

createFromSheets()
