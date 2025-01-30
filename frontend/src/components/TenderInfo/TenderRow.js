import { useId, useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCheck,
    faEdit,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons"

import { useAuth } from "../../contexts/AuthProvider"
import Input from "../Input"

const { REACT_APP_API_URL } = process.env

const formatNumber = (n) =>
    n &&
    n.toLocaleString("en-US", {
        maximumFractionDigits: 5,
        minimumFractionDigits: 2,
    })

export default function TenderRow({ row, index }) {
    let [editting, setEditting] = useState(false)
    let [values, setValues] = useState({
        bidder: row.bidder,
        manufacturer: row.manufacturer,
        currency: row.currency,
        quotedPrice: row.quotedPrice,
        packSize: row.packSize,
        bidBond: row.bidBond,
        pr: row.pr,
        pca: row.pca,
    })
    let { setIsError, setMessage, refreshList, setRefreshList } = row
    let id = useId()
    const { user, token } = useAuth()

    useEffect(() => {
        setValues({
            bidder: row.bidder,
            manufacturer: row.manufacturer,
            currency: row.currency,
            quotedPrice: row.quotedPrice,
            packSize: row.packSize,
            bidBond: row.bidBond,
            pr: row.pr,
            pca: row.pca,
            comments: row.comments,
        })
    }, [row])

    const handleChanges = (evt) => {
        let { name, value } = evt.target
        setValues({
            ...values,
            [name]: value,
        })
    }

    const submitEdits = async () => {
        let response = await fetch(
            `${REACT_APP_API_URL}/api/tenders/${encodeURIComponent(row.tenderNumber)}/${encodeURIComponent(row._id)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(values),
            },
        )
        let result = await response.json()
        if (response.ok) {
            setIsError(false)
            setMessage("Updated!")
            setRefreshList(!refreshList)
        } else {
            setIsError(true)
            setMessage(result.body || response.statusText)
            // reset input values to originals
            setValues({
                bidder: row.bidder,
                manufacturer: row.manufacturer,
                currency: row.currency,
                quotedPrice: row.quotedPrice,
                packSize: row.packSize,
                bidBond: row.bidBond,
                pr: row.pr,
                pca: row.pca,
            })
        }
        setEditting(false)
    }

    const deleteTenderBidder = async () => {
        let response = await fetch(
            `${REACT_APP_API_URL}/api/tenders/${encodeURIComponent(row.tenderNumber)}/${encodeURIComponent(row._id)}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            },
        )
        let result = await response.json()
        setIsError(!response.ok)
        setMessage(response.ok ? "Removed!" : result.body)
        setRefreshList(!refreshList)
    }

    return (
        <tr
            style={{
                backgroundColor:
                    !editting &&
                    row.bidder?.toLowerCase().match("(slim|cliniqon)")
                        ? "#FFEB3B"
                        : "reverse-layer",
            }}
        >
            <td style={{ width: "calc(2vw - 17px)", textAlign: "center" }}>
                {index + 1}
            </td>
            <td style={{ width: "calc(18vw - 17px)" }}>
                {editting ? (
                    <Input
                        type="text"
                        placeholder="Bidder"
                        name="bidder"
                        value={values.bidder}
                        onChange={handleChanges}
                        required
                    />
                ) : (
                    row.bidder || "No offers"
                )}
            </td>
            <td style={{ width: "auto" }}>
                {editting ? (
                    <Input
                        type="text"
                        placeholder="Manufacturer"
                        name="manufacturer"
                        value={values.manufacturer}
                        onChange={handleChanges}
                        required
                    />
                ) : (
                    row.manufacturer
                )}
            </td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {editting ? (
                    <Input
                        type="text"
                        placeholder="Currency"
                        name="currency"
                        style={{ width: 30 }}
                        value={values.currency}
                        onChange={handleChanges}
                        required
                    />
                ) : (
                    row.currency
                )}
            </td>
            <td style={{ width: "calc(10vw - 17px)", textAlign: "right" }}>
                {editting ? (
                    <Input
                        type="number"
                        placeholder="Quoted price"
                        name="quotedPrice"
                        value={values.quotedPrice}
                        onChange={handleChanges}
                        required
                    />
                ) : (
                    formatNumber(row.quotedPrice)
                )}
            </td>
            <td style={{ width: "calc(10vw - 17px)", textAlign: "center" }}>
                {editting ? (
                    <>
                        <Input
                            type="text"
                            placeholder="Pack size"
                            name="packSize"
                            style={{ width: 70 }}
                            value={values.packSize}
                            onChange={handleChanges}
                            required
                        />
                        <br />
                        <Input
                            type="text"
                            placeholder="Comments"
                            name="comments"
                            style={{ width: 70 }}
                            value={values.comments}
                            onChange={handleChanges}
                        />
                    </>
                ) : (
                    <>
                        <span>{row.packSize}</span>{" "}
                        {row.comments && (
                            <FontAwesomeIcon
                                icon={faCircleQuestion}
                                cursor="pointer"
                                title={row.comments}
                            />
                        )}
                    </>
                )}
            </td>
            <td style={{ width: "calc(10vw - 17px)", textAlign: "right" }}>
                {formatNumber(row.quotedPriceLKR)}
            </td>
            <td style={{ width: "calc(10vw - 17px)", textAlign: "right" }}>
                {formatNumber(row.quotedUnitPriceLKR)}
            </td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {editting ? (
                    <>
                        <label>
                            Yes
                            <Input
                                type="radio"
                                name={"bidBond" + id}
                                value="yes"
                                checked={values.bidBond === true}
                                onChange={(e) => {
                                    setValues({ ...values, bidBond: true })
                                }}
                            />
                        </label>
                        <label>
                            No
                            <Input
                                type="radio"
                                name={"bidBond" + id}
                                value="no"
                                checked={values.bidBond === false}
                                onChange={(e) => {
                                    setValues({ ...values, bidBond: false })
                                }}
                            />
                        </label>
                        <label>
                            N/A
                            <Input
                                type="radio"
                                name={"bidBond" + id}
                                value="na"
                                checked={values.bidBond === null}
                                onChange={(e) => {
                                    setValues({ ...values, bidBond: null })
                                }}
                            />
                        </label>
                    </>
                ) : row.bidBond === null ? (
                    "N/A"
                ) : row.bidBond ? (
                    "Yes"
                ) : (
                    "No"
                )}
            </td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {editting ? (
                    <>
                        <label>
                            Yes
                            <Input
                                type="radio"
                                name={"pr" + id}
                                value="yes"
                                checked={values.pr === true}
                                onChange={(e) => {
                                    setValues({ ...values, pr: true })
                                }}
                            />
                        </label>
                        <label>
                            No
                            <Input
                                type="radio"
                                name={"pr" + id}
                                value="no"
                                checked={values.pr === false}
                                onChange={(e) => {
                                    setValues({ ...values, pr: false })
                                }}
                            />
                        </label>
                        <label>
                            N/A
                            <Input
                                type="radio"
                                name={"pr" + id}
                                value="na"
                                checked={values.pr === null}
                                onChange={(e) => {
                                    setValues({ ...values, pr: null })
                                }}
                            />
                        </label>
                    </>
                ) : row.pr === null ? (
                    "N/A"
                ) : row.pr ? (
                    "Yes"
                ) : (
                    "No"
                )}
            </td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {editting ? (
                    <>
                        <label>
                            Yes
                            <Input
                                type="radio"
                                name={"pca" + id}
                                value="yes"
                                checked={values.pca === true}
                                onChange={(e) => {
                                    setValues({ ...values, pca: true })
                                }}
                            />
                        </label>
                        <label>
                            No
                            <Input
                                type="radio"
                                name={"pca" + id}
                                value="no"
                                checked={values.pca === false}
                                onChange={(e) => {
                                    setValues({ ...values, pca: false })
                                }}
                            />
                        </label>
                        <label>
                            N/A
                            <Input
                                type="radio"
                                name={"pca" + id}
                                value="na"
                                checked={values.pca === null}
                                onChange={(e) => {
                                    setValues({ ...values, pca: null })
                                }}
                            />
                        </label>
                    </>
                ) : row.pca === null ? (
                    "N/A"
                ) : row.pca ? (
                    "Yes"
                ) : (
                    "No"
                )}
            </td>
            <td
                style={{
                    width: user.role === "viewer" ? 0 : "calc(3vw - 17px)",
                    textAlign: "center",
                }}
            >
                {user.role !== "viewer" &&
                    (editting ? (
                        <>
                            <FontAwesomeIcon
                                icon={faCheck}
                                color="green"
                                cursor="pointer"
                                title="Confirm"
                                onClick={submitEdits}
                            />
                            <FontAwesomeIcon
                                icon={faXmark}
                                color="red"
                                cursor="pointer"
                                title="Cancel"
                                onClick={() => setEditting(false)}
                            />
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faEdit}
                                color="var(--primary-color)"
                                cursor="pointer"
                                title="Edit"
                                onClick={() => setEditting(true)}
                                className="no-print"
                            />{" "}
                            <FontAwesomeIcon
                                icon={faTrash}
                                color="red"
                                cursor="pointer"
                                title="Remove"
                                onClick={deleteTenderBidder}
                                className="no-print"
                            />
                        </>
                    ))}
            </td>
        </tr>
    )
}
