import { RouterProvider } from "react-router-dom";
import MainRouter from "./MainRouter";
import { UserProvider } from "./pages/Context/UserContext";
import { AdminProvider } from "./pages/Admin/AdminContext";

function App() {
  return (
    <AdminProvider>
      <UserProvider>
        <RouterProvider router={MainRouter} />
      </UserProvider>
    </AdminProvider>
  );
}

export default App;
