import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"

import useFetch from "../hooks/useFetch"
import Button from "../components/Button"
import TenderInfo from "../components/TenderInfo"
import MessageBox from "../components/MessageBox"

const { REACT_APP_API_URL } = process.env

export default function Product() {
    const { productName } = useParams()
    let [refreshList, setRefreshList] = useState(false)
    let [tenderDetails, tenderFetchError] = useFetch(
        `${REACT_APP_API_URL}/api/product/${encodeURIComponent(productName)}`,
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
        document.title = productName + " | Cliniqon Biotech"
    }, [productName])

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
