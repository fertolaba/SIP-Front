import { createBrowserRouter } from "react-router-dom";
import Registro from "./auth/Registro";
import Login from "./auth/Login";
import { ClientDashboard } from "./ClientDashboard";
import AuthRoute from "./AuthRoute";
import { ArtistDashboard } from "./ArtistDashboard";

const router = createBrowserRouter([
    {
        path: "/registro",
        element: <Registro /> 
    },
    {
        path: "/login", 
        element: <Login />
    },
    {
        path: "/client-dashboard",
        element: (
            <AuthRoute allowedRoles={['CLIENT']}>
                <ClientDashboard />
            </AuthRoute>
        ),
    },
    {
        path: "/artist-dashboard",
        element: (
            <AuthRoute allowedRoles={['ARTIST']}>  
                <ArtistDashboard />
            </AuthRoute>
        ),
    },
]);

export default router;
