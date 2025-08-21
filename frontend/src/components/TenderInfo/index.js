import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCalendar,
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
import TenderDetailsComponent from "./TenderDetailsComponent"
import AddBidderForm from "../../forms/AddBidderForm"
import TenderCurrencyInfo from "./TenderCurrencyInfo"
import OverlayWindow from "../OverlayWindow"

const { REACT_APP_API_URL } = process.env

export default function TenderInfo({ details, refreshList, setRefreshList }) {
    let [isError, setIsError] = useState(false)
    let [message, setMessage] = useState(null)
    let [isDeleteConfirmationWindowOpen, setIsDeleteConfirmationWindowOpen] =
        useState(false)
    let [deletingTender, setDeletingTender] = useState(null)
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

    const showDeleteTenderConfirmationWindow = async (tenderNumber) => {
        setDeletingTender(tenderNumber)
        setIsDeleteConfirmationWindowOpen(true)
    }

    const deleteTender = async (tenderNumber) => {
        let request = await fetch(
            `${REACT_APP_API_URL}/api/tenders/${encodeURIComponent(tenderNumber)}`,
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
        if (tenderValues.closedOn)
            tenderValues.closedOn = new Date(
                tenderValues.closedOn,
            ).toISOString()

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

    const formatDateTimeLocal = (date) => {
        const tzOffset = date.getTimezoneOffset() * 60000
        const localISOTime = new Date(date - tzOffset)
            .toISOString()
            .slice(0, 16)
        return localISOTime
    }

    const formatDateTimeDisplay = (date) => {
        return `${date.toLocaleDateString("en-GB")} @ ${date.toLocaleTimeString("si-LK")}`
    }

    return (
        <div className="container tender-info-container">
            <MessageBox
                isError={isError}
                message={message}
                setMessage={setMessage}
            />
            <OverlayWindow
                isOpen={isDeleteConfirmationWindowOpen}
                setIsOpen={setIsDeleteConfirmationWindowOpen}
            >
                {deletingTender && (
                    <>
                        <h3>Confirmation</h3>
                        <hr />
                        Are you sure to delete tender <b>{deletingTender}?</b>
                        <br />
                        <br />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                kind="danger"
                                onClick={() => deleteTender(deletingTender)}
                            >
                                Delete
                            </Button>
                            <Button
                                kind="secondary"
                                onClick={() =>
                                    setIsDeleteConfirmationWindowOpen(false)
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                )}
            </OverlayWindow>
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
                                    ? formatDateTimeLocal(
                                          new Date(tenderValues.closedOn),
                                      )
                                    : formatDateTimeDisplay(
                                          new Date(details.closedOn),
                                      )
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
                                className="no-print"
                                title="Edit tender information"
                                cursor="pointer"
                                onClick={() =>
                                    setIsEdittingTenderInformation(true)
                                }
                            />
                        ))}
                    <div className="currency-conversions">
                        <TenderCurrencyInfo
                            details={details}
                            setIsError={setIsError}
                            setMessage={setMessage}
                            refreshList={refreshList}
                            setRefreshList={setRefreshList}
                        />
                    </div>
                </div>
                {user.role !== "viewer" && (
                    <Button
                        kind="danger"
                        onClick={() =>
                            showDeleteTenderConfirmationWindow(
                                details.tenderNumber,
                            )
                        }
                    >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                )}
            </div>
            <div style={{ overflowX: "scroll" }}>
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
