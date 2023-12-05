import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "src/helpers/storage";
import Sidebar from "../sidebar/Sidebar";
const PageLayout = () => {
  const isLoggedIn = getToken();
  return (
    <div className="flex bg-white-500 rounded-2xl h-[calc(100vh-100px)] w-full">
      <Sidebar />
      <div className="w-full">
        {!isLoggedIn ? <Navigate to="/login" /> : <Outlet />}
      </div>
    </div>
  );
};

export default PageLayout;
