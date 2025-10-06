import { Outlet } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1  sm:p-10">
        <Outlet /> {/* Renders the child components */}
      </div>
    </div>
  );
};

export default UserLayout;
