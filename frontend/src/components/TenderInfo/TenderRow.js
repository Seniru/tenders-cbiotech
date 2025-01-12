import { useId, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faEdit, faXmark } from "@fortawesome/free-solid-svg-icons"

import { useAuth } from "../../contexts/AuthProvider"
import Input from "../Input"

const { REACT_APP_API_URL } = process.env

const formatNumber = (n) =>
    n && n.toFixed(5).replace(/(?<=\.\d\d0*[1-9]*)0+$/, "")

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

    const handleChanges = (evt) => {
        let { name, value } = evt.target
        setValues({
            ...values,
            [name]: value,
        })
    }

    const submitEdits = async () => {
        let response = await fetch(
            `${REACT_APP_API_URL}/api/tenders/${encodeURIComponent(row.tenderNumber)}/${encodeURIComponent(row.bidder)}`,
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
                    <Input
                        type="text"
                        placeholder="Pack size"
                        name="packSize"
                        style={{ width: 70 }}
                        value={values.packSize}
                        onChange={handleChanges}
                        required
                    />
                ) : (
                    row.packSize
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
                    <Input
                        type="checkbox"
                        name="bidBond"
                        checked={values.bidBond}
                        onChange={(e) => {
                            setValues({ ...values, bidBond: e.target.checked })
                        }}
                    />
                ) : row.bidBond ? (
                    "Yes"
                ) : (
                    "No"
                )}
            </td>
            <td style={{ width: "calc(5vw - 17px)", textAlign: "center" }}>
                {editting ? (
                    <Input
                        type="checkbox"
                        name="pr"
                        checked={values.pr}
                        onChange={(e) => {
                            setValues({ ...values, pr: e.target.checked })
                        }}
                    />
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
                    width: user.role !== "viewer" ? 0 : "calc(2vw - 17px)",
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
                        <FontAwesomeIcon
                            icon={faEdit}
                            color="var(--primary-color)"
                            cursor="pointer"
                            title="Edit"
                            onClick={() => setEditting(true)}
                        />
                    ))}
            </td>
        </tr>
    )
}
