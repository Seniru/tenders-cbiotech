import { Link } from "react-router-dom"

import Button from "../Button"

const formatNumber = (n, min, max) =>
    n &&
    n.toLocaleString("en-US", {
        maximumFractionDigits: max,
        minimumFractionDigits: min,
    })

export default function ProductRow({
    product,
    bidder,
    manufacturer,
    currency,
    quotedPrice,
    onAdd,
    viewingAs,
    options,
}) {
    return (
        <tr className="product-row">
            <td>
                <Link
                    to={`/product/${encodeURIComponent(product)}?${options}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {product}
                </Link>
            </td>
            <td>{bidder}</td>
            <td>{manufacturer}</td>
            <td>{currency?.toUpperCase()}</td>
            <td>{formatNumber(quotedPrice, 2, 4)}</td>
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
