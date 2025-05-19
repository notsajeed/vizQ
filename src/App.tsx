// App.tsx or your main layout file
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuantumSimulator from "./quantumSimulator.tsx"; // your simulator
import NerdsPage from "./nerds.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuantumSimulator />} />
        <Route path="/nerds" element={<NerdsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
