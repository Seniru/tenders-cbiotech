import ProductRow from "./ProductRow"
import "./List.css"
import ProductListSkeleton from "./ProductListSkeleton"
import { useMemo, useState } from "react"

export default function ProductList({
  products,
  onAdd,
  viewingAs,
  isLoading,
  options,
}) {
  const [sortBy, setSortBy] = useState(null)
  const [sortAscending, setSortAscending] = useState(true)
  const sortedProducts = useMemo(() => {
    if (!sortBy) return products
    return [...(products || [])].sort((p1, p2) => {
      const sortField1 = p1[sortBy],
        sortField2 = p2[sortBy]
      if (!sortField1 || !sortField2) return 0
      if (typeof sortField1 === "string")
        return sortField1.localeCompare(sortField2) * (sortAscending ? 1 : -1)
      return (sortField1 - sortField2) * (sortAscending ? 1 : -1)
    })
  }, [products, sortBy, sortAscending])

  const updateSortingMethod = (field) => {
    if (field == sortBy) return setSortAscending((prev) => !prev)
    setSortBy(field)
    setSortAscending(true)
  }

  return (
    <>
      <table className="product-list">
        <thead>
          <tr>
            <th>
              <div className="product-list-sortable-heading">
                PRODUCT
                <div
                  className="product-list-sorting"
                  onClick={() => updateSortingMethod("itemName")}
                >
                  <div
                    style={{
                      color:
                        sortBy === "itemName" && sortAscending
                          ? "#000"
                          : "#999",
                    }}
                  >
                    ▲
                  </div>
                  <div
                    style={{
                      color:
                        sortBy === "itemName" && !sortAscending
                          ? "#000"
                          : "#999",
                    }}
                  >
                    ▼
                  </div>
                </div>
              </div>
            </th>
            <th>
              <div className="product-list-sortable-heading">
                BIDDER
                <div
                  className="product-list-sorting"
                  onClick={() => updateSortingMethod("bidder")}
                >
                  <div
                    style={{
                      color:
                        sortBy === "bidder" && sortAscending ? "#000" : "#999",
                    }}
                  >
                    ▲
                  </div>
                  <div
                    style={{
                      color:
                        sortBy === "bidder" && !sortAscending ? "#000" : "#999",
                    }}
                  >
                    ▼
                  </div>
                </div>
              </div>
            </th>
            <th>
              <div className="product-list-sortable-heading">
                MANUFACTURERS
                <div
                  className="product-list-sorting"
                  onClick={() => updateSortingMethod("manufacturer")}
                >
                  <div
                    style={{
                      color:
                        sortBy === "manufacturer" && sortAscending
                          ? "#000"
                          : "#999",
                    }}
                  >
                    ▲
                  </div>
                  <div
                    style={{
                      color:
                        sortBy === "manufacturer" && !sortAscending
                          ? "#000"
                          : "#999",
                    }}
                  >
                    ▼
                  </div>
                </div>
              </div>
            </th>
            <th>CURRENCY</th>
            <th>
              <div className="product-list-sortable-heading">
                QUOTED PRICE
                <div
                  className="product-list-sorting"
                  onClick={() => updateSortingMethod("quotedPrice")}
                >
                  <div
                    style={{
                      color:
                        sortBy === "quotedPrice" && sortAscending
                          ? "#000"
                          : "#999",
                    }}
                  >
                    ▲
                  </div>
                  <div
                    style={{
                      color:
                        sortBy === "quotedPrice" && !sortAscending
                          ? "#000"
                          : "#999",
                    }}
                  >
                    ▼
                  </div>
                </div>
              </div>
            </th>
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
            sortedProducts.map((p) => {
              return (
                <ProductRow
                  product={p.itemName}
                  bidder={p.bidder || `No listing (${p.quantity})`}
                  manufacturer={p.manufacturer}
                  currency={p.currency}
                  quotedPrice={
                    p.quotedPrice && `${p.quotedPrice} (${p.quantity})`
                  }
                  onAdd={onAdd}
                  viewingAs={viewingAs}
                  options={options}
                />
              )
            })}
        </tbody>
      </table>
      <ProductListSkeleton rows={10} isLoading={isLoading} />
    </>
  )
}
