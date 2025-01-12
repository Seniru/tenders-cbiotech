import { Link } from "react-router-dom"

import Button from "../Button"

const formatNumber = (n) =>
    n && n.toFixed(5).replace(/(?<=\.\d\d0*[1-9]*)0+$/, "")

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
            <td>{currency?.toUpperCase()}</td>
            <td>{formatNumber(quotedPrice)}</td>
            <td>
                {viewingAs === "viewer" ? (
                    <>
                        <br />
                        <br />
                    </>
                ) : (
                    <Button kind="primary" onClick={() => onAdd(product)}>
                        + Add
                    </Button>
                )}
            </td>
        </tr>
    )
}
