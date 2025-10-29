import { Outlet } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";

const UserLayout = () => {
  return (
    <div className="">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;