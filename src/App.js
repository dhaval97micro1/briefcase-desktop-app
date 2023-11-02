import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PageLayout from "./components/layouts/PageLayout";
import Sidebar from "./components/sidebar/Sidebar";
import Documents from "./modules/documents/Documents";
import Todos from "./modules/todos/Todos";

function App() {
  return (
    <div className="App flex p-4 bg-[#E7E7E7]">
      <Sidebar />
      <Routes>
        <Route path="/documents" element={<Documents />} />
        <Route path="/todos" element={<Todos />} />
        <Route index element={<Navigate to="/documents" />} />
      </Routes>
    </div>
  );
}

export default App;
