// import React, { useState } from "react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Bar,
//   LabelList,
// } from "recharts";
// import { getBlochVector } from "./utils/quantumHelpers.ts";
// import { useNavigate } from "react-router-dom";

// // import BlochSphere from "./components/blochSphere.tsx";

// type Gate = {
//   gate: string;
//   qubits: number[];
// };

// type Complex = {
//   real: number;
//   imag: number;
// };

// type Statevector = Complex[];

// type SimulationResponse = {
//   circuit_image?: string; // base64 PNG
//   statevector?: Statevector;
//   error?: string;
// };

// const QuantumSimulator: React.FC = () => {
//   const [nQubits, setNQubits] = useState(1);
//   const [gateSelect, setGateSelect] = useState("h");
//   const [qubitsInput, setQubitsInput] = useState("");
//   const [gates, setGates] = useState<Gate[]>([]);
//   const [chartData, setChartData] = useState<any[]>([]);
//   const [blochVector, setBlochVector] = useState<{
//     x: number;
//     y: number;
//     z: number;
//   } | null>(null);
//   const [circuitImage, setCircuitImage] = useState<string>("");
//   const [statevectorText, setStatevectorText] = useState<string>(
//     "(result will appear here)"
//   );

//   const multiQubitGates = ["cx", "cz"];

//   const addGate = () => {
//     if (!qubitsInput.trim()) {
//       alert("Please enter qubit indices.");
//       return;
//     }

//     const qubits = qubitsInput
//       .split(",")
//       .map((q) => parseInt(q.trim()))
//       .filter((q) => !isNaN(q));

//     if (qubits.length === 0 || qubits.some((q) => q < 0 || q >= nQubits)) {
//       alert(`Qubit indices must be numbers between 0 and ${nQubits - 1}`);
//       return;
//     }

//     if (multiQubitGates.includes(gateSelect) && qubits.length !== 2) {
//       alert(`${gateSelect.toUpperCase()} gate requires exactly 2 qubits`);
//       return;
//     }

//     if (!multiQubitGates.includes(gateSelect) && qubits.length !== 1) {
//       alert(`${gateSelect.toUpperCase()} gate requires exactly 1 qubit`);
//       return;
//     }

//     setGates((prev) => [...prev, { gate: gateSelect, qubits }]);
//     setQubitsInput("");
//   };

//   const updateGateList = () => {
//     if (gates.length === 0) return "(none)";
//     return gates
//       .map(
//         (g, i) =>
//           `${i + 1}. ${g.gate.toUpperCase()} on qubits [${g.qubits.join(", ")}]`
//       )
//       .join("\n");
//   };

//   const simulate = async () => {
//     if (gates.length === 0) {
//       alert("Add at least one gate.");
//       return;
//     }

//     if (nQubits < 1) {
//       alert("Number of qubits must be at least 1.");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:5000/simulate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ n_qubits: nQubits, gates }),
//       });

//       if (!response.ok) throw new Error("Server error");

//       const data: SimulationResponse = await response.json();

//       if (data.circuit_image) {
//         setCircuitImage(`data:image/png;base64,${data.circuit_image}`);
//       } else {
//         setCircuitImage("");
//       }

//       if (data.statevector) {
//         const svText = data.statevector
//           .map(
//             (val, idx) =>
//               `|${idx.toString(2).padStart(nQubits, "0")}⟩ → ${val.real.toFixed(
//                 3
//               )} + ${val.imag.toFixed(3)}i`
//           )
//           .join("\n");
//         setStatevectorText(svText);
//         setChartData(computeProbabilities(data.statevector, nQubits));
//         const blochVec = getBlochVector(data.statevector);
//         setBlochVector(blochVec);
//       } else if (data.error) {
//         alert(data.error);
//       } else {
//         alert("Unexpected server response");
//       }
//     } catch (err: any) {
//       alert("Error during simulation: " + err.message);
//     }
//   };

//   const computeProbabilities = (statevector: Statevector, nQubits: number) => {
//     return statevector.map((amplitude, idx) => {
//       const probability = amplitude.real ** 2 + amplitude.imag ** 2;
//       return {
//         state: `|${idx.toString(2).padStart(nQubits, "0")}⟩`,
//         probability: probability.toFixed(4),
//       };
//     });
//   };
//   const navigate = useNavigate();

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "0 10%",
//         }}
//       >
//         <h1
//           style={{
//             fontSize: "2.8rem",
//             color: "#222",
//             fontFamily: "Roboto",
//           }}
//         >
//           VizQ
//         </h1>
//         <button onClick={() => navigate("/nerds")}>click</button>
//       </div>
//       <div
//         style={{
//           fontFamily: "Roboto",
//           padding: "2rem",
//           maxWidth: "1200px",
//           margin: "auto",
//           display: "flex",
//           flexDirection: "row",
//           gap: "2rem",
//           flexWrap: "wrap",
//           color: "#333",
//         }}
//       >
//         {/* Left Section: Inputs & Controls */}
//         <div
//           className="left-section"
//           style={{
//             flex: "1 1 400px",
//             padding: "1.5rem",
//             borderRadius: "12px",
//             boxShadow: "0 0px 10px rgba(0, 0, 0, 0.15)",
//             display: "flex",
//             flexDirection: "column",
//             gap: "1rem",
//           }}
//         >
//           <div>
//             <h2>Enter</h2>
//             <label htmlFor="n_qubits">Number of Qubits:</label>
//             <input
//               type="number"
//               id="n_qubits"
//               min={1}
//               max={10}
//               value={nQubits}
//               onChange={(e) =>
//                 setNQubits(Math.max(1, Math.min(10, Number(e.target.value))))
//               }
//               style={{
//                 marginTop: "5px",
//                 padding: "0.5rem",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 width: "95%",
//                 fontFamily: "monospace",
//               }}
//             />
//           </div>

//           <div>
//             <label htmlFor="gate-select">Select Gate:</label>
//             <select
//               id="gate-select"
//               value={gateSelect}
//               onChange={(e) => setGateSelect(e.target.value)}
//               style={{
//                 marginTop: "5px",
//                 padding: "0.5rem",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 width: "100%",
//                 fontFamily: "monospace",
//               }}
//             >
//               <option value="h">H (Hadamard)</option>
//               <option value="x">X (Pauli-X)</option>
//               <option value="y">Y (Pauli-Y)</option>
//               <option value="z">Z (Pauli-Z)</option>
//               <option value="rx">RX (π/2 rotation)</option>
//               <option value="rz">RZ (π/2 rotation)</option>
//               <option value="cx">CX (CNOT)</option>
//               <option value="cz">CZ</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="qubits-input">
//               Qubit Indices (comma separated):
//             </label>
//             <input
//               type="text"
//               id="qubits-input"
//               placeholder="e.g. 0 or 0,1 for 2-qubit gates"
//               value={qubitsInput}
//               onChange={(e) => setQubitsInput(e.target.value)}
//               style={{
//                 marginTop: "5px",
//                 padding: "0.5rem",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 width: "95%",
//                 fontFamily: "monospace",
//               }}
//             />
//           </div>

//           <button
//             onClick={addGate}
//             style={{
//               padding: "0.75rem",
//               background: "blue",
//               color: "#fff",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//               fontWeight: "bold",
//             }}
//           >
//             Add Gate
//           </button>

//           <div>
//             <h3>Gates Added:</h3>
//             <pre
//               style={{
//                 fontFamily: "monospace",
//                 background: "#eef2f7",
//                 padding: "1rem",
//                 borderRadius: "8px",
//                 overflowX: "auto",
//                 maxHeight: "200px",
//               }}
//             >
//               {updateGateList()}
//             </pre>
//           </div>

//           <button
//             onClick={simulate}
//             style={{
//               padding: "0.75rem",
//               background: "green",
//               color: "#fff",
//               border: "none",
//               borderRadius: "6px",
//               fontWeight: "bold",
//               cursor: "pointer",
//             }}
//           >
//             Simulate
//           </button>
//         </div>

//         {/* Right Section: Output */}
//         <div
//           className="right-section"
//           style={{
//             flex: "1 1 600px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "1.5rem",
//             boxShadow: "0 0px 10px rgba(0,0,0,0.15)",
//             padding: "16px",
//           }}
//         >
//           <div>
//             <h3>Circuit Image:</h3>
//             {circuitImage ? (
//               <img
//                 alt="Circuit diagram"
//                 src={circuitImage}
//                 style={{
//                   marginTop: "10px",
//                   maxWidth: "100%",
//                   borderRadius: "10px",
//                   border: "1px solid #ddd",
//                   backgroundColor: "#fff",
//                   boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//                   fontFamily: "monospace",
//                 }}
//               />
//             ) : (
//               <p style={{ fontFamily: "monospace" }}>
//                 (Circuit image will appear here)
//               </p>
//             )}
//           </div>

//           <div>
//             <h3>Statevector:</h3>
//             <pre
//               style={{
//                 fontFamily: "monospace",
//                 background: "#eef2f7",
//                 padding: "1rem",
//                 borderRadius: "8px",
//                 overflowX: "auto",
//                 maxHeight: "250px",
//               }}
//             >
//               {statevectorText}
//             </pre>
//           </div>

//           <div>
//             <h3>Probability Distribution:</h3>
//             {chartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart
//                   data={chartData}
//                   margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
//                   <XAxis
//                     dataKey="state"
//                     tick={{ fill: "#333", fontWeight: "bold" }}
//                   />
//                   <YAxis domain={[0, 1]} tickCount={6} />
//                   <Tooltip
//                     formatter={(value: any) =>
//                       typeof value === "number" ? value.toFixed(3) : value
//                     }
//                   />
//                   <Bar
//                     dataKey="probability"
//                     fill="#4a90e2"
//                     animationDuration={500}
//                     barSize={40}
//                   >
//                     <LabelList
//                       dataKey="probability"
//                       position="top"
//                       formatter={(value: any) =>
//                         typeof value === "number" ? value.toFixed(2) : ""
//                       }
//                       style={{
//                         fill: "#000",
//                         fontWeight: "bold",
//                       }}
//                     />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <p style={{ fontFamily: "monospace" }}>
//                 (Run a simulation to see the probabilities)
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuantumSimulator;
