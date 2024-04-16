from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from model.model import predict_heatmap

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Set the upload folder for Flask app
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Route to handle image uploads
@app.route('/upload/', methods=['POST'])
def upload_image():
    if 'picture' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['picture']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Generate a unique filename
    filename = 'TEST.jpg'

    # Save the file to the upload folder with the fixed name "TEST.jpg"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    # Return the URL of the uploaded file
    return jsonify('ก็มาดิค้าบ')

@app.route('/result/', methods=['GET'])
def call_model():
    result = predict_heatmap('uploads/TEST.jpg')
    return jsonify({"result" : result})


if __name__ == '__main__':
    app.run(debug=True)