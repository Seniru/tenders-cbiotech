import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faPills } from "@fortawesome/free-solid-svg-icons"

import "./TenderInfo.css"
import TenderTable from "./TenderTable"

function RateComponent({ currency, rate }) {
    return (
        <div>
            <span className="secondary-text">{currency.toUpperCase()}: </span>
            <span>{rate}</span>
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

export default function TenderInfo({ details }) {
    return (
        <div className="container tender-info-container">
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
                    <h4 style={{ marginTop: 0 }}>Conversion rates</h4>
                    {Object.entries(details.conversionRates).map((rates) => (
                        <RateComponent currency={rates[0]} rate={rates[1]} />
                    ))}
                </div>
            </div>
            <TenderTable tenders={details.tenders} />
        </div>
    )
}
