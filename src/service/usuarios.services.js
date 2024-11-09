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
}

const usuarioService = new UsuariosService();
export default usuarioService.getInstance();