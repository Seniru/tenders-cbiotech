export default function Header() {
	return (
		<header
			style={{
				display: "flex",
				backgroundColor: "var(--secondary-color)",
				height: 70,
				alignItems: "center",
			}}
		>
			<img src="favicon.png" alt="logo" />
		</header>
	);
}
