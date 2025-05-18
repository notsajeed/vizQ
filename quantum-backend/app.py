from flask import Flask, request, jsonify
from flask_cors import CORS
from quantum_core import simulate_circuit  # your core simulation logic

app = Flask(__name__)
CORS(app)

@app.route("/simulate", methods=["POST"])
def simulate():
    data = request.get_json()

    n_qubits = data.get("n_qubits", 1)
    gates = data.get("gates", [])

    # Basic validation
    if not isinstance(n_qubits, int) or n_qubits < 1:
        return jsonify({"error": "Invalid number of qubits"}), 400

    # Optional: further validation of gates structure could be added here

    result = simulate_circuit(n_qubits, gates)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

