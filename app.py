from flask import Flask, request, jsonify, render_template
import os
import cv2
import numpy as np
import pickle
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load the trained model and label encoder
def load_model():
    try:
        with open('models/cnn_model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('models/label_encoder.pkl', 'rb') as f:
            label_encoder = pickle.load(f)
        return model, label_encoder
    except FileNotFoundError:
        print("Model or encoder files not found!")
        return None, None

# Initialize model and encoder
model, label_encoder = load_model()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_ui_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        return None, None, None, None

    blurred_image = cv2.GaussianBlur(image, (5, 5), 0)
    gray_image = cv2.cvtColor(blurred_image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray_image, threshold1=30, threshold2=100)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    final_image = image.copy()
    detected_components = []

    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 100:
            x, y, w, h = cv2.boundingRect(contour)
            detected_components.append((x, y, w, h))
            cv2.rectangle(final_image, (x, y), (x + w, y + h), (0, 255, 0), 2)
    
    return final_image, gray_image, edges, detected_components

def classify_ui_components(image_path, model, encoder):
    processed_image, _, _, detected_components = process_ui_image(image_path)
    
    if processed_image is None:
        return None, None, None

    component_images = []
    for (x, y, w, h) in detected_components:
        component_img = processed_image[y:y+h, x:x+w]
        component_img_resized = cv2.resize(component_img, (32, 32))
        component_images.append(component_img_resized)

    if not component_images:
        return [], detected_components, processed_image

    component_images_array = np.array(component_images, dtype=np.float32) / 255.0
    predictions = model.predict(component_images_array)
    predicted_labels = encoder.inverse_transform(np.argmax(predictions, axis=1))

    return predicted_labels, detected_components, processed_image

def generate_kotlin_code(components_data):
    kotlin_code = """
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.*
import android.view.ViewGroup.LayoutParams
import android.view.ViewGroup

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val rootLayout = ConstraintLayout(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }
"""
    
    for idx, component in enumerate(components_data):
        label = component['label']
        box = component['bounding_box']
        component_id = f"component{idx}"
        
        kotlin_code += f"""
        val {component_id} = {label}(this).apply {{
            id = View.generateViewId()
            layoutParams = ConstraintLayout.LayoutParams(
                {box['width']}, {box['height']}
            ).apply {{
                leftMargin = {box['x']}
                topMargin = {box['y']}
            }}
            
            when (this) {{
                is ImageView -> {{
                    scaleType = ImageView.ScaleType.FIT_CENTER
                    setBackgroundColor(Color.LTGRAY)
                }}
                is TextView -> {{
                    text = "Sample Text"
                }}
                is Button -> {{
                    text = "Click Me"
                }}
                is EditText -> {{
                    hint = "Enter text"
                }}
            }}
        }}
        rootLayout.addView({component_id})
"""

    kotlin_code += """
        setContentView(rootLayout)
    }
}
"""
    return kotlin_code

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Process the image and generate code
            predicted_labels, detected_components, processed_image = classify_ui_components(filepath, model, label_encoder)
            
            if processed_image is None:
                return jsonify({'error': 'Failed to process image'}), 400
            
            # Save the processed image with bounding boxes
            output_image_path = os.path.join(app.config['UPLOAD_FOLDER'], f'processed_{filename}')
            cv2.imwrite(output_image_path, processed_image)

            # Create components data for code generation
            components_data = []
            for label, (x, y, w, h) in zip(predicted_labels, detected_components):
                component = {
                    "label": str(label),
                    "bounding_box": {
                        "x": int(x),
                        "y": int(y),
                        "width": int(w),
                        "height": int(h)
                    }
                }
                components_data.append(component)
            
            # Generate Kotlin code
            kotlin_code = generate_kotlin_code(components_data)
            
            # Clean up uploaded file
            os.remove(filepath)
            
            # Send the path of the processed image so it can be displayed in the front-end
            processed_image_url = f'/uploads/{os.path.basename(output_image_path)}'
            
            return jsonify({
                'success': True,
                'components': components_data,
                'kotlin_code': kotlin_code,
                'processed_image_url': processed_image_url
            })
            
        except Exception as e:
            # Clean up uploaded file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
