import Button from "../components/Button"
import SearchBar from "../components/SearchBar"

export default function Components() {
	return (
		<>
			<h1>Components</h1>
			<Button isPrimary={true}>Primary Button</Button>
			<Button isPrimary={false}>Secondary Button</Button>
			<br />
			<br />
			<SearchBar placeholder="Search here..." />
			<br />
			<br />
			<br />
			<h1>Heading 1</h1>
			<h2>Heading 2</h2>
			<h3>Heading 3</h3>
			<br />
			<p>Primary text</p>
			<p className="secondary-text">Secondary text</p>
		</>
	)
}
