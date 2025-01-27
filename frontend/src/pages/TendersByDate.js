import { useState, useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"

import useFetch from "../hooks/useFetch"
import Button from "../components/Button"
import TenderInfo from "../components/TenderInfo"
import MessageBox from "../components/MessageBox"

const { REACT_APP_API_URL } = process.env

export default function TenderByDate() {
    const { date } = useParams()
    const searchParams = new URLSearchParams(useLocation().search)
    const minBidders = searchParams.get("minBidders")
    const maxBidders = searchParams.get("maxBidders")
    const matchBidders = searchParams.get("matchBidders")
    let queryParams = useMemo(() => {
        let params = {}
        if (minBidders) params.minBidders = minBidders
        if (maxBidders) params.maxBidders = maxBidders
        if (matchBidders) params.matchBidders = matchBidders

        return params
    }, [minBidders, maxBidders, matchBidders])

    let [refreshList, setRefreshList] = useState(false)

    let [tenderDetails, tenderFetchError] = useFetch(
        `${REACT_APP_API_URL}/api/tenders/${date}?${new URLSearchParams(queryParams).toString()}`,
        [],
        refreshList,
    )
    let [error, setError] = useState(null)

    useEffect(() => {
        if (tenderFetchError) {
            setError(tenderFetchError)
        }
    }, [tenderFetchError])

    useEffect(() => {
        document.title = "Tenders on " + date + " | Cliniqon Biotech"
    }, [date])

    return (
        <>
            <MessageBox isError={true} message={error} setMessage={setError} />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    flexWrap: "wrap",
                }}
            >
                <h1>Tenders on {date}</h1>
                <Button kind="primary" onClick={window.print}>
                    <FontAwesomeIcon icon={faPrint} />
                    <span style={{ marginLeft: 5 }}>Print</span>
                </Button>
            </div>

            <div>
                {tenderDetails?.body?.tenders.map((detail) => (
                    <TenderInfo
                        details={detail}
                        refreshList={refreshList}
                        setRefreshList={setRefreshList}
                    />
                ))}
            </div>
        </>
    )
}
