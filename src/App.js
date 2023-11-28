import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PageLayout from "./components/layouts/PageLayout";
import Documents from "./modules/documents/Documents";
import Splash from "./modules/splash/Splash";
import Todos from "./modules/todos/Todos";
import Code from "./modules/code/Code";

function App() {
  return (
    <div className="App flex flex-col p-4 bg-[#E7E7E7]">
      <Routes>
        <Route path="/login" element={<Splash />} />
        <Route element={<PageLayout />}>
          <Route path="/docs" element={<Documents key={'docs'} fileType={'docs'}/>} />
          <Route path="/sheets" element={<Documents key={'sheets'} fileType={'sheets'}/>} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/code" element={<Code key={'code'} fileType={'code'} />} />
        </Route>
        <Route index element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

// Run metro bundler: npm run devstart
// Run electron app: nm run dev
// Create icns file iconutil -c icns public/images/MyApp.iconset
// Icon name - icon_sizexsize
// Create distribution package: npm run make
