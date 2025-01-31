import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/';

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
    const response = axios.post(`${BASE_URL}token/refresh/`,{},
        {withCredentials: true

        }
    )

    return response.data.refreshed;
}

const call_refresh = async (error, func) => {
    if (error.response && error.response.status === 401) {
        const tokenRefreshed = await refresh_token();;

        if (tokenRefreshed){
            const retryResponse = await func();
            return retryResponse.data;
        }else{
            console.error('Error refreshing token');
        }

    }else{
        console.error('Error fetching data:', error);
    }
}

export { login, refresh_token , call_refresh};
