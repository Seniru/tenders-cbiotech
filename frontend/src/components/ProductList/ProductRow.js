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
			<td>{product}</td>
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
