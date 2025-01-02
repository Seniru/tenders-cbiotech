import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"

import useFetch from "../hooks/useFetch"
import Button from "../components/Button"
import TenderInfo from "../components/TenderInfo"

const { REACT_APP_API_URL } = process.env

export default function TenderByDate() {
    const { date } = useParams()
    let [tenderDetails] = useFetch(
        `${REACT_APP_API_URL}/api/tenders/${date}`,
        [],
    )

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                }}
            >
                <h1>Tenders on {date}</h1>
                <Button isPrimary={true}>
                    <FontAwesomeIcon icon={faPrint} />
                    <span style={{ marginLeft: 5 }}>Print</span>
                </Button>
            </div>

            <div>
                {tenderDetails.map((detail) => (
                    <TenderInfo details={detail} />
                ))}
            </div>
        </>
    )
}
