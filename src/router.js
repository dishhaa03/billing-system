import { createBrowserRouter } from "react-router-dom";
import App from "./App.js";
import Home from "./pages/Home.js";
import User from "./pages/UserList.js";
import Bills from "./pages/BillList.js";
import Insights from "./pages/Insights.js";
import UserDetails from "./pages/UserDetails.js";
import BillDetails from "./pages/BillDetails.js";
import NewBill from "./pages/NewBill.js";

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
