import { useState, useLayoutEffect } from "react"

import { useAuth } from "../contexts/AuthProvider"
import Input from "../components/Input"
import Button from "../components/Button"
import OverlayWindow from "../components/OverlayWindow"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserMinus, faXmark } from "@fortawesome/free-solid-svg-icons"

const { REACT_APP_API_URL } = process.env

function BidderFields({
    bidder,
    manufacturer,
    currency,
    quotedPrice,
    packSize,
    bidBond,
    pr,
    pca,
    comments,
    index,
    handleBidderChange,
    removeFunction,
}) {
    return (
        <>
            <br />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <label>Bidder </label>
                    <Input
                        type="text"
                        value={bidder}
                        required
                        onChange={(e) =>
                            handleBidderChange(index, "bidder", e.target.value)
                        }
                    />
                    <br />
                    <label>Manufacturer </label>
                    <Input
                        type="text"
                        value={manufacturer}
                        required
                        onChange={(e) =>
                            handleBidderChange(
                                index,
                                "manufacturer",
                                e.target.value,
                            )
                        }
                    />
                    <br />
                    <label>Currency </label>
                    <Input
                        type="text"
                        value={currency}
                        required
                        onChange={(e) =>
                            handleBidderChange(
                                index,
                                "currency",
                                e.target.value,
                            )
                        }
                    />
                    <br />
                    <label>Quoted Price </label>
                    <Input
                        type="text"
                        value={quotedPrice || ""}
                        required
                        onChange={(e) =>
                            handleBidderChange(
                                index,
                                "quotedPrice",
                                e.target.value,
                            )
                        }
                    />
                    <br />
                    <label>Pack Size: </label>
                    <Input
                        type="text"
                        value={packSize || ""}
                        required
                        onChange={(e) =>
                            handleBidderChange(
                                index,
                                "packSize",
                                e.target.value,
                            )
                        }
                    />
                    <br />
                    <br />
                    <label>Bid Bond: </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"bidBond-" + index}
                            value="yes"
                            checked={bidBond === true}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "bidBond", true)
                            }
                        />
                        Yes
                    </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"bidBond-" + index}
                            value="no"
                            checked={bidBond === false}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "bidBond", false)
                            }
                        />
                        No
                    </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"bidBond-" + index}
                            value="na"
                            checked={bidBond === null}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "bidBond", null)
                            }
                        />
                        N/A
                    </label>
                    <br />
                    <label>PR: </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"pr-" + index}
                            value="yes"
                            checked={pr === true}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "pr", true)
                            }
                        />
                        Yes
                    </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"pr-" + index}
                            value="no"
                            checked={pr === false}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "pr", false)
                            }
                        />
                        No
                    </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"pr-" + index}
                            value="na"
                            checked={pr === null}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "pr", null)
                            }
                        />
                        N/A
                    </label>
                    <br />
                    <label>PCA: </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"pca-" + index}
                            value="yes"
                            checked={pca === true}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "pca", true)
                            }
                        />
                        Yes
                    </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"pca-" + index}
                            value="no"
                            checked={pca === false}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "pca", false)
                            }
                        />
                        No
                    </label>
                    <label style={{ marginLeft: 6 }}>
                        <Input
                            type="radio"
                            name={"pca-" + index}
                            value="na"
                            checked={pca === null}
                            onChange={(e) =>
                                e.target.checked &&
                                handleBidderChange(index, "pca", null)
                            }
                        />
                        N/A
                    </label>
                    <br />
                    <br />
                    <label>Comments: </label>
                    <Input
                        type="text"
                        value={comments}
                        onChange={(e) =>
                            handleBidderChange(
                                index,
                                "comments",
                                e.target.value,
                            )
                        }
                    />
                    <br />
                    <br />
                </div>
                <div>
                    <Button
                        type="button"
                        kind="danger-secondary"
                        onClick={(e) => removeFunction(index)}
                    >
                        <FontAwesomeIcon icon={faUserMinus} /> Remove this
                        bidder
                    </Button>
                </div>
            </div>
            <hr />
        </>
    )
}

export default function NewTenderForm({
    isOpen,
    setIsOpen,
    addingProduct,
    setIsError,
    setMessage,
    refreshList,
    setRefreshList,
}) {
    let [inputs, setInputs] = useState({
        itemName: addingProduct,
        conversionRates: {},
        bidders: [],
    })
    let [conversionRates, setConversionRates] = useState([])
    let { token } = useAuth()

    useLayoutEffect(() => {
        setInputs((values) => ({
            ...values,
            itemName: addingProduct,
            tenderNumber: "",
            closedOn: "",
            quantity: "",
            conversionRates: {},
            bidders: [],
        }))
    }, [addingProduct, refreshList])

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        let data = inputs
        data.conversionRates = {}
        for (let rate of conversionRates) {
            data.conversionRates[rate.currency] = rate.rate
        }

        if (data.closedOn) data.closedOn = new Date(data.closedOn).toISOString()

        let response = await fetch(`${REACT_APP_API_URL}/api/tenders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(data),
        })
        let result = await response.json()
        // display the result
        setIsError(!response.ok)
        setMessage(response.ok ? result.statusMessage : result.body)
        // clear old values and close the window
        if (response.ok) {
            setRefreshList(!refreshList)
            setInputs({ conversionRates: {}, bidders: [], itemName: "" })
            setConversionRates([])
            setIsOpen(false)
        }
    }

    const handleChanges = (evt) => {
        const name = evt.target.name
        const value = evt.target.value
        setInputs((values) => ({ ...values, [name]: value }))
    }

    const addBidderRow = (evt) => {
        setInputs((values) => ({
            ...values,
            bidders: [
                ...values.bidders,
                {
                    bidder: "",
                    manufacturer: "",
                    currency: "",
                    quotedPrice: 0,
                    packSize: 0,
                    bidBond: null,
                    pr: null,
                    pca: null,
                    comments: "",
                },
            ],
        }))
    }

    const removeBidder = (index) => {
        setInputs((values) => ({
            ...values,
            bidders: values.bidders.filter((_, i) => i !== index),
        }))
    }

    const handleConversionRateChange = (index, field, value) => {
        const newConversionRates = [...conversionRates]
        newConversionRates[index] = {
            ...newConversionRates[index],
            [field]: value,
        }
        setConversionRates(newConversionRates)
    }

    const removeConversionRate = (index) => {
        // https://stackoverflow.com/questions/36326612/how-to-delete-an-item-from-state-array
        // how to remove an element from a state array
        setConversionRates(conversionRates.filter((_, i) => index !== i))
    }

    const addRate = (evt) => {
        evt.preventDefault()
        setConversionRates([...conversionRates, { currency: "", rate: "" }])
    }

    const handleBidderChange = (index, field, value) => {
        let newBidders = [...inputs.bidders]
        newBidders[index][field] = value
        setInputs((values) => ({
            ...values,
            bidders: newBidders,
        }))
    }

    return (
        <OverlayWindow isOpen={isOpen} setIsOpen={setIsOpen}>
            <form onSubmit={handleSubmit} style={{ width: "75vh" }}>
                <h3>New tender</h3>
                <br />
                <fieldset style={{ backgroundColor: "white" }}>
                    <legend>
                        <b>Tender details</b>
                    </legend>
                    <label>Item Name: </label>
                    <Input
                        type="text"
                        name="itemName"
                        value={inputs.itemName}
                        onChange={handleChanges}
                        required
                    />
                    <br />
                    <label>Tender Number: </label>
                    <Input
                        type="text"
                        name="tenderNumber"
                        value={inputs.tenderNumber}
                        onChange={handleChanges}
                        required
                    />
                    <br />
                    <label>Closed On: </label>
                    <Input
                        type="datetime-local"
                        name="closedOn"
                        value={inputs.closedOn}
                        onChange={handleChanges}
                        required
                    />
                    <br />
                    <label>Quantity: </label>
                    <Input
                        type="text"
                        name="quantity"
                        value={inputs.quantity}
                        onChange={handleChanges}
                        required
                    />
                    <hr />
                    <h4>Conversion rates</h4>
                    <p style={{ color: "var(--secondary-text-color)" }}>
                        Please mention conversion rates to LKR
                    </p>
                    {conversionRates.map((rate, index) => (
                        <div key={index}>
                            <Input
                                type="text"
                                placeholder="Currency"
                                value={rate.currency}
                                onChange={(e) =>
                                    handleConversionRateChange(
                                        index,
                                        "currency",
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <span>-</span>
                            <Input
                                type="number"
                                placeholder="Rate"
                                value={rate.rate}
                                onChange={(e) =>
                                    handleConversionRateChange(
                                        index,
                                        "rate",
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <FontAwesomeIcon
                                icon={faXmark}
                                style={{
                                    marginLeft: 5,
                                    cursor: "pointer",
                                    color: "red",
                                }}
                                onClick={() => removeConversionRate(index)}
                            />
                            <br />
                        </div>
                    ))}
                    <Button type="button" kind="primary" onClick={addRate}>
                        Add rate
                    </Button>
                </fieldset>
                <br />
                <fieldset style={{ backgroundColor: "white" }}>
                    <legend>
                        <b>Bidders</b>
                    </legend>
                    {inputs.bidders.length === 0
                        ? "No bidders"
                        : inputs.bidders.map((bidder, index) => (
                              <BidderFields
                                  itemName={bidder.itemName}
                                  bidder={bidder.bidder}
                                  manufacturer={bidder.manufacturer}
                                  quotedPrice={bidder.quotedPrice}
                                  currency={bidder.currency}
                                  packSize={bidder.packSize}
                                  bidBond={bidder.bidBond}
                                  pr={bidder.pr}
                                  pca={bidder.pca}
                                  comments={bidder.comments}
                                  handleBidderChange={handleBidderChange}
                                  removeFunction={removeBidder}
                                  index={index}
                              />
                          ))}
                </fieldset>
                <br />
                <Button kind="primary" type="button" onClick={addBidderRow}>
                    Add bidder
                </Button>
                <Button kind="primary" type="submit">
                    Submit
                </Button>
            </form>
        </OverlayWindow>
    )
}
