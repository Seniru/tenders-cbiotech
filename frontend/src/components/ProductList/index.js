import ProductRow from "./ProductRow"
import "./List.css"
import ProductListSkeleton from "./ProductListSkeleton"

export default function ProductList({ products, onAdd, viewingAs, isLoading }) {
    return (
        <>
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
                    {!isLoading &&
                        products.map((p) => {
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
            <ProductListSkeleton rows={10} isLoading={isLoading} />
        </>
    )
}
