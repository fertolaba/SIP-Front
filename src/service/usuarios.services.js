import { API_BASE_URL } from "../constants/constants";
import fetchWithTimeout from "../componentes/error/_fetchWithTimeOut";

class UsuariosService{
    _instance = null;
    _apiUrl = API_BASE_URL + '/users';

    getInstance() {
        if (!this._instance) {
          this._instance = new UsuariosService();
        }
        return this._instance;
    }

    getUserById = async (id) => {
      const url = `${this._apiUrl}/${id}`;
      try {
        const response = await fetchWithTimeout(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    updateUser = async (id, userData) => {
      console.log("Actualizando usuario con id:", id);  
      const url = `${this._apiUrl}/${id}`;
      
      
      const updatedUserData = {
        ...userData,
        localidadId: userData.localidad,  
      };
      try {
        const response = await fetchWithTimeout(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUserData), 
        });
  
        if (!response.ok) {
          throw new Error('Error updating user data');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
      }
    };

    authenticateUser = async (credentials) => {
      const url = `http://localhost:4002/api/v1/auth/authenticate`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
    
        if (!response.ok) {
          const error = await response.json();
          console.log('Respuesta de error:', error);  
       
          if (error.message && error.message === "La contraseña es incorrecta.") {
            throw new Error("La contraseña es incorrecta. Por favor, verifica tu contraseña.");
          }

          if (error.message && error.message === "No existe un usuario registrado con el email proporcionado.") {
            throw new Error("No existe un usuario registrado con el email proporcionado. Por favor, revisa el email.");
          }
          if (error.message && error.message === "El email no ha sido verificado.") {
            throw new Error("El email no ha sido verificado. Por favor, revisa tu correo para verificarlo.");
          }
    
          throw new Error('Error en el login. Respuesta inesperada del servidor.');
        }
    
        return await response.json();
      } catch (error) {
        console.error('Error en la autenticación:', error);
        throw error;
      }
    };
    
    
}

const usuarioService = new UsuariosService();
export default usuarioService.getInstance();