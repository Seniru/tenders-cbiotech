import Input from "../components/Input"
import Button from "../components/Button"
import OverlayWindow from "../components/OverlayWindow"

export default function AddBidderForm({ tenderNumber, isOpen, setIsOpen }) {
    const handleSubmit = async (evt) => {
        evt.preventDefault()
    }

    return (
        <OverlayWindow isOpen={isOpen} setIsOpen={setIsOpen}>
            <h3>Add bidder</h3>
            <br />
            <form onSubmit={handleSubmit}>
                <label>Tender Number </label>
                <Input type="text" value={tenderNumber} />
                <br />
                <br />
                <label>Bidder </label>
                <Input type="text" required />
                <br />
                <label>Manufacturer </label>
                <Input type="text" required />
                <br />
                <label>Currency </label>
                <Input type="text" required />
                <br />
                <label>Quoted Price </label>
                <Input type="number" required />
                <br />
                <label>Pack Size: </label>
                <Input type="number" required />
                <br />
                <br />
                <label>Bid Bond: </label>
                <Input type="checkbox" />
                <br />
                <label>PR: </label>
                <Input type="checkbox" />
                <br />
                <label>PCA: </label>
                <label style={{ marginLeft: 6 }}>
                    <Input type="radio" name={"pca"} value="yes" />
                    Yes
                </label>
                <label style={{ marginLeft: 6 }}>
                    <Input type="radio" name={"pca"} value="no" />
                    No
                </label>
                <label style={{ marginLeft: 6 }}>
                    <Input type="radio" name={"pca"} value="na" />
                    N/A
                </label>
                <br />
                <br />
                <Button kind="primary">Submit</Button>
            </form>
        </OverlayWindow>
    )
}
