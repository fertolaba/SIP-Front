import { createBrowserRouter } from "react-router-dom";
import Registro from "./auth/Registro";
import Login from "./auth/Login";
import { ClientDashboard } from "./ClientDashboard";
import AuthRoute from "./AuthRoute";
import { ArtistDashboard } from "./ArtistDashboard";
import ErrorPage from "./error/ErrorPage";
import {BusquedaEventos} from "./BusquedaEventos";
import AltaEventos from "./AltaEventos";
import MisEventos from "../pages/MisEventos";
import EditarEventos from "../pages/EditarEventos";
import Reestablecer from "./auth/Reestablecer";
import EventosAsistire from "../pages/EventosAsistire";



const router = createBrowserRouter([
    {
        path: "/registro",
        element: <Registro />, 
        errorElement: <ErrorPage />
    },
    {
        path: "/reestablecer",
        element: <Reestablecer />, 
        errorElement: <ErrorPage />
    },

    {
        path: "/BusquedaEventos",
        element:<BusquedaEventos/>,
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
        path: "/AltaEventos",
        element: (
            <AuthRoute allowedRoles={['ARTIST']}>  
                <AltaEventos />
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
        path: "/MisEventos",
        element: (
            <AuthRoute allowedRoles={['ARTIST']}>  
                <MisEventos />
            </AuthRoute>
        ),
        errorElement: <ErrorPage />
    },
    {
        path: "/EditarEventos/:eventId",
        element: (
            <AuthRoute allowedRoles={['ARTIST']}>  
                <EditarEventos />
            </AuthRoute>
        ),
        errorElement: <ErrorPage />
    },
    {
        path: "/Asistencia",
        element: (
            <AuthRoute>  
                <EventosAsistire />
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