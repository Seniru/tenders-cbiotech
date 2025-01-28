import Table from "../Table"
import TenderRow from "./TenderRow"
import "./TenderInfo.css"

export default function TenderTable({
    tenderNumber,
    tenders,
    setIsError,
    setMessage,
    refreshList,
    setRefreshList,
}) {
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
                "",
            ]}
            rows={tenders.map((tender) => ({
                ...tender,
                tenderNumber,
                setIsError,
                setMessage,
                refreshList,
                setRefreshList,
            }))}
            renderRowWith={TenderRow}
            emptyTableText="No offers"
        />
    )
}
