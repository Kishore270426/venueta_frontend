import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginOptionsPage from "./pages/LoginOptionsPage";
import UserLoginPage from "./pages/user/UserLogin";
import UserSignup from "./pages/user/UserSignup";

// Admin Login Pages
import AdminLoginPage from "./pages/Admin/AdminLogin";
import AdminSignup from "./pages/Admin/AdminSignup";

// Admin Dashboard Pages
import AdminLayout from "./pages/Admin/AdminLayout";
import DashHome from './pages/Admin/dashboard/Home';


import Settings from './pages/Admin/dashboard/Settings';
import Logout from './pages/Admin/dashboard/Logout';
import Bookings from "./pages/Admin/dashboard/Bookings";
import Invoice from "./pages/Admin/dashboard/Invoice";
import Subscriptions from "./pages/Admin/dashboard/Subscriptions";
// user pages
import UserLayout from "./pages/user/UserLayout";
import Dashboarduser from "./pages/user/dashboard/Dashboarduser";
import BookingPage from "./pages/user/dashboard/BookingPage";
import UserLogoutPage from "./pages/user/dashboard/Logout";
import Myhalls from "./pages/Admin/dashboard/Myhalls";
import EditHall from "./pages/Admin/dashboard/EditHall";
import BookingStatus from "./pages/user/dashboard/BookingStatus";
import BookingDetails from "./pages/user/dashboard/BookingDetails";
import Usersettings from "./pages/user/dashboard/Usersettings";

const MainRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login-options",
    element: <LoginOptionsPage />,
  },
  {
    path: "/user-login",
    element: <UserLoginPage />,
  },
  {
    path: "/user-signup",
    element: <UserSignup />,
  },
  {
    path: "/admin-login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin-signup",
    element: <AdminSignup />,
  },
  {
    path: "/edit-hall/:hallId",
    element: <EditHall />,
  },
  {
    path:"/booking/:id",
    element: <BookingDetails />,
  },

  
  // Wrap admin pages with AdminLayout
   {
    path: "/admin-Dashboard",
    element: <AdminLayout />,
    children: [
      { path: "hall-register", element: <DashHome /> }, // Correct ✅
      { path: "admin-bookings", element: <Bookings /> }, // Correct ✅
      { path: "my-halls", element: <Myhalls /> }, // Correct ✅
     
      { path: "invoice", element: <Invoice /> }, // Correct ✅
      { path: "subscriptions", element: <Subscriptions /> }, // Correct ✅
      { path: "settings", element: <Settings /> }, // Correct ✅
      { path: "logout", element: <Logout /> }, // Correct ✅
    ],
  },  
  // Wrap admin pages with AdminLayout
  {
    path: "/user-Dashboard",
    element: <UserLayout />,
    children: [
      { path: "dashboard-user", element: <Dashboarduser /> }, // Correct ✅
      { path: "my-booking-status", element: <BookingStatus /> }, // Correct ✅
      { path: "bookingpage", element: <BookingPage /> }, // Correct ✅
      { path: "invoice", element: <Invoice /> }, // Correct ✅
      { path: "subscriptions", element: <Subscriptions /> }, // Correct ✅
      { path: "usersettings", element: <Usersettings /> }, // Correct ✅
      { path: "user-logout", element: <UserLogoutPage /> }, // Correct ✅
    ],
  },
]);

export default MainRouter;
