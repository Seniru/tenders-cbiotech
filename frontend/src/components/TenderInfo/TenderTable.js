import Table from "../Table"
import "./TenderInfo.css"

const formatNumber = (n) =>
    n && n.toFixed(5).replace(/(?<=\.\d\d0*[1-9]*)0+$/, "")

function TenderRow({ row, index }) {
    return (
        <tr
            style={{
                backgroundColor: row.bidder
                    ?.toLowerCase()
                    .match("(slim|cliniqon)")
                    ? "#FFEB3B"
                    : "initial",
            }}
        >
            <td style={{ width: "calc(2vw - 17px)", textAlign: "center" }}>
                {index + 1}
            </td>
            <td style={{ width: "calc(19vw - 17px)" }}>
                {row.bidder || "No offers"}
            </td>
            <td style={{ width: "calc(19vw - 17px)" }}>{row.manufacturer}</td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {row.currency}
            </td>
            <td style={{ width: "calc(10vw - 17px)", textAlign: "right" }}>
                {formatNumber(row.quotedPrice)}
            </td>
            <td style={{ width: "calc(10vw - 17px)", textAlign: "center" }}>
                {row.packSize}
            </td>
            <td style={{ width: "calc(10vw - 17px)", textAlign: "right" }}>
                {formatNumber(row.quotedPriceLKR)}
            </td>
            <td style={{ width: "calc(10vw - 17px)", textAlign: "right" }}>
                {formatNumber(row.quotedUnitPriceLKR)}
            </td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {row.bidBond ? "Yes" : "No"}
            </td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {row.pr ? "Yes" : "No"}
            </td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {row.pca ? "Yes" : "No"}
            </td>
        </tr>
    )
}

export default function TenderTable({ tenders }) {
    return (
        <Table
            headers={[
                "No",
                "Bidder",
                "Manufacturer",
                "Currency",
                "Quoted Price",
                "Pack Size",
                "Quoted Price in LKR",
                "Quoted Unit Price (LKR)",
                "Bid Bond",
                "PR",
                "PCA",
            ]}
            rows={tenders}
            renderRowWith={TenderRow}
            emptyTableText="No offering"
        />
    )
}
