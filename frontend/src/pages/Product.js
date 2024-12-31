import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"

import Button from "../components/Button"
import TenderInfo from "../components/TenderInfo"

export default function Product() {
    const { productName } = useParams()

    let tenderDetails = [
        {
            closedOn: "11/11/2011",
            itemName: productName,
            tenderNumber: "ABC/11/22/33",
            quantity: 100,
            conversionRates: {
                usd: 1.0,
                eur: 1.0,
            },
            tenders: [
                {
                    bidder: "Bidder 1",
                    manufacturer: "Manufacturer",
                    currency: "USD",
                    quotedPrice: 99.99,
                    packSize: 5,
                    quotedPriceLKR: 99.99,
                    quotedUnitPriceLKR: 9.99,
                    bindBond: true,
                    pr: true,
                    pca: false,
                },
                {
                    bidder: "Bidder 1",
                    manufacturer: "Manufacturer",
                    currency: "USD",
                    quotedPrice: 99.99,
                    packSize: 5,
                    quotedPriceLKR: 99.99,
                    quotedUnitPriceLKR: 9.99,
                    bindBond: true,
                    pr: true,
                    pca: false,
                },
                {
                    bidder: "Bidder 1",
                    manufacturer: "Manufacturer",
                    currency: "USD",
                    quotedPrice: 99.99,
                    packSize: 5,
                    quotedPriceLKR: 99.99,
                    quotedUnitPriceLKR: 9.99,
                    bindBond: true,
                    pr: true,
                    pca: false,
                },
            ],
        },
    ]

    tenderDetails = [...tenderDetails, ...tenderDetails, ...tenderDetails]

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                }}
            >
                <h1>{productName}</h1>
                <Button isPrimary={true}>
                    <FontAwesomeIcon icon={faPrint} />
                    <span style={{ marginLeft: 5 }}>Print</span>
                </Button>
            </div>

            <div>
                {tenderDetails.map((detail) => (
                    <TenderInfo details={detail} />
                ))}
            </div>
        </>
    )
}
