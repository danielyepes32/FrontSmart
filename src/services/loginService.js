import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/'; // 3.135.197.152 Reemplaza con la URL de tu API

const login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}token/`,{
        username: username,
        password: password,
    },{
        withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

const refresh_token = async () => {
    try {
        const response = await axios.post(`${BASE_URL}token/refresh/`, {}, { withCredentials: true });

        console.log("respuesta del refresh: ", response);

        return response.data?.refreshed; // Usa el operador ?. para evitar errores si data es undefined
    } catch (error) {
        console.error("Error al refrescar el token:", error);
        return null;
    }
}


const call_refresh = async (error, func, ...args) => {
    if (error.response && error.response.status === 401) {
        const tokenRefreshed = await refresh_token();
        
        if (tokenRefreshed) {
            try {
                const retryResponse = await func(...args);
                console.log("Respuesta después del refresh:", retryResponse);  // Debug
                return retryResponse;  // Devuelve la respuesta completa
            } catch (retryError) {
                console.error('Error reintentando la solicitud:', retryError);
                return null;
            }
        } else {
            console.error('Error al refrescar el token.');
            return null;
        }
    } else {
        console.error('Error en la solicitud:', error);
        return null;
    }
};



export { login, refresh_token , call_refresh};
