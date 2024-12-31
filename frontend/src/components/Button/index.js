import "./Button.css"

export default function Button({ isPrimary, onClick, children }) {
	return (
		<button
			className={isPrimary ? "primary" : "secondary"}
			onClick={onClick}
		>
			{children}
		</button>
	)
}
