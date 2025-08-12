from flask import Flask, request, jsonify
from algorithms import fifo, lifo, optimal, ai_predictor
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS so React frontend can access this API

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.get_json()
    reference = data.get('reference', [])
    frames = data.get('frames', 3)
    algo = data.get('algorithm', 'FIFO')

    # Validate input
    if not reference or not isinstance(reference, list):
        return jsonify({'error': 'Invalid reference string'}), 400

    try:
        frames = int(frames)

        if algo == "FIFO":
            summary = fifo.simulate(reference, frames)
        elif algo == "LIFO":
            summary = lifo.simulate(reference, frames)
        elif algo == "Optimal":
            summary = optimal.simulate(reference, frames)
        elif algo == "AI-Based":
            summary = ai_predictor.simulate(reference, frames)
        else:
            return jsonify({'error': 'Unknown algorithm'}), 400

        # Return full summary dict as JSON
        return jsonify(summary)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
