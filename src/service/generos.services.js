import { API_BASE_URL } from "../constants/constants";
import fetchWithTimeout from "../componentes/error/_fetchWithTimeOut";

class GenerosService{
    _instance = null;
    _apiUrl = API_BASE_URL + '/music-genres';

    getInstance() {
        if (!this._instance) {
          this._instance = new GenerosService();
        }
        return this._instance;
    }

    getGeneros = async () => {
        try {
          const response = await fetchWithTimeout(this._apiUrl);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return await response.json();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    
        return []
      };
}

const generoService = new GenerosService();
export default generoService.getInstance();