import axios from 'axios';
import {call_refresh} from './loginService';
const baseUrl = 'http://localhost:8000/api/v1/'; //3.135.197.152

const withRetry = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("Request cancelled:", error.message);
        return;
      }
      console.error("Error en la solicitud:", error);
      // Intentar refrescar el token si el error es 401
      const retryResult = await call_refresh(error, fn, ...args);

      // Si call_refresh no puede recuperar la solicitud, lanzamos el error para que el catch externo lo capture
      if (!retryResult) {
        throw error; // 🔥 Lanzar el error para que lo capture el catch en el componente
      }
      
      return retryResult;
    }
  };
};

//servicio para hacerle get a los valores de los medidores
const getAll = withRetry(async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(baseUrl+`meters?format=json&${queryString}`, {withCredentials: true});
    console.log(response.data);
    return response.data;
});

//servicio para hacerle get a los valores de los medidores
const getAllDescriptions = withRetry(async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`users/descriptions/?format=json&${queryString}`, {withCredentials: true});
  console.log(response.data);
  return response.data;
});

const createUser = withRetry(async (data) =>
  {
    console.log("Data: ", data)
    const response = await axios.post(baseUrl+`users/register/?format=json&`,data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log(response.data);
    return response.data;
  }
)

//servicio para hacerle get a los valores de los medidores
const getCountOnlineGateways = withRetry(async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(baseUrl+`gateways/count_gateways_online/?format=json&${queryString}`, {withCredentials: true});
    console.log(response.data);
    return response.data;
});

// Servicio para obtener datos del gateway
export const getGatewayData = async (endPoint, params, signal) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`${baseUrl}meters/${endPoint}/?${queryString}`, {
      signal: signal || undefined, // Pasar la señal de aborto
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.warn('Request cancelled:', error.message, signal);
    } else {
      console.error('Error fetching gateway data:', error);
    }
    if (!axios.isCancel(error)) {
      return refresh_token(error, getGatewayData);
    }
  }
};

export const getConteoIncidencias = withRetry(async (params) => { 
    const queryString = new URLSearchParams(params).toString(); 
    const response = await axios.get(`${baseUrl}incidencias/conteo-incidencias/?${queryString}`, {withCredentials: true}); 
    console.log(response.data); 
    return response.data;
});

// Servicio para descargar la plantilla
export const downloadTemplate = withRetry(async () => {
  const response = await axios.get(`${baseUrl}files/download-template/`, {
    responseType: 'blob', // Asegurar que el tipo de respuesta sea un blob
  },
  {
    withCredentials: true
  });

  return response.data; // Retorna el blob del archivo
});

// Servicio para crear una nueva incidencia
export const getIncidencia = withRetry(async (params) => {

  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`incidencias?format=json&${queryString}`, {withCredentials: true});
  console.log(response.data);
  return response.data;
});

//servicio para hacerle get a los valores de los medidores
const getAllAlarms = withRetry(async (params) => {

  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`alarms?format=json&${queryString}`, {withCredentials: true});
  console.log(response.data);
  return response.data;
});

//servicio para hacerle get a los valores de los medidores
const getAllCombined = withRetry(async (params) => {

  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`vista-combinada?format=json&${queryString}`, {withCredentials: true});
  console.log(response.data);
  return response.data;
});

//servicio para hacerle get a los valores de los medidores
const getCreator = withRetry(async () => {

  const response = await axios.get(baseUrl+'unique-creators/?format=json', {withCredentials: true});
  return response.data;
});

//servicio para hacerle get a los valores de los medidores
const getFallaType = withRetry(async () => {

  const response = await axios.get(baseUrl+'unique-falla-type/?format=json', {withCredentials: true});
  return response.data;
});

//servicio para hacerle get a los valores de los medidores
const getFallaDesc = withRetry(async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`unique-fallaDesc/?format=json&${queryString}`, {withCredentials: true});
  return response.data;
});

//servicio para hacerle get a los valores de los medidores
const getStatus = withRetry(async () => {
  const response = await axios.get(baseUrl+'unique-status/?format=json', {withCredentials: true});
  return response.data;
});

//servicio para hacerle post a un nuevo trigger del pipeline principal
export const postTrigger = withRetry(async (data) => {

  const response = await axios.post(baseUrl+'dags/STG4_MEDIDORES/dagRuns', data, {withCredentials: true});
  return response.data;

});

//servicio para hacerle post a un nuevo trigger del pipeline principal
export const postTriggerIncidencia = withRetry(async (data) => {

  const response = await axios.post(baseUrl+'dags/WF_INCIDENCIAS/dagRuns', data, {withCredentials: true});
  return response.data;
});

//Servicio para generar el autocomplete
const autocompleteMeters = async (params, signal) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(baseUrl+`meters/autocomplete/?format=json&${queryString}`,{
      signal: signal || undefined,
      withCredentials: true
    });
    console.log(response.data);
    return response.data;
};


//Servicio para generar el autocomplete
const autocompleteGateway = async (params, signal) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(baseUrl+`gateways/autocomplete-gateway/?format=json&${queryString}`,{
      signal: signal || undefined, // Pasar la señal de aborto
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.warn('Request cancelled:', error.message, signal);
    } else {
      console.error('Error fetching gateway data:', error);
    }
    if (!axios.isCancel(error)) {
      return refresh_token(error, autocompleteGateway);
    }
  }
};

//Servicio para generar el autocomplete
const autocompleteGatewayMysql = async (params, signal) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(baseUrl+`gateways/autocomplete-gateway-mysql/?format=json&${queryString}`,{
      signal: signal || undefined, // Pasar la señal de aborto
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.warn('Request cancelled:', error.message, signal);
    } else {
      console.error('Error fetching gateway data:', error);
    }
    if (!axios.isCancel(error)) {
      return refresh_token(error, autocompleteGatewayMysql);
    }
  }
};

//Servicio para generar el autocomplete de las alarmas
const autocompleteAlarms = withRetry(async (params) => {

  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`alarms/autocomplete-alarma/?format=json&${queryString}`);
  console.log(response.data);
  return response.data;
});

//Servicio para generar el autocomplete de las alarmas
const autocompleteCombined = async (params, signal) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(baseUrl+`autocomplete-combinada/?format=json&${queryString}`,{
      signal: signal || undefined,
      withCredentials: true
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.warn('Request cancelled:', error.message, signal);
    } else {
      console.error('Error fetching gateway data:', error);
    }
    if (!axios.isCancel(error)) {
      return refresh_token(error, autocompleteCombined);
    }
  }
};

//Servicio para generar las tapas Unicas
const getTapas = withRetry(async (params) => {

  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`unique-tapaDesc/?format=json&${queryString}`, {withCredentials: true});
  console.log(response.data);
  return response.data;
});

//Servicio para actualizar los valores de un medidor
export const updateMeter = withRetry(async (meterId, updates) => {

  const response = await axios.patch(`${baseUrl}meters/${meterId}/`, updates, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials:true
  });
  return response.data;
});

// Servicio para crear una nueva incidencia
export const postIncidencia = withRetry(async (data) => {

  const response = await axios.post(`${baseUrl}incidencias/`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });
  return response.data;
});

//Servicio para generar las tapas Unicas
const getGateways = withRetry(async (params) => {

  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`gateways/?format=json&${queryString}`,{withCredentials: true});
  console.log(response.data);
  return response.data;
});

//Servicio para generar las tapas Unicas
const getGatewaysMysql = withRetry(async (params) => {

  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`gateways/gateways_mysql/?format=json&${queryString}`,{withCredentials:true});
  console.log(response.data);
  return response.data;
});

// Servicio para crear una nueva incidencia
export const postGateways = withRetry(async (data) => {

  const response = await axios.post(`${baseUrl}gateways/`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });
  return response.data;
});

const getGatewayLogs = withRetry(async (equipId, params) => {

  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(baseUrl+`gateways/logs/${equipId}/?format=json&${queryString}`, {withCredentials:true});
  return response.data;
});


export default {
  getAllDescriptions,
  getGatewayLogs,
  postTriggerIncidencia, 
  getAll, 
  postTrigger, 
  getCreator, 
  autocompleteMeters, 
  getTapas, 
  updateMeter, 
  getStatus, 
  getAllAlarms, 
  getFallaType, 
  getFallaDesc, 
  autocompleteAlarms, 
  postIncidencia, 
  getGateways, 
  postGateways, 
  getAllCombined, 
  autocompleteCombined,
  getGatewaysMysql,
  autocompleteGateway,
  getIncidencia,
  getGatewayData,
  downloadTemplate,
  getConteoIncidencias,
  autocompleteGatewayMysql,
  getCountOnlineGateways,
  createUser
};
