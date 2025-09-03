from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from quantum_core import simulate_circuit
import os

# Flask points to dist folder
app = Flask(__name__, static_folder="../dist", static_url_path="/")
CORS(app)

@app.route("/simulate", methods=["POST"])
def simulate():
    data = request.get_json()
    n_qubits = data.get("n_qubits", 1)
    gates = data.get("gates", [])

    if not isinstance(n_qubits, int) or n_qubits < 1:
        return jsonify({"error": "Invalid number of qubits"}), 400

    result = simulate_circuit(n_qubits, gates)
    return jsonify(result)

# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
