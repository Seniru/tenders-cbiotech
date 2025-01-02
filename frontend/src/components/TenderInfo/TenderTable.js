import "./TenderInfo.css"

function TenderRow({ tender, index }) {
    return (
        <tr>
            <td>{index}</td>
            <td>{tender.bidder || "No offers"}</td>
            <td>{tender.manufacturer}</td>
            <td>{tender.currency}</td>
            <td>{tender.quotedPrice}</td>
            <td>{tender.packSize}</td>
            <td>{tender.quotedPriceLKR}</td>
            <td>{tender.quotedUnitPriceLKR}</td>
            <td>{tender.bindBond ? "Yes" : "No"}</td>
            <td>{tender.pr ? "Yes" : "No"}</td>
            <td>{tender.pca ? "Yes" : "No"}</td>
        </tr>
    )
}

export default function TenderTable({ tenders }) {
    return (
        <table className="tender-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Bidder</th>
                    <th>Manufacturer</th>
                    <th>Currency</th>
                    <th>Quoted Price</th>
                    <th>Pack Size</th>
                    <th>Quoted Price in LKR</th>
                    <th>Quoted Unit Price (LKR)</th>
                    <th>Bid Bond</th>
                    <th>PR</th>
                    <th>PCA</th>
                </tr>
            </thead>
            <tbody>
                {tenders.length > 0 ? (
                    tenders.map((tender, index) => (
                        <TenderRow index={index + 1} tender={tender} />
                    ))
                ) : (
                    <TenderRow index={1} tender={{}} />
                )}
            </tbody>
        </table>
    )
}
