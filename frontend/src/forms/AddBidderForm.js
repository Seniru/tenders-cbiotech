import { useState } from "react"

import { useAuth } from "../contexts/AuthProvider"
import Input from "../components/Input"
import Button from "../components/Button"
import OverlayWindow from "../components/OverlayWindow"

const { REACT_APP_API_URL } = process.env

export default function AddBidderForm({
    tenderNumber,
    isOpen,
    setIsOpen,
    setIsError,
    setMessage,
    refreshList,
    setRefreshList,
}) {
    let [values, setValues] = useState({ tenderNumber })
    let { token } = useAuth()

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        let response = await fetch(
            `${REACT_APP_API_URL}/api/tenders/${encodeURIComponent(tenderNumber)}/bidders`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(values),
            },
        )
        let result = await response.json()
        setIsError(!response.ok)
        setMessage(response.ok ? "Created" : result.body || response.statusText)
        setIsOpen(!response.ok)
        if (response.ok) {
            setValues({})
            setRefreshList(!refreshList)
        }
    }

    const handleChanges = (evt) => {
        setValues({
            ...values,
            [evt.target.name]: evt.target.value,
        })
    }

    return (
        <OverlayWindow isOpen={isOpen} setIsOpen={setIsOpen}>
            <h3>Add bidder</h3>
            <br />
            <form onSubmit={handleSubmit}>
                <label>Tender Number </label>
                <Input
                    type="text"
                    name="tenderNumber"
                    value={values.tenderNumber}
                    onChange={handleChanges}
                    required
                />
                <br />
                <br />
                <label>Bidder </label>
                <Input
                    type="text"
                    name="bidder"
                    value={values.bidder}
                    onChange={handleChanges}
                    required
                />
                <br />
                <label>Manufacturer </label>
                <Input
                    type="text"
                    name="manufacturer"
                    value={values.manufacturer}
                    onChange={handleChanges}
                    required
                />
                <br />
                <label>Currency </label>
                <Input
                    type="text"
                    name="currency"
                    value={values.currency}
                    onChange={handleChanges}
                    required
                />
                <br />
                <label>Quoted Price </label>
                <Input
                    type="number"
                    name="quotedPrice"
                    value={values.quotedPrice}
                    onChange={handleChanges}
                    required
                />
                <br />
                <label>Pack Size: </label>
                <Input
                    type="number"
                    name="packSize"
                    value={values.packSize}
                    onChange={handleChanges}
                    required
                />
                <br />
                <br />
                <label>Bid Bond: </label>
                <Input
                    type="checkbox"
                    name="bidBond"
                    value={values.bidBond}
                    onChange={(e) =>
                        setValues({ ...values, bidBond: e.target.checked })
                    }
                />
                <br />
                <label>PR: </label>
                <Input
                    type="checkbox"
                    name="pr"
                    value={values.pr}
                    onChange={(e) =>
                        setValues({ ...values, pr: e.target.checked })
                    }
                />
                <br />
                <label>PCA: </label>
                <label style={{ marginLeft: 6 }}>
                    <Input
                        type="radio"
                        name={"pca"}
                        value="yes"
                        onChange={(e) => setValues({ ...values, pca: true })}
                    />
                    Yes
                </label>
                <label style={{ marginLeft: 6 }}>
                    <Input
                        type="radio"
                        name={"pca"}
                        value="no"
                        onChange={(e) => setValues({ ...values, pca: false })}
                    />
                    No
                </label>
                <label style={{ marginLeft: 6 }}>
                    <Input
                        type="radio"
                        name={"pca"}
                        value="na"
                        onChange={(e) => setValues({ ...values, pca: null })}
                    />
                    N/A
                </label>
                <br />
                <br />
                <label>Comments: </label>
                <Input
                    name="comments"
                    type="text"
                    value={values.comments}
                    onChange={handleChanges}
                />
                <br />
                <br />

                <Button kind="primary">Submit</Button>
            </form>
        </OverlayWindow>
    )
}
