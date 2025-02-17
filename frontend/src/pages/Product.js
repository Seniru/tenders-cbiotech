import { useState, useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExcel, faPrint } from "@fortawesome/free-solid-svg-icons"

import useFetch from "../hooks/useFetch"
import Button from "../components/Button"
import TenderInfo from "../components/TenderInfo"
import MessageBox from "../components/MessageBox"
import { useAuth } from "../contexts/AuthProvider"

const { REACT_APP_API_URL } = process.env

export default function Product() {
    const { productName } = useParams()
    const searchParams = new URLSearchParams(useLocation().search)
    const latestOnly = searchParams.get("latestOnly")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")
    const minBidders = searchParams.get("minBidders")
    const maxBidders = searchParams.get("maxBidders")
    const matchBidders = searchParams.get("matchBidders")

    let [refreshList, setRefreshList] = useState(false)

    let queryParams = useMemo(() => {
        let params = {}
        if (latestOnly) params.latestOnly = latestOnly
        if (fromDate) params.fromDate = fromDate
        if (toDate) params.toDate = toDate
        if (minBidders) params.minBidders = minBidders
        if (maxBidders) params.maxBidders = maxBidders
        if (matchBidders) params.matchBidders = matchBidders

        return params
    }, [latestOnly, fromDate, toDate, minBidders, maxBidders, matchBidders])

    let [tenderDetails, tenderFetchError] = useFetch(
        `${REACT_APP_API_URL}/api/product/${encodeURIComponent(productName)}?${new URLSearchParams(queryParams).toString()}`,
        [],
        refreshList,
    )
    let [error, setError] = useState(null)
    let { token } = useAuth()

    useEffect(() => {
        if (tenderFetchError) {
            setError(tenderFetchError)
        }
    }, [tenderFetchError])

    useEffect(() => {
        document.title = productName + " | Cliniqon Biotech"
    }, [productName])

    const downloadSheet = async () => {
        const response = await fetch(
            `${REACT_APP_API_URL}/api/product/${encodeURIComponent(productName)}.xlsx?${new URLSearchParams(queryParams).toString()}`,
            {
                headers: {
                    "Content-Type":
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    Authorization: "Bearer " + token,
                },
            },
        )

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${productName}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    }

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
                <h1>{productName}</h1>
                <div>
                    <Button kind="primary" onClick={window.print}>
                        <FontAwesomeIcon icon={faPrint} /> Print
                    </Button>
                    <Button kind="primary" onClick={downloadSheet}>
                        <FontAwesomeIcon icon={faFileExcel} /> Download sheet
                    </Button>
                </div>
            </div>
            {(fromDate || toDate) && (
                <div>
                    <span class="secondary-text">Showing tenders </span>
                    {fromDate && <span class="secondary-text">from </span>}
                    {fromDate}
                    {toDate && <span class="secondary-text"> upto </span>}
                    {toDate}
                </div>
            )}
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
