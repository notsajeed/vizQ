import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Gate = {
  gate: string;
  qubits: number[];
};

type Complex = {
  real: number;
  imag: number;
};

type Statevector = Complex[];

type SimulationResponse = {
  circuit_image?: string; // base64 PNG
  statevector?: Statevector;
  error?: string;
};

const QuantumSimulator: React.FC = () => {
  const [nQubits, setNQubits] = useState(1);
  const [gateSelect, setGateSelect] = useState("h");
  const [qubitsInput, setQubitsInput] = useState("");
  const [gates, setGates] = useState<Gate[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [circuitImage, setCircuitImage] = useState<string>("");
  const [statevectorText, setStatevectorText] = useState<string>(
    "(result will appear here)"
  );

  const multiQubitGates = ["cx", "cz"];

  const addGate = () => {
    if (!qubitsInput.trim()) {
      alert("Please enter qubit indices.");
      return;
    }

    const qubits = qubitsInput
      .split(",")
      .map((q) => parseInt(q.trim()))
      .filter((q) => !isNaN(q));

    if (qubits.length === 0 || qubits.some((q) => q < 0 || q >= nQubits)) {
      alert(`Qubit indices must be numbers between 0 and ${nQubits - 1}`);
      return;
    }

    if (multiQubitGates.includes(gateSelect) && qubits.length !== 2) {
      alert(`${gateSelect.toUpperCase()} gate requires exactly 2 qubits`);
      return;
    }

    if (!multiQubitGates.includes(gateSelect) && qubits.length !== 1) {
      alert(`${gateSelect.toUpperCase()} gate requires exactly 1 qubit`);
      return;
    }

    setGates((prev) => [...prev, { gate: gateSelect, qubits }]);
    setQubitsInput("");
  };

  const updateGateList = () => {
    if (gates.length === 0) return "(none)";
    return gates
      .map(
        (g, i) =>
          `${i + 1}. ${g.gate.toUpperCase()} on qubits [${g.qubits.join(", ")}]`
      )
      .join("\n");
  };

  const simulate = async () => {
    if (gates.length === 0) {
      alert("Add at least one gate.");
      return;
    }

    if (nQubits < 1) {
      alert("Number of qubits must be at least 1.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n_qubits: nQubits, gates }),
      });

      if (!response.ok) throw new Error("Server error");

      const data: SimulationResponse = await response.json();

      if (data.circuit_image) {
        setCircuitImage(`data:image/png;base64,${data.circuit_image}`);
      } else {
        setCircuitImage("");
      }

      if (data.statevector) {
        const svText = data.statevector
          .map(
            (val, idx) =>
              `|${idx.toString(2).padStart(nQubits, "0")}⟩ → ${val.real.toFixed(
                3
              )} + ${val.imag.toFixed(3)}i`
          )
          .join("\n");
        setStatevectorText(svText);
        setChartData(computeProbabilities(data.statevector, nQubits));
      } else if (data.error) {
        alert(data.error);
      } else {
        alert("Unexpected server response");
      }
    } catch (err: any) {
      alert("Error during simulation: " + err.message);
    }
  };

  const computeProbabilities = (statevector: Statevector, nQubits: number) => {
    return statevector.map((amplitude, idx) => {
      const probability = amplitude.real ** 2 + amplitude.imag ** 2;
      return {
        state: `|${idx.toString(2).padStart(nQubits, "0")}⟩`,
        probability: probability.toFixed(4),
      };
    });
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: 20,
        maxWidth: 600,
        margin: "auto",
      }}
    >
      <h1>Quantum Circuit Simulator</h1>

      <label htmlFor="n_qubits">Number of Qubits:</label>
      <input
        type="number"
        id="n_qubits"
        min={1}
        max={10}
        value={nQubits}
        onChange={(e) =>
          setNQubits(Math.max(1, Math.min(10, Number(e.target.value))))
        }
        style={{
          margin: "5px 0",
          display: "block",
          width: "100%",
          maxWidth: 300,
        }}
      />

      <label htmlFor="gate-select">Select Gate:</label>
      <select
        id="gate-select"
        value={gateSelect}
        onChange={(e) => setGateSelect(e.target.value)}
        style={{
          margin: "5px 0",
          display: "block",
          width: "100%",
          maxWidth: 300,
        }}
      >
        <option value="h">H (Hadamard)</option>
        <option value="x">X (Pauli-X)</option>
        <option value="y">Y (Pauli-Y)</option>
        <option value="z">Z (Pauli-Z)</option>
        <option value="rx">RX (π/2 rotation)</option>
        <option value="rz">RZ (π/2 rotation)</option>
        <option value="cx">CX (CNOT)</option>
        <option value="cz">CZ</option>
      </select>

      <label htmlFor="qubits-input">Qubit Indices (comma separated):</label>
      <input
        type="text"
        id="qubits-input"
        placeholder="e.g. 0 or 0,1 for 2-qubit gates"
        value={qubitsInput}
        onChange={(e) => setQubitsInput(e.target.value)}
        style={{
          margin: "5px 0",
          display: "block",
          width: "100%",
          maxWidth: 300,
        }}
      />

      <button onClick={addGate} style={{ marginTop: 10, maxWidth: 300 }}>
        Add Gate
      </button>

      <h3>Gates added:</h3>
      <pre
        id="gates-list"
        style={{
          marginTop: 20,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      >
        {updateGateList()}
      </pre>

      <button onClick={simulate} style={{ marginTop: 20, maxWidth: 300 }}>
        Simulate
      </button>

      <h3>Circuit Image:</h3>
      {circuitImage ? (
        <img
          id="circuit-image"
          alt="Circuit diagram"
          src={circuitImage}
          style={{ marginTop: 20, maxWidth: "100%", border: "1px solid #ddd" }}
        />
      ) : (
        <p>(Circuit image will appear here)</p>
      )}

      <h3>Statevector:</h3>
      <pre
        id="statevector"
        style={{
          marginTop: 20,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      >
        {statevectorText}
      </pre>
      <h3>Probability Distribution:</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="probability" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>(Run a simulation to see the probabilities)</p>
      )}
    </div>
  );
};

export default QuantumSimulator;
