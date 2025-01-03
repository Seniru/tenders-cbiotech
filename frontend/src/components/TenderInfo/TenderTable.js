import Table from "../Table"
import "./TenderInfo.css"

function TenderRow({ row, index }) {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{row.bidder || "No offers"}</td>
            <td>{row.manufacturer}</td>
            <td>{row.currency}</td>
            <td>{row.quotedPrice}</td>
            <td>{row.packSize}</td>
            <td>{row.quotedPriceLKR}</td>
            <td>{row.quotedUnitPriceLKR}</td>
            <td>{row.bindBond ? "Yes" : "No"}</td>
            <td>{row.pr ? "Yes" : "No"}</td>
            <td>{row.pca ? "Yes" : "No"}</td>
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
