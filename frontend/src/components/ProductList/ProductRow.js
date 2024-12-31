import { Link } from "react-router-dom"

import Button from "../Button"

export default function ProductRow({
	product,
	bidder,
	manufacturer,
	currency,
	quotedPrice,
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
				<Button isPrimary={true}>+ Add</Button>
			</td>
		</tr>
	)
}
