import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DateTime } from 'luxon'; // Importar Luxon
import apiService from '../../../services/apiService';

// Registro de los componentes de Chart.js necesarios
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ScatterPlot = ({selectedGateway}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de la 
        const response = await apiService.getGatewayLogs(selectedGateway.anchorKey);
        const data = response.results;
  
        // Hora actual y hace 24 horas
        const now = DateTime.now().setZone("America/Lima");
        const nextHour = now.plus({ hours: 1 }).startOf("hour");
        const twentyFourHoursAgo = nextHour.minus({ hours: 24 });
  
        // Generar etiquetas de horas para las últimas 24 horas
        const labels = Array.from({ length: 24 }, (_, i) =>
          twentyFourHoursAgo.plus({ hours: i }).toFormat("yyyy-MM-dd HH:00")
        );
  
        // Filtrar datos recientes
        const recentData = data.filter((log) => {
          const logTime = DateTime.fromISO(log.status_time).plus({hours: 5});
          return logTime >= twentyFourHoursAgo && logTime <= now;
        });
  
        console.log("RecentData", recentData);
  
        // Detectar si el último estado es "Online"
        const lastLog = recentData[recentData.length - 1];
        const lastStatus = lastLog ? lastLog.online_status : 0;
  
        const value = data.find(record => 
          DateTime.fromISO(record.status_time).plus({hours: 5}) <= twentyFourHoursAgo
        ) || null;        
        // Inicializar estado previo en "1" (encendido)
        let previousStatus = value ? value.online_status === true ? 1 : 0 : 1;

        // Construir datos del gráfico
        const onlineStatusData = labels.map((label, index) => {
          const labelTime = DateTime.fromFormat(label, "yyyy-MM-dd HH:00").toISO();
          const logForHour = recentData.find(
            (log) =>
              DateTime.fromISO(log.status_time)
                .plus({ hours: 5 }) // Suma 5 horas
                .toFormat("yyyy-MM-dd HH:00") === label
          );

          //console.log("logForHour", logForHour?.status_time, "labelTime", label);
  
          if (logForHour) {
            // Actualizar estado si hay un registro
            previousStatus = logForHour.online_status === true ? 1 : 0;
          }
          
          
          // Si el último registro es "Online" y la hora actual es posterior, mantenemos el estado "Online" (1)

  
          return previousStatus;
        });
  
        // Actualizar los datos del gráfico
        setChartData({
          labels,
          datasets: [
            {
              label: "Estado Online (1=Encendido, 0=Apagado)",
              data: onlineStatusData,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              fill: true,
              stepped: true, // Gráfico escalonado
            },
          ],
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
  
    selectedGateway != null ? fetchData() : null;
  }, [selectedGateway]);
  
  

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw === 1 ? 'Encendido' : 'Apagado'}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha y Hora',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Estado',
        },
        ticks: {
          callback: (value) => (value === 1 ? 'Encendido' : 'Apagado'),
          stepSize: 1,
          min: 0,
          max: 1,
        },
      },
    },
  };

  return (
    <div className="w-full h-full relative">
      <Line data={chartData} options={options} className="w-full h-full absolute" />
    </div>
  );
};

export default ScatterPlot;
