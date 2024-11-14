import { API_BASE_URL } from "../constants/constants";
import fetchWithTimeout from "../componentes/error/_fetchWithTimeOut";

class RecommendationsService{
    _instance = null;
    _apiUrl = API_BASE_URL + '/recommendations/user';

    getInstance() {
        if (!this._instance) {
          this._instance = new RecommendationsService();
        }
        return this._instance;
    }

    getRecommendations = async (userId) => {
        const url = `${this._apiUrl}/${userId}`;
        try {
          const response = await fetchWithTimeout(url);
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

const recommendationsService = new RecommendationsService();
export default recommendationsService.getInstance();