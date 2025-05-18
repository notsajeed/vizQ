import numpy as np
import matplotlib.pyplot as plt
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, partial_trace, Operator
from qiskit.quantum_info.operators import Pauli
from qiskit.visualization import plot_bloch_vector

def get_bloch_vector_from_density_matrix(rho):
    # Define Pauli matrices
    X = Pauli('X').to_matrix()
    Y = Pauli('Y').to_matrix()
    Z = Pauli('Z').to_matrix()

    # Compute Bloch components as traces
    x = np.real(np.trace(rho.data @ X))
    y = np.real(np.trace(rho.data @ Y))
    z = np.real(np.trace(rho.data @ Z))

    return [x, y, z]

def get_state_and_circuit():
    qc = QuantumCircuit(2)
    qc.x(0)
    qc.h(0)
    qc.z(0)
    qc.cx(0, 1)

    state = Statevector.from_instruction(qc)

    reduced_dm_0 = partial_trace(state, [1])  # Trace out qubit 1

    bloch_vector_0 = get_bloch_vector_from_density_matrix(reduced_dm_0)

    print("Full statevector:")
    print(state)

    print("\nQuantum circuit:")
    print(qc.draw(output="text"))

    plot_bloch_vector(bloch_vector_0, title="Bloch Sphere for Qubit 0")
    plt.show()

    return state, qc

statevector, circuit = get_state_and_circuit()
