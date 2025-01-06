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
                    return (
                        <ProductRow
                            product={p.itemName}
                            bidder={p.bidder || "No listing"}
                            manufacturer={p.manufacturer}
                            currency={p.currency}
                            quotedPrice={p.quotedPrice}
                            onAdd={onAdd}
                            viewingAs={viewingAs}
                        />
                    )
                })}
            </tbody>
        </table>
    )
}
