require("dotenv").config()

const ExcelJS = require("exceljs")
const stream = require("stream")

const prepareIndexSheets = async (tenders, res) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet()

    worksheet.columns = [{ width: 60 }, { width: 35 }, { width: 35 }, { width: 10 }, { width: 24 }]

    worksheet.addTable({
        name: "Product index",
        ref: "A1",
        headerRow: true,
        style: {
            theme: "TableStyleLight5",
            showRowStripes: true,
            showFirstColumn: true,
        },
        columns: [
            { name: "Product", filterButton: true },
            { name: "Bidder", filterButton: true },
            { name: "Manufacturer", filterButton: true },
            { name: "Currency", filterButton: true },
            { name: "Quoted Price", filterButton: true },
        ],
        rows: tenders.map((tender) => [
            {
                text: tender.itemName,
                hyperlink: `${process.env.FRONTEND_URL}/product/${encodeURIComponent(tender.itemName)}`,
            },
            tender.bidder,
            tender.manufacturer,
            tender.currency,
            tender.quotedPrice?.toFixed(2),
        ]),
    })

    for (let r = 2; r <= worksheet.rowCount; r++) {
        let row = worksheet.getRow(r)
        row.getCell(4).alignment = { horizontal: "center" }
        row.getCell(5).alignment = { horizontal: "right" }
    }

    let fileStream = new stream.PassThrough()
    await workbook.xlsx.write(fileStream)
    res.attachment("output.xlsx")
    fileStream.pipe(res)
}

module.exports = prepareIndexSheets
