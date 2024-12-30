import "./Button.css";

export default function Button({ isPrimary, children }) {
	return (
		<button className={isPrimary ? "primary" : "secondary"}>
			{children}
		</button>
	);
}
