import axios from "axios";
// Access the API URL from your Vite environment variables
const API_URL = import.meta.env.VITE_APP_API_URL;
const TOKEN_KEY = 'token';
const USER_TOKEN_KEY = 'userToken';
export const isAuthenticated = async () : Promise<boolean>  => {

    try {
    // Get the user's token from local storage
    const token = localStorage.getItem(TOKEN_KEY);

    // If there's no token, the user is not authenticated
    
    
    if (!token) {
       
        
      return false;
    }
    
    // Make an API call to a protected route (e.g., a route that validates the token)
    // console.log(token);
    
    const response = await axios.post(`${API_URL}/auth/session-token`, 
        {},
        { 
            headers: {
            Authorization: `Bearer ${token}` // Send the token in the Authorization header
        }
    });
    // If the request is successful (status 200), the token is valid
    if (response.data.session === true) {
        
        return true;
    }
    
    // Any other response status means the token is not valid
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    return false;

  } catch (error) {
    // If there's an error (e.g., a 401 Unauthorized response from the server), the token is invalid or expired.
    console.error("Authentication failed:", error);
    // You might also want to remove the invalid token from storage here
    // localStorage.removeItem('userToken');
    // Por seguridad, elimina el token inválido o expirado
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY); 

    
    return false;
  }
};