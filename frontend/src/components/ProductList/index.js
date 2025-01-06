import ProductRow from "./ProductRow"
import "./List.css"

export default function ProductList({ products, onAdd, viewingAs }) {
    return (
        <table className="product-list">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Bidder</th>
                    <th>Manufacturer</th>
                    <th>Currency</th>
                    <th>Quoted Price</th>
                    <th></th>
                </tr>
                <tr>
                    <td>
                        <br />
                    </td>
                </tr>
            </thead>
            <tbody>
                {products.map((p) => {
                    let bidder = p.bidders[0]
                    return (
                        <ProductRow
                            product={p.itemName}
                            bidder={bidder?.bidder || "No listing"}
                            manufacturer={bidder?.manufacturer}
                            currency={bidder?.currency}
                            quotedPrice={bidder?.quotedPrice}
                            onAdd={onAdd}
                            viewingAs={viewingAs}
                        />
                    )
                })}
            </tbody>
        </table>
    )
}
