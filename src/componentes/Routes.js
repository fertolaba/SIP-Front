import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Registro from "./Registro";
import Login from "./Login";

const router = createBrowserRouter([
    {
        path: "/registro",
        element: <Registro /> 
    },
    {
        path: "/login", 
        element: <Login />
    }
])

export default router;