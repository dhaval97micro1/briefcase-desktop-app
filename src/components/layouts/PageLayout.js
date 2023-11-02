import { Outlet } from "react-router-dom";
const PageLayout = () => {
  return (
    <div className="ml-5 bg-white rounded-lg h-[calc(100vh-32px)] flex-1">
      {Outlet}
    </div>
  );
};

export default PageLayout;
