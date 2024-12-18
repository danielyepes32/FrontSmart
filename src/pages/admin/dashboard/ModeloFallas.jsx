import React, { useEffect, useState } from "react";
import apiService from "../../../services/apiService";
import { Switch, Divider, Image} from "@nextui-org/react";
import SearchFiltersCard from "../../../components/admin/GatewaysDashboard/ModeloFallas/FiltrosBusqueda";
import { DateTime } from 'luxon';
import {parseAbsoluteToLocal} from "@internationalized/date";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#AF19FF', '#FFC0CB', '#FF6347', '#40E0D0', 
    '#DA70D6', '#32CD32'
  ];

const ModeloFallas = ({ sidebar }) => {
    
    const [isLoading, setIsLoading] = useState(false) 
    const [isExclusive, setIsExclusive] = useState(false) 
    //Datos del gráfioco de barras
    const [chartData, setChartData] = useState(null);
    //Dato de error cargando los datos 
    const [error, setError] = useState(null)
    //Variable donde se guardan los datos de los gateways
    const [metersLength, setMetersLength] = useState(null);
    //Datos para el gráfico circular
    const [pieChartData, setPieChartData] = useState(null);
    //Aquí se almacena el gateway selecionadop en el autocomplete
    const [filteredGateway, setFilteredGatewayu] = useState(null)
    //Esta variable guarda los posibles valores de gateways recolectados en la API para los gateways en el autocomplete
    const [suggestions, setSuggestions] = React.useState([])
    //Constante para establecer si se esta ejecutando el autocomplete
    const [filterValue, setFilterValue] = React.useState("");
    //Este dato almacena el valor que se está escribiendo en las inputs para modificar la latitude
    //Esta variable se refiere a los diferentes tipos de tapas que se pueden seleccionar puesto que esta input es un selector, se inicializa con el valor inicial del medidor
    const [selectedKeys, setSelectedKeys] = React.useState(null);
    //Este dato almacena el valor que se está escribiendo en las inputs para modificar la longitude
    const [page, setPage] = React.useState(1);
    //Variable para establecer si está en uso el autocompletado
    //Esta variable se usa para guardar los creadores unicos

    const [animate, setAnimate] = useState(false);

    const [selectedCreators, setSelectedCreators] = React.useState(null)

    const [statusCreators, setFormattedCreators] = useState([]);
    //Variable para establecer el cambio de fechas seleccionadas en el filtro
    let [date, setDate] = React.useState({
        //Por default tiene el primer día del mes actual y de fin la fecha actual con zona horaria de perú
        start: parseAbsoluteToLocal(DateTime.now().setZone('America/Lima').startOf("month").toString()),
        end: parseAbsoluteToLocal(DateTime.now().setZone('America/Lima').toString()),
    });

    //Al cambiar el valor de la busqueda del autocomplete este se va actualizando en tiempo real con este callback
    const onSearchChange = React.useCallback((value) => {
        if (value) {
        setFilterValue(value);
        setPage(1);
        } else {
        setFilterValue("");
        }
        console.log("Valor autocomplete: ", value)
    }, []);

    //-------------------------------------------------------------------------------------
    //Fetch para traer los nombres de todos los creadores
    const fetchUniqueCreators = async () => {
        try {
        const response = await apiService.getCreator();
        const creators = response.unique_creators;

        // Formatear los datos
        return creators.map((creator) => (
                {
                    name: creator.toUpperCase(),
                    uid: creator,
                }
            ));
        } catch (error) {
        console.error('Error fetching unique creators:', error);
        return [];
        }
    };

    //Aqui se guardan los creadores unicos al ejecutar el fetch de arriba
    useEffect(() => {
        const getCreators = async () => {
        const creators = await fetchUniqueCreators();
        setFormattedCreators(creators);
        };

        getCreators();
    }, []);

    //----------------------------------------------------------------------------------------

    useEffect(() => { 
        const fetchData = async () => { 
            try { 
                const fecha_gte = `${date.start.year}${date.start.month < 10 ? `0${date.start.month}` : date.start.month}${date.start.day < 10 ? `0${date.start.day}` : date.start.day}`; 
                const fecha_lte = `${date.end.year}${date.end.month < 10 ? `0${date.end.month}` : date.end.month}${date.end.day < 10 ? `0${date.end.day}` : date.end.day}`; 
                
                const params = { 
                    start_date: fecha_gte, 
                    end_date: fecha_lte, 
                    creator: 'SEDAPAL CALLAO' // Ajusta el valor según sea necesario 
                }; 
                    
                    const responseData = await apiService.getConteoIncidencias(params); 
                    setChartData(responseData); 
            } catch (err) { 
                setError(err.message); 
            } 
        }; 
        
        fetchData(); 
    }, [date]); 
    
    const processedData = chartData ? chartData.map((item) => ({ 
        name: item.falla_desc, 
        value: item.total_incidencias 
    })) : null;

    const data = processedData
    ? {
        labels: processedData.map((d) => d.name),
        datasets: [
          {
            data: processedData.map((d) => d.value),
            backgroundColor: COLORS,
            borderColor: COLORS.map((color) => `${color}AA`), // Con transparencia
            borderWidth: 1,
          },
        ],
      }
    : null;

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Para ocupar el espacio del contenedor
        plugins: {
          legend: {
            position: 'right', // Mueve los labels a la derecha
            labels: {
              boxWidth: 20, // Ancho del cuadro de color
              boxHeight: 10, // Alto del cuadro de color
              padding: 15, // Espaciado entre labels
            },
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return `${value} incidencias`;
              },
            },
          },
        },
      };

    return (
        <div className={`pt-4 px-4 bg-gray-200 flex justify-center h-full flex-col col-span-7 block`}>
            <div className="w-full h-full grid grid-cols-9 space-x-4 rounded-[20px] items-center flex justify-center">
                <div className="flex flex-col col-span-6 h-full w-full">
                    <div className="rounded-[20px] pb-2 shadow-lg  mb-2 w-full bg-white h-1/2">
                        <div className="flex place-items-center h-auto w-full px-5 py-1">
                            <Image
                                alt="medileser logo"
                                height={40}
                                radius="xs"
                                width={40}
                                src="../../../public/vite.svg" // Asegúrate de que la ruta de la imagen sea correcta
                            />
                            <div className="grid grid-cols-10 w-full h-full">
                                <div className="flex flex-col col-span-5 w-full">
                                    <span className="ml-5 font-poppins font-regular text-gray-600 text-[20px]">
                                        Conteo de Medidores
                                    </span>
                                    <span className="ml-5 font-poppins font-md text-gray-500 text-[15px]">
                                        Equipo de medición Smart
                                    </span>
                                </div>
                                <div className="flex place-items-center w-auto justify-end h-full col-span-5">
                                </div>  
                            </div>
                        </div>
                        <Divider />
                        <div className="w-full h-1/2 py-7 flex justify-center items-center bg-white rounded shadow">
                            {error && <p>Error: {error}</p>}
                            {data ? (
                                <Doughnut data={data} options={options} />
                            ) : (
                                <p>Cargando datos...</p>
                            )}
                        </div>
                    </div>
                    <div className="rounded-[20px] pb-2 shadow-lg  mb-2 w-full bg-white h-1/2">
                        <div className="flex place-items-center h-auto w-full px-5 py-1">
                            <Image
                                alt="medileser logo"
                                height={40}
                                radius="xs"
                                width={40}
                                src="../../../public/vite.svg" // Asegúrate de que la ruta de la imagen sea correcta
                            />
                            <div className="grid grid-cols-10 w-full h-full">
                                <div className="flex flex-col col-span-5 w-full">
                                    <span className="ml-5 font-poppins font-regular text-gray-600 text-[20px]">
                                        Conteo de Medidores
                                    </span>
                                    <span className="ml-5 font-poppins font-md text-gray-500 text-[15px]">
                                        Equipo de medición Smart
                                    </span>
                                </div>
                                <div className="flex place-items-center w-auto justify-end h-full col-span-5">
                                </div>  
                            </div>
                        </div>
                        <Divider />
                    </div>
                </div>
                <div className="flex flex-col col-span-3 h-full">
                    <div className="rounded-[20px] shadow-lg mb-2 w-full bg-white h-full">
                        <SearchFiltersCard
                            suggestions={suggestions}
                            statusCreators={statusCreators}
                            setFilteredGatewayu={setFilteredGatewayu}
                            setDate={setDate}
                            date={date}
                            selectedKeys={selectedKeys}
                            setSelectedKeys={setSelectedKeys}
                            onSearchChange={onSearchChange}
                            setFilterValue={setFilterValue}
                        />
                    </div>
                    <div className="rounded-[20px]  pb-2 shadow-lg mb-2 w-full bg-white h-full">
                        <div className="flex place-items-center h-auto w-full px-5 py-1">
                            <Image
                                alt="medileser logo"
                                height={40}
                                radius="xs"
                                width={40}
                                src="../../../public/vite.svg" // Asegúrate de que la ruta de la imagen sea correcta
                            />
                            <div className="grid grid-cols-10 w-full h-full">
                                <div className="flex flex-col col-span-5 w-full">
                                    <span className="ml-5 font-poppins font-regular text-gray-600 text-[20px]">
                                        Conteo de Medidores
                                    </span>
                                    <span className="ml-5 font-poppins font-md text-gray-500 text-[15px]">
                                        Equipo de medición Smart
                                    </span>
                                </div>
                                <div className="flex place-items-center w-auto justify-end h-full col-span-5">
                                </div>  
                            </div>
                        </div>
                        <Divider />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModeloFallas;
