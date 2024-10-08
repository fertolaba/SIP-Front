import React from "react";

const ErrorPage = () => {
    return (
        <div>
            <h1>Error</h1>
            <p>Hubo un problema al cargar la página.</p>
            <p><a href="/login">Volver al inicio de sesión</a></p>
        </div>
    );
};

export default ErrorPage;
