import React from 'react';
import { Switch, Divider } from '@nextui-org/react';
import { Bar, getElementsAtEvent } from 'react-chartjs-2';
import { Image } from '@nextui-org/react';
import { useRef } from 'react';

const ConteoMedidores = ({ isLoading, isExclusive, setIsExclusive, chartData, setFilteredGatewayu}) => {

    const chartRef = useRef();

    return (
        <div className="flex col-span-5 w-full h-full px-5">
            <div className="flex flex-col bg-white w-full h-full shadow-2xl rounded-[20px]">
                <div className="flex place-items-center h-auto w-full px-5 py-1">
                    <Image
                        alt="medileser logo"
                        height={40}
                        radius="xs"
                        width={40}
                        src="/vite.svg" // Asegúrate de que la ruta de la imagen sea correcta
                    />
                    <div className="grid grid-cols-10 w-full h-full">
                        <div className="flex flex-col col-span-5">
                            <span className="ml-5 font-poppins font-regular text-gray-600 text-[20px]">
                                Cantidad de gateways operativos con recepción de lecturas
                            </span>
                            <span className="ml-5 font-poppins font-md text-gray-500 text-[15px]">
                                Equipo de medición Smart
                            </span>
                        </div>
                        <div className="flex place-items-center w-auto justify-end h-full col-span-5">
                            <span className="mr-3">Conteo exclusivo </span>
                            <Switch
                                isDisabled={isLoading}
                                onChange={() => setIsExclusive(prev => !prev)}
                                aria-label="Automatic updates"
                            />
                        </div>  
                    </div>
                </div>
                <Divider />
                <div className="flex w-full h-full">
                    {/* Gráfico de barras */}
                    <div className="p-5 w-full">
                        {chartData ? (
                            <Bar
                                data={chartData}
                                ref={chartRef}
                                onClick={(event) => {
                                    const chart = chartRef.current;
                                    if (!chart) return;
                            
                                    const elements = getElementsAtEvent(chart, event);
                            
                                    if (elements.length > 0) {
                                        const firstElement = elements[0];
                                        const datasetIndex = firstElement.datasetIndex;
                                        const index = firstElement.index;
                            
                                        const value = chartData.datasets[datasetIndex].data[index];
                                        const label = chartData.labels[index];
                                        
                                        setFilteredGatewayu(label)
                                        console.log("Etiqueta:", label);
                                        console.log("Valor:", value);
                                    }
                                }}
                                options={{
                                    responsive: true,
                                    indexAxis: 'y',
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                            position: "top",
                                        },
                                        title: {
                                            display: false,
                                            text: "Medidores Exclusivos por Gateway",
                                        },
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                font: {
                                                    size: 14, // Tamaño del texto de los gateway_id
                                                },
                                                maxRotation: 90, // Para evitar que el texto se sobreponga
                                                minRotation: 45,
                                            },
                                        },
                                        y: {
                                            ticks: {
                                                font: {
                                                    size: 8, // Tamaño del texto del eje Y
                                                },
                                            },
                                        },
                                    }
                                }}
                            />
                        ) : (
                            <p>Cargando gráfico...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConteoMedidores;
