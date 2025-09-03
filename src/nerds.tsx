import React from "react";
import { useNavigate } from "react-router-dom";
const gates = [
  {
    name: "Hadamard Gate (H)",
    description: `The Hadamard gate creates a superposition.
It transforms |0⟩ into (|0⟩ + |1⟩)/√2 and |1⟩ into (|0⟩ - |1⟩)/√2.`,
    matrix: [
      ["1/√2", "1/√2"],
      ["1/√2", "-1/√2"],
    ],
    example: `Input: |0⟩ → Output: (|0⟩ + |1⟩) / √2`,
    imageAlt: "Hadamard Gate Circuit",
    imageSrc: "", // Add your image URL here
  },
  {
    name: "Pauli-X Gate (X)",
    description: `Equivalent to a classical NOT gate.
Flips |0⟩ to |1⟩ and |1⟩ to |0⟩.`,
    matrix: [
      [0, 1],
      [1, 0],
    ],
    example: `Input: |0⟩ → Output: |1⟩`,
    imageAlt: "Pauli-X Gate Circuit",
    imageSrc: "",
  },
  {
    name: "Pauli-Y Gate (Y)",
    description: `Combines bit-flip with a phase-flip.
More complex due to the imaginary component.`,
    matrix: [
      [0, "-i"],
      ["i", 0],
    ],
    example: `Input: |1⟩ → Output: i|0⟩`,
    imageAlt: "Pauli-Y Gate Circuit",
    imageSrc: "",
  },
  {
    name: "Pauli-Z Gate (Z)",
    description: `Applies a phase flip.
Leaves |0⟩ unchanged, flips phase of |1⟩.`,
    matrix: [
      [1, 0],
      [0, -1],
    ],
    example: `Input: |1⟩ → Output: -|1⟩`,
    imageAlt: "Pauli-Z Gate Circuit",
    imageSrc: "",
  },
  {
    name: "CNOT Gate",
    description: `Controlled-NOT gate for two qubits.
Flips the target qubit if the control qubit is |1⟩. Core of entanglement.`,
    matrix: "4x4 matrix (check math for full form)",
    example: `Input: |10⟩ → Output: |11⟩ (Target flipped because control is |1⟩)`,
    imageAlt: "CNOT Gate Circuit",
    imageSrc: "",
  },
];

const NerdsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "4rem 10%",
        fontFamily: "Roboto, sans-serif",
        backgroundColor: "#f4f4f4",
        color: "#222",
      }}
    >
      <button onClick={() => navigate("/")}>back</button>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2.5rem" }}>
        🧪 Quantum Logic Gates
      </h1>

      {gates.map((gate, index) => (
        <section
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "2rem",
            marginBottom: "3rem",
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Gate Info */}
          <div>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
              {gate.name}
            </h2>
            <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
              {gate.description}
            </p>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Matrix Representation:
            </p>
            {Array.isArray(gate.matrix) ? (
              <pre
                style={{
                  fontSize: "1rem",
                  background: "#f0f0f0",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  width: "fit-content",
                }}
              >
                {gate.matrix.map((row) => row.join("\t")).join("\n")}
              </pre>
            ) : (
              <p style={{ fontSize: "1rem" }}>{gate.matrix}</p>
            )}
            <p
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                marginTop: "1rem",
              }}
            >
              Example:
            </p>
            <p style={{ fontSize: "1rem", color: "#333" }}>{gate.example}</p>
          </div>

          {/* Gate Image */}
          <div
            style={{
              height: "200px",
              backgroundColor: "#e0e0e0",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {gate.imageSrc ? (
              <img
                src={gate.imageSrc}
                alt={gate.imageAlt}
                style={{ width: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "#666", fontStyle: "italic" }}>
                ⬆️ Upload Image for {gate.name}
              </span>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default NerdsPage;
