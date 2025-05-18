import io
import base64
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

def simulate_circuit(n_qubits, gates):
    qc = QuantumCircuit(n_qubits)

    # Expect gates as dicts with gate name and target qubit index, e.g.:
    # gates = [{"gate": "h", "qubit": 0}, {"gate": "cx", "control": 0, "target": 1}]
    
    for g in gates:
        gate_name = g.get("gate")
        if gate_name in {"h", "x", "y", "z", "rx", "rz"}:
            qubit = g.get("qubits", 0)
            if gate_name == "h":
                qc.h(qubit)
            elif gate_name == "x":
                qc.x(qubit)
            elif gate_name == "y":
                qc.y(qubit)
            elif gate_name == "z":
                qc.z(qubit)
            elif gate_name == "rx":
                qc.rx(np.pi / 2, qubit)
            elif gate_name == "rz":
                qc.rz(np.pi / 2, qubit)

        elif gate_name == "cx":  # Controlled-X
            qubits = g.get("qubits", [])
            if len(qubits) != 2:
                raise ValueError("CX gate requires exactly 2 qubit indices.")
            control, target = qubits
            qc.cx(control, target)

        elif gate_name == "cz":  # Controlled-Z
            qubits = g.get("qubits", [])
            if len(qubits) != 2:
                raise ValueError("CZ gate requires exactly 2 qubit indices.")
            control, target = qubits
            qc.cz(control, target)

        # Add more gates as needed

    # Get statevector
    state = Statevector.from_instruction(qc)
    statevector = [{"real": val.real, "imag": val.imag} for val in state.data]

    # Draw circuit as matplotlib figure
    fig = qc.draw(output="mpl")
    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    fig.clf()

    return {
        "gates_applied": gates,
        "statevector": statevector,
        "circuit_image": img_base64
    }
