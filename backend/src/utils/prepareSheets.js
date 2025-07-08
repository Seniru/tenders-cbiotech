const ExcelJS = require("exceljs")
const stream = require("stream")

const formatDateTimeDisplay = (date) => {
    return `${date.toLocaleDateString("si-LK")} @ ${date.toLocaleTimeString("si-LK")}`
}

const formatNumber = (n, min, max) =>
    n &&
    n.toLocaleString("en-US", {
        maximumFractionDigits: max,
        minimumFractionDigits: min,
    })

const addBidder = (worksheet, bidder, index) => {
    let currentRow = worksheet.getRow(worksheet.rowCount + 1)
    currentRow.values = [
        index + 1,
        bidder.bidder,
        bidder.manufacturer,
        bidder.currency,
        formatNumber(bidder.quotedPrice, 2),
        bidder.packSize,
        formatNumber(bidder.quotedPriceLKR, 2, 2),
        formatNumber(bidder.quotedUnitPriceLKR, 2, 2),
        bidder.bidBond === null ? "N/A" : bidder.bidBond ? "Yes" : "No",
        bidder.pr === null ? "N/A" : bidder.pr ? "Yes" : "No",
        bidder.pca === null ? "N/A" : bidder.pca ? "Yes" : "No",
    ]
    currentRow.font = {
        size: 12,
        name: "Calibri",
    }

    let shouldHighlight = bidder.bidder.toLowerCase().match(/.*(slim|cliniqon).*/)
    for (let c = 1; c <= 11; c++) {
        currentRow.getCell(c).border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
        }
        // highlight row if it's slim/cliniqon
        if (shouldHighlight)
            currentRow.getCell(c).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" },
            }
    }

    currentRow.getCell(1).alignment = { horizontal: "center" } // number
    currentRow.getCell(4).alignment = { horizontal: "center" } // currency
    currentRow.getCell(5).alignment = { horizontal: "right" } // quoted price
    currentRow.getCell(6).alignment = { horizontal: "center" } // pack size
    currentRow.getCell(7).alignment = { horizontal: "right" } // quoted price (LKR)
    currentRow.getCell(8).alignment = { horizontal: "right" } // quoted unit price (LKR)
    currentRow.getCell(9).alignment = { horizontal: "center" } // bid bond
    currentRow.getCell(10).alignment = { horizontal: "center" } // pr
    currentRow.getCell(11).alignment = { horizontal: "center" } // pca
}

const addTenderInformation = (worksheet, key, value, extraStyles) => {
    let currentRow = worksheet.getRow(worksheet.rowCount + 1)

    let keyCell = currentRow.getCell(2)
    keyCell.font = {
        name: "Calibri",
        bold: true,
        size: 12,
    }
    keyCell.alignment = { horizontal: "right" }
    keyCell.value = key

    let valueCell = currentRow.getCell(3)
    valueCell.font = {
        ...extraStyles,
        name: "Calibri",
        bold: true,
        size: 12,
    }
    valueCell.alignment = { horizontal: "left" }
    valueCell.value = value
}

const addConversions = (worksheet, conversionRates) => {
    let currentRow = worksheet.rowCount
    for (let [currency, rate] of Object.entries(conversionRates || {})) {
        worksheet.getRow(++currentRow).getCell(7).value = `1 ${currency} = ${rate} LKR`
    }
    return currentRow + (Object.keys(conversionRates || {}).length == 0 ? 2 : 1)
}

const addTender = (worksheet, tender) => {
    addTenderInformation(worksheet, "Closed On:", formatDateTimeDisplay(tender.closedOn), {
        color: { argb: "FFC00000" },
    })
    addTenderInformation(worksheet, "Item Name:", tender.itemName, { color: { argb: "FFFF00FF" } })
    addTenderInformation(worksheet, "Tender Number:", tender.tenderNumber)
    addTenderInformation(worksheet, "Quantity:", tender.quantity)
    let currentRow = addConversions(worksheet, tender.conversionRates)
    // add table headings
    worksheet.getRow(currentRow).font = {
        bold: true,
        size: 12,
        name: "Calibri",
    }
    worksheet.getRow(currentRow).values = [
        "No",
        "Bidder",
        "Manufacturer",
        "Currency",
        "Quoted Price",
        "Pack Size",
        "Quoted Price in LKR",
        "Quoted Unit Price in LKR",
        "Bid Bond",
        "PR",
        "PCA",
    ]
    for (let c = 1; c <= 11; c++) {
        worksheet.getRow(currentRow).getCell(c).border = {
            top: { style: "medium", color: { argb: "FF000000" } },
            bottom: { style: "medium", color: { argb: "FF000000" } },
            left: { style: "medium", color: { argb: "FF000000" } },
            right: { style: "medium", color: { argb: "FF000000" } },
        }
    }
    if (tender.bidders.length === 0) {
        let r = worksheet.getRow(worksheet.rowCount + 1)
        r.values = [1, "No Offers"]
        r.font = {
            size: 12,
            name: "Calibri",
        }

        for (let c = 1; c <= 11; c++) {
            r.getCell(c).border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            }
        }
    } else {
        tender.bidders.forEach((bidder, index) => addBidder(worksheet, bidder, index))
    }
    // add an empty row
    let lastRow = worksheet.getRow(worksheet.rowCount + 1)
    lastRow.values = [""]
    for (let c = 1; c <= 11; c++) {
        lastRow.getCell(c).border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
        }
    }
    worksheet.getRow(worksheet.rowCount + 1).values = [""]
}

const prepareSheets = async (tenders, res, spreadToMultipleSheets) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = !spreadToMultipleSheets ? workbook.addWorksheet() : null

    const columnSizes = [
        { width: 6 },
        { width: 35 },
        { width: 35 },
        { width: 12 },
        { width: 24 },
        { width: 10 },
        { width: 24 },
        { width: 24 },
        { width: 10 },
        { width: 10 },
        { width: 10 },
    ]

    if (!spreadToMultipleSheets) worksheet.columns = columnSizes

    for (let tender of tenders) {
        let sheet = worksheet
        if (spreadToMultipleSheets) {
            sheet = workbook.addWorksheet(
                tender.itemName
                    .replaceAll(/[*?:\\/[\]]/g, " ")
                    .replaceAll(/\s+/g, " ")
                    .trim(),
            )
            sheet.columns = columnSizes
        }
        addTender(sheet, tender)
    }

    let fileStream = new stream.PassThrough()
    await workbook.xlsx.write(fileStream)
    res.attachment("output.xlsx")
    fileStream.pipe(res)
}

module.exports = prepareSheets
