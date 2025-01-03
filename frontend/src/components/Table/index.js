import "./Table.css"

export default function Table({
    headers,
    rows,
    renderRowWith: RenderRowWith,
    emptyTableText,
}) {
    return (
        <table className="custom-table">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.length > 0 ? (
                    rows.map((row, index) => (
                        <RenderRowWith row={row} index={index} />
                    ))
                ) : (
                    <tr>
                        <td colSpan={headers.length}>
                            {emptyTableText || "No data available"}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
