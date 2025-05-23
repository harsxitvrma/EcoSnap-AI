from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow frontend to call this API

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Make sure the folder exists

@app.route('/')
def home():
    return 'Flask backend is working!'

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file.save(os.path.join(UPLOAD_FOLDER, file.filename))
    return jsonify({'message': 'File uploaded successfully'}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Use the port Render provides
    app.run(host='0.0.0.0', port=port, debug=True)  # Correct host and port

