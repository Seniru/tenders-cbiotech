import { useEffect, useState, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCoins,
    faEdit,
    faCheck,
    faXmark,
} from "@fortawesome/free-solid-svg-icons"

import { useAuth } from "../../contexts/AuthProvider"
import Input from "../Input"
import Button from "../Button"

const { REACT_APP_API_URL } = process.env

function RateComponent({ currency, rate, editting, onChange, onRemove }) {
    let [c, setC] = useState(currency)
    let [r, setR] = useState(rate)
    let currencyRef = useRef()
    let rateRef = useRef()

    useEffect(() => {
        setC(currency)
    }, [currency])

    useEffect(() => {
        setR(rate)
    }, [rate])

    const handleChanges = (evt) => {
        if (evt.target.name === "currency") setC(evt.target.value)
        else if (evt.target.name === "rate") setR(evt.target.value)
        onChange([currencyRef.current.value, rateRef.current.value])
    }

    return (
        <div>
            <span className="secondary-text">
                1{" "}
                {editting ? (
                    <Input
                        type="text"
                        name="currency"
                        value={c}
                        ref={currencyRef}
                        style={{ width: 50 }}
                        onChange={handleChanges}
                    />
                ) : (
                    currency.toUpperCase()
                )}
            </span>
            {" = "}
            <span>
                {editting ? (
                    <Input
                        type="number"
                        name="rate"
                        value={r}
                        ref={rateRef}
                        style={{ width: 100 }}
                        onChange={handleChanges}
                    />
                ) : (
                    rate
                )}{" "}
                LKR
            </span>
            {editting && (
                <FontAwesomeIcon
                    icon={faXmark}
                    style={{
                        color: "red",
                        cursor: "pointer",
                        marginLeft: 5,
                    }}
                    onClick={onRemove}
                />
            )}
        </div>
    )
}

export default function TenderCurrencyInfo({
    details,
    setIsError,
    setMessage,
    refreshList,
    setRefreshList,
}) {
    let [editting, setEditting] = useState(false)
    let [currencies, setCurrencies] = useState([])
    let { user, token } = useAuth()

    useEffect(() => {
        let cList = []
        for (let [currency, rate] of Object.entries(
            details.conversionRates || {},
        )) {
            cList.push([currency, rate])
        }
        setCurrencies(cList)
    }, [details.conversionRates])

    const handleConversionRateChange = (index, conversions) => {
        const newConversionRates = [...currencies]
        newConversionRates[index] = conversions
        setCurrencies(newConversionRates)
    }

    const addRate = () => {
        setCurrencies([...currencies, ["", 0]])
    }

    const removeRate = (index) => {
        setCurrencies(currencies.filter((_, i) => i !== index))
    }

    const submitChanges = async () => {
        let response = await fetch(
            `${REACT_APP_API_URL}/api/tenders/${encodeURIComponent(details.tenderNumber)}/conversionRates`,
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    conversionRates: Object.fromEntries(currencies),
                }),
            },
        )
        let result = await response.json()
        setIsError(!response.ok)
        if (response.ok) {
            setMessage("Editted!")
            setEditting(false)
            setRefreshList(!refreshList)
        } else {
            setMessage(result.body || response.statusText)
        }
    }

    return (
        <>
            <h4 style={{ marginTop: 0 }}>
                <FontAwesomeIcon icon={faCoins} style={{ marginRight: 5 }} />
                Conversion rates
                {user.role !== "viewer" &&
                    (editting ? (
                        <>
                            <FontAwesomeIcon
                                icon={faCheck}
                                color="green"
                                cursor="pointer"
                                title="Confirm"
                                style={{ marginLeft: 5 }}
                                onClick={submitChanges}
                            />
                            <FontAwesomeIcon
                                icon={faXmark}
                                color="red"
                                cursor="pointer"
                                title="Cancel"
                                style={{ marginLeft: 5 }}
                                onClick={() => setEditting(false)}
                            />
                        </>
                    ) : (
                        <FontAwesomeIcon
                            icon={faEdit}
                            style={{
                                marginLeft: 5,
                                color: "var(--primary-color)",
                                cursor: "pointer",
                            }}
                            className="no-print"
                            onClick={() => setEditting(true)}
                        />
                    ))}
            </h4>
            {details.conversionRates ? (
                (editting
                    ? currencies
                    : Object.entries(details.conversionRates)
                ).map((conversion, index) => {
                    return (
                        <RateComponent
                            currency={conversion[0]}
                            rate={conversion[1]}
                            editting={editting}
                            index={index}
                            onChange={(conversions) =>
                                handleConversionRateChange(index, conversions)
                            }
                            onRemove={() => removeRate(index)}
                        />
                    )
                })
            ) : (
                <span style={{ color: "var(--secondary-text-color)" }}>
                    N/A
                </span>
            )}
            <br />
            {editting && (
                <Button kind="primary" onClick={addRate}>
                    + Add rate
                </Button>
            )}
        </>
    )
}
