import { Link } from "react-router-dom"

import Button from "../Button"

export default function ProductRow({
    product,
    bidder,
    manufacturer,
    currency,
    quotedPrice,
    onAdd,
    viewingAs,
}) {
    return (
        <tr className="product-row">
            <td>
                <Link
                    to={`/product/${product}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {product}
                </Link>
            </td>
            <td>{bidder}</td>
            <td>{manufacturer}</td>
            <td>{currency}</td>
            <td>{quotedPrice}</td>
            <td>
                {viewingAs === "viewer" ? (
                    <>
                        <br />
                        <br />
                    </>
                ) : (
                    <Button isPrimary={true} onClick={() => onAdd(product)}>
                        + Add
                    </Button>
                )}
            </td>
        </tr>
    )
}
