import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"

import Button from "../components/Button"
import ProductList from "../components/ProductList"
import SearchBar from "../components/SearchBar"
import DateInput from "../components/DateInput"

export default function Index() {
    let [tendersOnDate, setTendersOnDate] = useState(null)

    const handleSearchByDate = () => {
        if (tendersOnDate) window.open(`/tenders/${tendersOnDate}`, "_blank")
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <h1>Index</h1>
                <div>
                    <DateInput
                        onChange={(e) => setTendersOnDate(e.target.value)}
                    />
                    <Button isPrimary={true} onClick={handleSearchByDate}>
                        <FontAwesomeIcon icon={faCalendar} />
                        <span style={{ marginLeft: 5 }}>Search by date</span>
                    </Button>
                </div>
            </div>

            <div>
                <SearchBar
                    placeholder="Search products..."
                    style={{ width: "60%", marginRight: 6 }}
                />
                <Button isPrimary={true}>Go</Button>
            </div>
            <div className="secondary-text">Showing 800 products...</div>

            <div className="container" style={{ marginTop: 10 }}>
                <ProductList
                    products={[
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                        {
                            product: "Product 1",
                            bidder: "Bidder 1",
                            manufacturer: "Manufacturer 1",
                            currency: "USD",
                            quotedPrice: 1.0,
                        },
                    ]}
                />
            </div>
        </>
    )
}
