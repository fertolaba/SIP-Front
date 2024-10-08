import { createBrowserRouter } from "react-router-dom";
import Registro from "./auth/Registro";
import Login from "./auth/Login";
import { ClientDashboard } from "./ClientDashboard";
import AuthRoute from "./AuthRoute";
import { ArtistDashboard } from "./ArtistDashboard";
import ErrorPage from "./error/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/registro",
        element: <Registro />, 
        errorElement: <ErrorPage />
    },
    {
        path: "/login", 
        element: <Login />,
        errorElement: <ErrorPage />
    },
    {
        path: "/client-dashboard",
        element: (
            <AuthRoute allowedRoles={['CLIENT']}>
                <ClientDashboard />
            </AuthRoute>
        ),
        errorElement: <ErrorPage />
    },
    {
        path: "/artist-dashboard",
        element: (
            <AuthRoute allowedRoles={['ARTIST']}>  
                <ArtistDashboard />
            </AuthRoute>
        ),
        errorElement: <ErrorPage />
    },
    {
        path: "*", 
        element: <Login />, 
    },
]);

export default router;
