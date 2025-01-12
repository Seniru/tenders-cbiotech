import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCalendar,
    faCoins,
    faPills,
    faTrash,
} from "@fortawesome/free-solid-svg-icons"

import Button from "../Button"
import MessageBox from "../MessageBox"
import { useAuth } from "../../contexts/AuthProvider"
import "./TenderInfo.css"
import TenderTable from "./TenderTable"
import AddBidderForm from "../../forms/AddBidderForm"

const { REACT_APP_API_URL } = process.env

function RateComponent({ currency, rate }) {
    return (
        <div>
            <span className="secondary-text">
                1 {currency.toUpperCase()} ={" "}
            </span>
            <span>{rate} LKR</span>
        </div>
    )
}

function TenderDetailsComponent({ icon, detail, value }) {
    return (
        <div>
            {icon ? <FontAwesomeIcon icon={icon} color="#666666" /> : <span />}
            <div className="secondary-text">{detail}:</div>
            <div>{value}</div>
        </div>
    )
}

export default function TenderInfo({ details, refreshList, setRefreshList }) {
    let [isError, setIsError] = useState(false)
    let [message, setMessage] = useState(null)
    let [addBidderFormOpen, setAddBidderFormOpen] = useState(false)
    let { user, token } = useAuth()

    const deleteTender = async (tenderNumber) => {
        let request = await fetch(
            `${REACT_APP_API_URL}/api/tenders/${tenderNumber}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
            },
        )

        let response = await request.json()
        if (request.ok) {
            setIsError(false)
            setMessage("Tender deleted")
            // refresh the tender list
            setRefreshList(!refreshList)
        } else {
            setIsError(true)
            setMessage(response.body || request.statusText)
        }
    }

    return (
        <div className="container tender-info-container">
            <MessageBox
                isError={isError}
                message={message}
                setMessage={setMessage}
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex" }}>
                    <div className="tender-details">
                        <TenderDetailsComponent
                            icon={faCalendar}
                            detail="Closed on"
                            value={details.closedOn}
                        />
                        <TenderDetailsComponent
                            icon={faPills}
                            detail="Item Name"
                            value={details.itemName}
                        />
                        <TenderDetailsComponent
                            detail="Tender Number"
                            value={details.tenderNumber}
                        />
                        <TenderDetailsComponent
                            detail="Quantity"
                            value={details.quantity}
                        />
                    </div>

                    <div className="currency-conversions">
                        <h4 style={{ marginTop: 0 }}>
                            <FontAwesomeIcon
                                icon={faCoins}
                                style={{ marginRight: 5 }}
                            />
                            Conversion rates
                        </h4>
                        {details.conversionRates ? (
                            Object.entries(details.conversionRates).map(
                                (rates) => (
                                    <RateComponent
                                        currency={rates[0]}
                                        rate={rates[1]}
                                    />
                                ),
                            )
                        ) : (
                            <span
                                style={{ color: "var(--secondary-text-color)" }}
                            >
                                N/A
                            </span>
                        )}
                    </div>
                </div>
                {user.role !== "viewer" && (
                    <Button
                        kind="danger"
                        onClick={() => deleteTender(details.tenderNumber)}
                    >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                )}
            </div>
            <div>
                <TenderTable
                    tenderNumber={details.tenderNumber}
                    tenders={details.bidders}
                    setIsError={setIsError}
                    setMessage={setMessage}
                    refreshList={refreshList}
                    setRefreshList={setRefreshList}
                />
                <br />
                <Button
                    kind="primary"
                    onClick={() => setAddBidderFormOpen(true)}
                >
                    + Add bidder
                </Button>
                <AddBidderForm
                    tenderNumber={details.tenderNumber}
                    isOpen={addBidderFormOpen}
                    setIsOpen={setAddBidderFormOpen}
                />
            </div>
        </div>
    )
}
