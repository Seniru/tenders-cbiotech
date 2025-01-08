export default function ProductListSkeleton({ rows, isLoading }) {
    return (
        isLoading && (
            <div className="product-list-skeleton">
                {new Array(rows).fill(<div></div>)}
            </div>
        )
    )
}
