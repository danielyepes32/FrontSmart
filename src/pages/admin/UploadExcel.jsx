import React, { useState } from 'react';
import * as XLSX from 'xlsx';

// Función para convertir el número serial de Excel a una fecha válida
const convertExcelDateToJSDate = (serial) => {
    const excelEpoch = new Date(1900, 0, 1); // Fecha base de Excel (1 de enero de 1900)
    const daysOffset = serial - 1; // Ajuste para las fechas de Excel
    const jsDate = new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000); // Sumar los días a la fecha base
    return jsDate.toLocaleDateString(); // Convertir a una fecha legible (formato local dd/mm/yyyy)
};

const ExcelReader = () => {
    const [data, setData] = useState([]);  // Estado para almacenar los datos del Excel

    // Función para manejar la carga del archivo
    const handleFileUpload = (e) => {
        const file = e.target.files[0];  // Obtener el archivo seleccionado
        const reader = new FileReader();  // Crear un lector de archivos

        // Cuando el archivo se haya leído
        reader.onload = (event) => {
            const binaryStr = event.target.result;  // Obtener el contenido en binario del archivo
            const workbook = XLSX.read(binaryStr, { type: 'binary' });  // Leer el archivo Excel
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];  // Seleccionar la primera hoja del archivo
            const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });  // Convertir el contenido a JSON

            // Procesar y formatear los datos (convertir fechas si es necesario)
            const formattedData = excelData.map((row) =>
                row.map((cell) => {
                    if (typeof cell === 'number' && cell > 30000 && cell < 60000) { // Asumiendo que los números de fecha están en este rango
                        return convertExcelDateToJSDate(cell);  // Convertir los números seriales a fechas
                    }
                    return cell;  // Retornar la celda sin cambios si no es una fecha
                })
            );

            setData(formattedData);  // Almacenar los datos en el estado
        };

        reader.readAsBinaryString(file);  // Leer el archivo como cadena binaria
    };

    return (
        <>
        <div className={`p-4 bg-gray-200 flex h-full lg:h-screen flex-col col-span-6 overflow-auto block`}>
            <div className='h-full w-full flex bg-gray-200 grid grid-cols-5 gap-4 min-h-full'>
                <div className="col-span-5 bg-white w-full h-full">
                    <h1 className="text-2xl font-bold mb-4">Subir y Leer Archivo Excel</h1>
                    
                    {/* Input para seleccionar el archivo */}
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="mb-4 p-2 border"
                    />

                    {/* Mostrar los datos del Excel en una tabla */}
                    {data.length > 0 && (
                        <table className="min-w-full table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    {data[0].map((col, idx) => (
                                        <th key={idx} className="px-4 py-2 border border-gray-300 bg-gray-200">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(1).map((row, idx) => (
                                    <tr key={idx}>
                                        {row.map((cell, index) => (
                                            <td key={index} className="px-4 py-2 border border-gray-300">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ExcelReader;
