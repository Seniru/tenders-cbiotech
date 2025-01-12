import { useState, useLayoutEffect } from "react"

import { useAuth } from "../contexts/AuthProvider"
import Input from "../components/Input"
import Button from "../components/Button"
import OverlayWindow from "../components/OverlayWindow"

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
    index,
    handleBidderChange,
}) {
    return (
        <>
            <br />
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
                    handleBidderChange(index, "manufacturer", e.target.value)
                }
            />
            <br />
            <label>Currency </label>
            <Input
                type="text"
                value={currency}
                required
                onChange={(e) =>
                    handleBidderChange(index, "currency", e.target.value)
                }
            />
            <br />
            <label>Quoted Price </label>
            <Input
                type="number"
                value={quotedPrice}
                required
                onChange={(e) =>
                    handleBidderChange(index, "quotedPrice", e.target.value)
                }
            />
            <br />
            <label>Pack Size: </label>
            <Input
                type="number"
                value={packSize}
                required
                onChange={(e) =>
                    handleBidderChange(index, "packSize", e.target.value)
                }
            />
            <br />
            <br />
            <label>Bid Bond: </label>
            <Input
                type="checkbox"
                value={bidBond}
                onChange={(e) =>
                    handleBidderChange(index, "bidBond", e.target.checked)
                }
            />
            <br />
            <label>PR: </label>
            <Input
                type="checkbox"
                value={pr}
                onChange={(e) =>
                    handleBidderChange(index, "pr", e.target.checked)
                }
            />
            <br />
            <label>PCA: </label>
            <label style={{ marginLeft: 6 }}>
                <Input
                    type="radio"
                    name={"pca-" + index}
                    value="yes"
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
                    defaultChecked={true}
                    onChange={(e) =>
                        e.target.checked &&
                        handleBidderChange(index, "pca", null)
                    }
                />
                N/A
            </label>
            <br />
            <br />
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
            conversionRates: {},
            bidders: [],
        }))
    }, [addingProduct])

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        let data = inputs
        data.conversionRates = {}
        for (let rate of conversionRates) {
            data.conversionRates[rate.currency] = rate.rate
        }

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
        setRefreshList(!refreshList)
        // clear old values and close the window
        setInputs({ conversionRates: {}, bidders: [], itemName: "" })
        setConversionRates([])
        setIsOpen(false)
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
                    bidBond: false,
                    pr: false,
                    pca: false,
                },
            ],
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
            <form onSubmit={handleSubmit}>
                <h3>New tender</h3>
                <br />
                <fieldset>
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
                        type="date"
                        name="closedOn"
                        value={inputs.closedOn}
                        onChange={handleChanges}
                        required
                    />
                    <br />
                    <label>Quantity: </label>
                    <Input
                        type="number"
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
                            <br />
                        </div>
                    ))}
                    <Button type="button" kind="primary" onClick={addRate}>
                        Add rate
                    </Button>
                </fieldset>
                <br />
                <fieldset>
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
                                  handleBidderChange={handleBidderChange}
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
