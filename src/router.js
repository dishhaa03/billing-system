import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import User from "./pages/UserList";
import Bills from "./pages/BillList";
import Insights from "./pages/Insights";
import UserDetails from "./pages/UserDetails";
import BillDetails from "./pages/BillDetails";
import NewBill from "./pages/NewBill";

// Define the routes using the createBrowserRouter API
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // Main layout component (with Navbar)
    children: [
      {
        path: "/",  // Home route
        element: <Home />
      },
      {
        path: "/user",  // User page route
        element: <User />
      },
      {
        path: "/user/:userId",
        element: <UserDetails />
      },
      {
        path: "/bills",  // Billing page route
        element: <Bills />
      },
      { 
        path: "/bills/:billid", 
        element: <BillDetails /> 
      },
      {
        path: "/insights",  // Insights page route
        element: <Insights />
      },
      { 
        path: "/bills/new", 
        element: <NewBill /> 
      },
    ]
  }
]);

export default router;
