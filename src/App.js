import { Navigate, Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import PageLayout from "./components/layouts/PageLayout";
import Documents from "./modules/documents/Documents";
import Splash from "./modules/splash/Splash";
import Todos from "./modules/todos/Todos";
import Notes from "./modules/notes/Notes";
import NoteDetails from "./modules/note-details/NoteDetails";
import Code from "./modules/code/Code";

function App() {
  return (
    <div className="App flex flex-col p-4 bg-[#F5F5F5]">
      <Routes>
        <Route path="/login" element={<Splash />} />
        <Route element={<PageLayout />}>
          <Route
            path="/docs"
            element={<Documents key={"docs"} fileType={"docs"} />}
          />
          <Route
            path="/sheets"
            element={<Documents key={"sheets"} fileType={"sheets"} />}
          />
          <Route path="/todos" element={<Todos />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/note-details" element={<NoteDetails />} />
          <Route
            path="/code"
            element={<Code key={"code"} fileType={"code"} />}
          />
          <Route
            path="/docs"
            element={<Documents key={"docs"} fileType={"docs"} />}
          />
          <Route
            path="/sheets"
            element={<Documents key={"sheets"} fileType={"sheets"} />}
          />
          <Route path="/todos" element={<Todos />} />
          <Route
            path="/code"
            element={<Code key={"code"} fileType={"code"} />}
          />
        </Route>
        <Route index element={<Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

// Run metro bundler: npm run devstart
// Run electron app: nm run dev
// Create icns file iconutil -c icns public/images/MyApp.iconset
// Icon name - icon_sizexsize
// Create distribution package: npm run make
