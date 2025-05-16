import React, { useEffect, useMemo, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import apiService from "../../../services/apiService";
//Libreria para hacer un parse a los datos de tipo fecha
//Importar luxon para poder agregar zona horaria a un dato de tipo Fecha
import { DateTime } from 'luxon';
import {parseAbsoluteToLocal} from "@internationalized/date";
import ConteoMedidores from "../../../components/admin/GatewaysDashboard/ConteoMedidores";
import GatewayCard from "../../../components/admin/GatewaysDashboard/GatewayCard";
import SearchFiltersCard from "../../../components/admin/GatewaysDashboard/FiltrosBusqueda";
import ReadingCountPieChart from "../../../components/admin/GatewaysDashboard/ReadingCountPieChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const GatewayDashboard = ({ sidebar }) => {
    
    const [isLoading, setIsLoading] = useState(false) 
    const [isExclusive, setIsExclusive] = useState(false) 
    //Datos del gráfioco de barras
    const [chartData, setChartData] = useState(null);
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
    const [selectedKeys, setSelectedKeys] = React.useState([]);
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

    // Detecta el cambio en metersLength y activa la animación
    useMemo(() => {
        // Activa la animación
        setAnimate(true);

        // Remueve la animación después de 500ms
        const timeout = setTimeout(() => {
            setAnimate(false);
        }, 500); // Duración de la animación

        // Limpia el timeout al desmontar
        return () => clearTimeout(timeout);
    }, [metersLength]);

    //Al cambiar el valor de la busqueda del autocomplete este se va actualizando en tiempo real con este callback
    const onSearchChange = React.useCallback((value) => {
        if (value) {
        setFilterValue(value);
        setPage(1);
        } else {
        setFilterValue("");
        }
        //console.log("Valor autocomplete: ", value)
    }, []);

    // Función para convertir un nombre en formato UID
    const convertToUID = (name) => {
        return name;
    };
    //--------------------------------------------------------------------------------------------------------------
    //Funciones condicionales 
    React.useEffect(() => {
      if (filterValue.length > 0) {
        const controller = new AbortController();
        const signal = controller.signal;
    
        const fetchSuggestions = async () => {
          try {
            const params = {
              q: filterValue,
              page: 1,
              page_size: 10,
            };
    
            const response = await apiService.autocompleteGateway(params, signal);
            setSuggestions(response["results"]);
          } catch (error) {
            if (error.name !== "AbortError") {
              console.error("Error fetching initial meters:", error);
            }
          }
        };
    
        // Ejecutar la consulta
        fetchSuggestions();
    
        // Retornar una función de limpieza que cancela la solicitud activa
        return () => {
          controller.abort();
        };
      }
    }, [filterValue, page]);
    

    //Fetch para traer los nombres de todos los creadores
    const fetchUniqueCreators = async () => {
        try {
        const response = await apiService.getCreator();
        const creators = response.unique_creators;

        // Formatear los datos
        return creators.map((creator) => (
                {
                    name: creator.toUpperCase(),
                    uid: convertToUID(creator),
                }
            ));
        } catch (error) {
        console.error('Error fetching unique creators:', error);
        return [];
        }
    };

    //Aqui se guardan los creadores unicos al ejecutar el fetch de arriba
    useMemo(() => {
        const getCreators = async () => {
        const creators = await fetchUniqueCreators();
        setFormattedCreators(creators);
        };

        getCreators();
    }, []);


    useEffect(() => {
      //console.log("Entra");
    
      const controller = new AbortController();
      const signal = controller.signal;
    
      const fetchData = async () => {
        try {
          const fecha_gte = `${date.start.year}${date.start.month < 10 ? `0${date.start.month}` : date.start.month}${date.start.day < 10 ? `0${date.start.day}` : date.start.day}`;
          const fecha_lte = `${date.end.year}${date.end.month < 10 ? `0${date.end.month}` : date.end.month}${date.end.day < 10 ? `0${date.end.day}` : date.end.day}`;
    
          // Crear los parámetros de consulta
          const params = new URLSearchParams();
          params.append("start_date", fecha_gte);
          params.append("end_date", fecha_lte);
    
          if (selectedKeys) {
            const serviceCentersArray = Array.from(selectedKeys);
            serviceCentersArray.forEach((center) => params.append("service_centers", center));
          }
    
          const endPoint = isExclusive ? 'exclusivos-por-gateway' : 'no-exclusivos-por-gateway';
    
          setIsLoading(true);
    
          const data = await apiService.getGatewayData(endPoint, params, signal);
          //console.log("EndPoint: ", data);
    
          // Procesar los datos (se mantiene la misma lógica que antes)
          const metersLength = Array.isArray(data) && data.length > 0
            ? filteredGateway
              ? data.find((item) => item.gateway_id === filteredGateway)?.total_lecturas || 0
              : data[0].total_lecturas
            : 0;
    
          setMetersLength(metersLength);
    
          if (!data) return;
    
          const groupedData = data.reduce((acc, item) => {
            const { service_center, total_lecturas } = item;
            if (!acc[service_center]) {
              acc[service_center] = {
                service_center,
                total_lecturas: 0,
                gateways: [],
              };
            }
            acc[service_center].total_lecturas += total_lecturas;
            acc[service_center].gateways.push(item.gateway_id);
            return acc;
          }, {});
    
          const groupedArray = Object.values(groupedData);
          const labels = groupedArray.map((item) => item.service_center);
          const totalLecturas = groupedArray.map((item) => item.total_lecturas);
    
          const colorMap = labels.reduce((acc, center, index) => {
            acc[center] = `hsl(${(index * 360) / labels.length}, 70%, 50%)`;
            return acc;
          }, {});
    
          const pieColors = labels.map((center) => colorMap[center]);
    
          setPieChartData({
            labels: labels,
            datasets: [
              {
                label: "Total de Lecturas",
                data: totalLecturas,
                backgroundColor: pieColors,
                hoverOffset: 4,
              },
            ],
          });
    
          const filteredData = selectedCreators
            ? data.filter((item) => item.service_center === selectedCreators)
            : data;
    
          const labelsBar = filteredData.map((item) => item.gateway_id);
          const medidoresExclusivos = filteredData.map((item) => item.medidores_exclusivos);
    
          setChartData({
            labels: labelsBar,
            datasets: [
              {
                label: "Medidores Exclusivos",
                data: medidoresExclusivos,
                backgroundColor: "rgba(191, 219, 254, 1)",
                borderColor: "rgba(191, 219, 254, 0.6)",
                borderWidth: 1,
              },
            ],
          });
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error fetching data:", error);
          }
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchData();
    
      return () => {
        //console.log("Abortando petición");
        controller.abort();
      };
    }, [date, filteredGateway, selectedCreators, selectedKeys, isExclusive]);
    
    

    //console.log("SelectedExclusive: ", isExclusive)
    selectedKeys ? selectedKeys.forEach(value => {
        //console.log(value); // Imprime cada valor del Set
    }) : null;

    const handleOnclickCleanFilter  = () => {
        setSelectedKeys(null)
        setSelectedCreators(null)
        setFilterValue("")
        setFilteredGatewayu(null)
    }

    return (
        <div className={`p-4 bg-gray-200 flex h-full w-full flex-col col-span-6 block`}>
            <div className="w-full h-full grid grid-cols-9 rounded-[20px] items-center flex justify-center">
                <ConteoMedidores 
                    isLoading={isLoading}
                    isExclusive={isExclusive}
                    setIsExclusive={setIsExclusive}
                    chartData={chartData}
                    setFilteredGatewayu = {setFilteredGatewayu}
                />
                <div className="flex col-span-4 w-full h-full">
                    <div className="flex flex-col w-full h-full">
                        <div className="w-full flex grid grid-cols-9 mb-2">
                            <GatewayCard
                                isLoading = {isLoading}
                                metersLength={metersLength}
                                animate={animate}
                                handleOnclickCleanFilter={handleOnclickCleanFilter}
                            />
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
                        <ReadingCountPieChart 
                            pieChartData={pieChartData} 
                            setSelectedCreators={setSelectedCreators} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GatewayDashboard;
