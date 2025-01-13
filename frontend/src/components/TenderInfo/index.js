import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCalendar,
    faCoins,
    faEdit,
    faPills,
    faTrash,
    faCheck,
    faXmark,
} from "@fortawesome/free-solid-svg-icons"

import Button from "../Button"
import MessageBox from "../MessageBox"
import { useAuth } from "../../contexts/AuthProvider"
import "./TenderInfo.css"
import TenderTable from "./TenderTable"
import AddBidderForm from "../../forms/AddBidderForm"
import Input from "../Input"

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

function TenderDetailsComponent({
    name,
    icon,
    detail,
    value,
    color,
    dataType,
    isEdittingTenderInformation,
    onChange,
}) {
    return (
        <div>
            {icon ? <FontAwesomeIcon icon={icon} color="#666666" /> : <span />}
            <div className="secondary-text">{detail}:</div>
            <div style={{ color }}>
                {!isEdittingTenderInformation ? (
                    value
                ) : (
                    <Input
                        type={dataType}
                        name={name}
                        value={value}
                        style={{
                            marginTop: 0,
                            width: "-webkit-fill-available",
                        }}
                        onChange={onChange}
                        required
                    />
                )}
            </div>
        </div>
    )
}

export default function TenderInfo({ details, refreshList, setRefreshList }) {
    let [isError, setIsError] = useState(false)
    let [message, setMessage] = useState(null)
    let [addBidderFormOpen, setAddBidderFormOpen] = useState(false)
    let [tenderValues, setTenderValues] = useState({
        itemName: details.itemName,
        tenderNumber: details.tenderNumber,
        quantity: details.quantity,
        closedOn: details.closedOn,
    })
    let [isEdittingTenderInformation, setIsEdittingTenderInformation] =
        useState(false)
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

    const editTenderInformation = async () => {
        let response = await fetch(
            `${REACT_APP_API_URL}/api/tenders/${encodeURIComponent(details.tenderNumber)}`,
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tenderValues),
            },
        )
        let result = await response.json()
        setIsError(!response.ok)
        if (response.ok) {
            setMessage("Editted!")
            setIsEdittingTenderInformation(false)
            setRefreshList(!refreshList)
        } else {
            setMessage(result.body || response.statusText)
        }
    }

    const handleTenderChanges = (evt) => {
        setTenderValues({
            ...tenderValues,
            [evt.target.name]: evt.target.value,
        })
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
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex" }}>
                    <div className="tender-details">
                        <TenderDetailsComponent
                            icon={faCalendar}
                            detail="Closed on"
                            name="closedOn"
                            value={
                                isEdittingTenderInformation
                                    ? new Date(tenderValues.closedOn)
                                          .toISOString()
                                          .slice(0, 16)
                                    : `${new Date(details.closedOn).toLocaleDateString("si-LK")} @ ${new Date(details.closedOn).toLocaleTimeString("si-LK")}`
                            }
                            color="deeppink"
                            dataType="datetime-local"
                            isEdittingTenderInformation={
                                isEdittingTenderInformation
                            }
                            onChange={handleTenderChanges}
                        />
                        <TenderDetailsComponent
                            icon={faPills}
                            detail="Item Name"
                            name="itemName"
                            value={
                                isEdittingTenderInformation
                                    ? tenderValues.itemName
                                    : details.itemName
                            }
                            color="orangered"
                            dataType="text"
                            isEdittingTenderInformation={
                                isEdittingTenderInformation
                            }
                            onChange={handleTenderChanges}
                        />
                        <TenderDetailsComponent
                            detail="Tender Number"
                            name="tenderNumber"
                            value={
                                isEdittingTenderInformation
                                    ? tenderValues.tenderNumber
                                    : details.tenderNumber
                            }
                            dataType="text"
                            isEdittingTenderInformation={
                                isEdittingTenderInformation
                            }
                            onChange={handleTenderChanges}
                        />
                        <TenderDetailsComponent
                            detail="Quantity"
                            name="quantity"
                            value={
                                isEdittingTenderInformation
                                    ? tenderValues.quantity
                                    : details.quantity
                            }
                            dataType="text"
                            isEdittingTenderInformation={
                                isEdittingTenderInformation
                            }
                            onChange={handleTenderChanges}
                        />
                    </div>
                    {user.role !== "viewer" &&
                        (isEdittingTenderInformation ? (
                            <>
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    color="green"
                                    cursor="pointer"
                                    title="Confirm"
                                    style={{ marginLeft: 5 }}
                                    onClick={editTenderInformation}
                                />
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    color="red"
                                    cursor="pointer"
                                    title="Cancel"
                                    style={{ marginLeft: 5 }}
                                    onClick={() =>
                                        setIsEdittingTenderInformation(false)
                                    }
                                />
                            </>
                        ) : (
                            <FontAwesomeIcon
                                icon={faEdit}
                                style={{
                                    marginLeft: 5,
                                    color: "var(--primary-color)",
                                }}
                                title="Edit tender information"
                                cursor="pointer"
                                onClick={() =>
                                    setIsEdittingTenderInformation(true)
                                }
                            />
                        ))}
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
                    setIsError={setIsError}
                    setMessage={setMessage}
                    refreshList={refreshList}
                    setRefreshList={setRefreshList}
                />
            </div>
        </div>
    )
}
