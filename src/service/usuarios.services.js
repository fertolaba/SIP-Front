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
      console.log("Actualizando usuario con id:", id);  // Verifica que el id no sea null
      const url = `${this._apiUrl}/${id}`;
      
      // Asegúrate de que 'localidad' se llame 'localidadId' en lugar de 'localidad'
      const updatedUserData = {
        ...userData,
        localidadId: userData.localidad,  // Renombramos 'localidad' a 'localidadId'
      };
      try {
        const response = await fetchWithTimeout(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUserData),  // Usamos el nuevo formato
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
          if (error.message === "Cuenta no activada. Por favor, revisa tu correo para activar tu cuenta.") {
            throw new Error("Cuenta no activada. Por favor, revisa tu correo para activar tu cuenta.");
          }
          throw new Error('Error en el login');
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