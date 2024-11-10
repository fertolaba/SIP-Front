import { API_BASE_URL } from "../constants/constants";
import fetchWithTimeout from "../componentes/error/_fetchWithTimeOut";

class EventosService{
    _instance = null;
    _apiUrl = API_BASE_URL + '/events';

    getInstance() {
        if (!this._instance) {
          this._instance = new EventosService();
        }
        return this._instance;
    }

    getEventos = async () => {
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

      async getUserEvents(userId) {
        try {
          const response = await fetchWithTimeout(`${this._apiUrl}/artist/${userId}`);
          if (!response.ok) {
            throw new Error('Error fetching user events');
          }
          return await response.json();
        } catch (error) {
          console.error('Error fetching user events:', error);
          return [];
        }
      }
    
      async deleteEvent(eventId) {
        try {
          const response = await fetchWithTimeout(`${this._apiUrl}/${eventId}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            throw new Error('Error deleting event');
          }
          return true;
        } catch (error) {
          console.error('Error deleting event:', error);
          return false;
        }
      }
}

const eventoService = new EventosService();
export default eventoService.getInstance();