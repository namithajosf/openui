import { useState, useEffect } from "react"

function App() {
	const [message, setMessage] = useState("")

	useEffect(() => {
		fetch("http://localhost:8000/go-message")
			.then((response) => response.json())
			.then((data) => setMessage(data.message))
	}, [])

	return (
		<div>
			<h1>Message from Go:</h1>
			<p>{message}</p>
		</div>
	)
}

export default App
