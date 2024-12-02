import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const MapComponent = ({gatewaysData, metersData, loading}) => {
  useEffect(() => {
    // Inicializar el mapa
    const map = L.map('map').setView([-12.0164, -77.0628], 11);

    // Capa base del mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Validar y agregar círculos para gatewaysData
    if (Array.isArray(gatewaysData)) {
      gatewaysData.forEach((item) => {
        // Definir color dependiendo del online_status
        const gatewayColor = item.online_status ? '#008000' : '#FF0000'; // Verde si online_status es true, rojo si es false
        
        const circle = L.circle([item.latitude, item.longitude], {
          color: gatewayColor,
          fillColor: gatewayColor,
          fillOpacity: 0.4,
          radius: 2000,
        }).addTo(map);
        
        circle.bindPopup(`<div>${item.equip_id}</div>`);
      });
    } else {
      console.error('gatewaysData no es un array:', gatewaysData);
    }

    // Validar y agregar puntos de medición para metersData
    console.log("Empieza a cargar puntos de medidores");
    if (Array.isArray(metersData)) {
      metersData.map((item) => {
        if (item.latitude !== null && item.longitude !== null) {
          const circle = L.circle([item.latitude, item.longitude], {
            color: 'black',
            fillColor: '#ADD8E6',
            fillOpacity: 0.4,
            radius: 20,
          }).addTo(map);
          circle.bindPopup(`<div>${item.meter_code}</div>`);
        }
      });
    } else {
      console.error('meterData no es un array o está indefinido:', metersData);
    }
    console.log("Termina de cargar los puntos de medidores");

    // Cleanup del mapa cuando el componente se desmonta
    return () => {
      map.remove();
    };
  }, [gatewaysData, metersData]);

  // Mostrar el mapa si loading es false
  // agregar el siguiente classname para quitarlo mientras cargan los datos "${loading ? 'hidden':'block'}"
  return <div id="map" className={`h-full flex flex-col relative z-[0]`}></div>;
};

export default MapComponent;

