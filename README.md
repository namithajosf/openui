# OpenUI: Automated UI-to-Code Conversion

OpenUI is an innovative project that automates the conversion of visual UI designs into functional code. By leveraging advanced image processing and machine learning techniques, OpenUI can effectively detect and classify UI components, analyze layouts, and generate corresponding code in Kotlin. This solution streamlines front-end development, enhances productivity, and ensures greater consistency between design and implementation.

**Disclaimer:** This project is still a work in progress. Some features may not be fully functional, and there may be bugs or incomplete implementations. Contributions and feedback are welcome!

## Key Features

-   **Automated UI Component Detection:** Detects and classifies UI elements from visual designs using deep learning models.
-   **Kotlin Code Generation:** Converts detected UI components into functional Kotlin code for Android app development.
-   **Increased Efficiency:** Reduces manual coding effort and minimizes design-to-code discrepancies.
-   **Machine Learning Integration:** Uses CNNs for component detection and layout analysis.

## Installation

### Requirements

-   Python 3.x
-   TensorFlow 2.x
-   OpenCV
-   Flask
-   Other required dependencies (listed below)

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/openui.git
    cd openui
    ```

2. Create a virtual environment and activate it:

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use venv\Scripts\activate
    ```

3. Install required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Ensure that your TensorFlow model (`cnn_model.pkl`) and label encoder (`label_encoder.pkl`) are available in the `models` directory.

5. Run the application:

    ```bash
    python app.py
    ```

6. Navigate to `http://127.0.0.1:5000` in your browser to access the OpenUI app.

## Usage

1. Upload a UI image (e.g., a screenshot of an app design) via the provided upload form.
2. The system will process the image, detect UI components, and generate corresponding Kotlin code.
3. The processed image will be displayed, with bounding boxes around detected UI components.
4. Download the generated Kotlin code for use in your Android app development.

## Project Structure

```
openui/
├── app.py                  # Flask app and route definitions
├── models/                 # Contains trained machine learning models
│   ├── cnn_model.pkl       # Trained CNN model for UI component classification
│   └── label_encoder.pkl  # Label encoder for UI components
├── uploads/                # Directory for uploaded files
├── requirements.txt        # List of dependencies
├── README.md               # Project documentation
└── templates/              # HTML templates for the front-end
```

## Dependencies

This project relies on the following Python libraries:

-   Flask
-   TensorFlow
-   OpenCV
-   scikit-learn
-   numpy
-   werkzeug

Install these dependencies using:

```bash
pip install -r requirements.txt
```

## Acknowledgments

-   [TensorFlow](https://www.tensorflow.org/) for machine learning and model deployment.
-   [OpenCV](https://opencv.org/) for image processing.
-   [Flask](https://flask.palletsprojects.com/) for web application framework.
