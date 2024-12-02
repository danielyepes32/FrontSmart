import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Divider } from '@nextui-org/react'; // Ajusta el import según tu configuración de proyecto

const ReadingCountPieChart = ({ pieChartData, setSelectedCreators }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "right",
            },
            title: {
                display: false,
                text: "Total de Lecturas por Gateway",
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const selectedLabel = pieChartData.labels[index];
                setSelectedCreators(selectedLabel);
                console.log(selectedLabel);
            }
        },
    };

    return (
        <div className="h-1/2 w-full bg-white shadow-xl rounded-[20px]">
            <div className="flex col-span-4 w-full h-full px-5">
                <div className="flex flex-col bg-white w-full h-full">
                    <div className="flex justify-start place-items-center h-auto w-full px-5 py-3">
                        <span className="font-poppins font-regular text-gray-600 text-[20px]">
                            Conteo de lecturas
                        </span>
                    </div>
                    <Divider />
                    <div className="p-5 w-full h-full">
                        {pieChartData ? (
                            <Pie data={pieChartData} options={chartOptions} />
                        ) : (
                            <p>Cargando gráfico circular...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadingCountPieChart;
