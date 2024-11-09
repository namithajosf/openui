from flask import Flask, request, render_template
import pickle

app = Flask(__name__)

# Load the trained model
model = pickle.load(open('model.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get data from the form
    data = request.form.to_dict()
    # Convert data to the format your model expects
    prediction = model.predict([list(data.values())])
    return render_template('result.html', prediction=prediction)

if __name__ == '__main__':
    app.run(debug=True)