// DOM Elements
const selectImageBtn = document.getElementById("selectImageBtn")
const imageInput = document.getElementById("imageInput")
const uploadImageBtn = document.getElementById("uploadImageBtn")
const imagePreview = document.getElementById("imagePreview")
const imageResult = document.getElementById("imageResult")
const componentsDisplay = document.getElementById("componentsDisplay")
const generatedCodeDisplay = document.getElementById("generatedCodeDisplay")
const copyCodeBtn = document.getElementById("copyCodeBtn")
const form = document.getElementById("uploadForm")
const progressBar = document.querySelector(".progress-bar")
const imageProgress = document.getElementById("imageProgress")

// Handle image selection
imageInput.addEventListener("change", function (event) {
	const file = event.target.files[0]
	if (file) {
		const reader = new FileReader()
		reader.onload = function (e) {
			// Display image preview
			const img = document.createElement("img")
			img.src = e.target.result
			imagePreview.innerHTML = ""
			imagePreview.appendChild(img)

			// Enable upload button
			uploadImageBtn.disabled = false
		}
		reader.readAsDataURL(file)
	}
})

// Handle form submission
form.addEventListener("submit", function (event) {
	event.preventDefault()

	const formData = new FormData(form)

	// Reset displays
	imageResult.innerHTML = ""
	componentsDisplay.textContent = ""
	generatedCodeDisplay.textContent = ""
	copyCodeBtn.style.display = "none"

	// Show progress bar
	imageProgress.style.display = "block"

	// Send image to backend via fetch API
	fetch("/upload", {
		method: "POST",
		body: formData,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok")
			}
			return response.json()
		})
		.then((data) => {
			// Hide progress bar
			imageProgress.style.display = "none"

			if (data.error) {
				imageResult.innerHTML = `<p class="error">Error: ${data.error}</p>`
				return
			}

			// Display components data
			componentsDisplay.textContent = JSON.stringify(
				data.components,
				null,
				2
			)

			// Display generated code
			generatedCodeDisplay.textContent = data.kotlin_code
			copyCodeBtn.style.display = "block"

			// Show success message
			imageResult.innerHTML = `<p class="success">Code generated successfully!</p>`
		})
		.catch((error) => {
			console.error("Error:", error)
			imageProgress.style.display = "none"
			imageResult.innerHTML = `<p class="error">Error processing the image: ${error.message}</p>`
		})
})

// Handle copy code button
copyCodeBtn.addEventListener("click", function () {
	const code = generatedCodeDisplay.textContent
	navigator.clipboard
		.writeText(code)
		.then(() => {
			const originalText = this.textContent
			this.textContent = "Copied!"
			setTimeout(() => {
				this.textContent = originalText
			}, 2000)
		})
		.catch((err) => {
			console.error("Failed to copy code:", err)
			imageResult.innerHTML = `<p class="error">Failed to copy the code: ${err.message}</p>`
		})
})

// Enable or disable upload button based on file selection
imageInput.addEventListener("change", function () {
	uploadImageBtn.disabled = !imageInput.files.length
})

// Ensure progress bar resets on a new upload
uploadImageBtn.addEventListener("click", () => {
	imageProgress.style.display = "none"
	imageResult.innerHTML = ""
})
