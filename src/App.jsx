import { Routes, Route } from "react-router-dom";
import DoctorsList from "./routes/DoctorsList";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DoctorsList />} />
      </Routes>
    </div>
  );
}

export default App;