import "./Button.css"

export default function Button({ isPrimary, onClick, children, ...props }) {
    return (
        <button
            className={isPrimary ? "primary" : "secondary"}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}
