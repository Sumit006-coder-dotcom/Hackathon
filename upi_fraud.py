from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)  # Fixed __name__
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Example dummy logic
    if float(data['amount']) > 10000:
        prediction = 'Fraud'
    else:
        prediction = 'Not Fraud'

    return jsonify({'prediction': prediction})

if __name__ == '__main__':  # Fixed __name__ and __main__
    app.run(debug=True)
