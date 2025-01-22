import React, { useState } from 'react';
import axios from 'axios';
import { 
    Button,
    } from '@nextui-org/button';
import { FiUploadCloud } from "react-icons/fi";
import { SiMicrosoftexcel } from "react-icons/si";  // Icono de Excel
const socket = new WebSocket('ws://3.135.197.152:8001/ws/data/');
import apiService from '../../services/apiService';
import {     
    Card,
    CardBody,
    CardHeader,
    Divider,
    Image,
    Spinner
    } from '@nextui-org/react';
import CustomAlert from '../../components/admin/Shared/CustomAlert';
import { FcWorkflow } from "react-icons/fc";
import { LuWorkflow } from "react-icons/lu";
import { FaFileDownload } from "react-icons/fa";


const FileUpload = () => {
    const [logs, setLogs] = useState(''); 
    const [file, setFile] = useState(null); // Almacena el archivo seleccionado
    const [uploadProgress, setUploadProgress] = useState(0); // Progreso de la subida
    const [metersLength, setMetersLength] = useState(0);
    const [filepointer, setFilePointer] = useState(false);
    const [finishedLineData, setFinishedLineData] = useState({W:0});
    const [isVisible, setIsVisible] = useState(false)
    const [messageFetch, setMessageFetch] = useState('')
    const [loadingWf, setLoadingWf] = useState(false)
    const [logPointer, setLogPointer] = useState(false);
    // Manejar la selección del archivo
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Almacenar el archivo seleccionado
        setUploadProgress(0);  // Reiniciar el progreso cuando se selecciona un nuevo archivo
        setFilePointer(false)
    };

    socket.onmessage = function(event) {
        const logMessage = JSON.parse(event.data);

        logMessage.state === 'running' ? setLoadingWf(true) : setLoadingWf(false)

        setLogs(logMessage)

        const data = logMessage.content.split('\n')
        const filtered = data.filter(line => line.includes('FINAL_INCIDENCIAS'));

        const finished = filtered.find(line => line.includes('FINAL_INCIDENCIAS.0 - Finished processing'));

        if (finished) {
            // Extraer los valores de (I, O, R, W, U, E) utilizando una expresión regular
            const regex = /\(I=(\d+), O=(\d+), R=(\d+), W=(\d+), U=(\d+), E=(\d+)\)/;
            const matches = finished.match(regex);
      
            if (matches) {
              setFinishedLineData({
                I: matches[1],
                O: matches[2],
                R: matches[3],
                W: matches[4],
                U: matches[5],
                E: matches[6],
              });
            } else {
              setFinishedLineData({ error: 'No se encontraron los datos en el formato esperado.' });
            }
          } else {
            setFinishedLineData({ W: 0 });
        }

        // Aquí puedes mostrar el log en tu interfaz de usuario
    };

    // Enviar el archivo al backend
        const handleFileUpload = async () => {
            if (!file) {
                alert("Por favor selecciona un archivo");
                return;
            }

            const formData = new FormData();
            formData.append('file', file);  // Añadir el archivo al FormData

            try {
                // Realizar la petición POST al backend con el seguimiento del progreso de la subida
                const response = await axios.post('http://3.135.197.152:8000/api/v1/files/upload/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);  // Actualizar el progreso
                    },
                });
                setFilePointer(true)
                setIsVisible(true)  
                setMessageFetch('Archivo subido exitosamente');  

            } catch (error) {
                setIsVisible(true)  
                // El servidor respondió con un código de error
                console.error("Response data:", error.response.data);
                setMessageFetch('Archivo rechazado por el servidor');
            }
        };

        const getCurrentLocalISODate = () => {
            return new Date().toISOString();
          };

        const handleButtonClick = async () => {
            setLogPointer(true)
            const formData = {
              conf: {},
              dag_run_id: 'AplicationRun-' + getCurrentLocalISODate(),
              data_interval_end: getCurrentLocalISODate(),
              data_interval_start: getCurrentLocalISODate(),
              logical_date: getCurrentLocalISODate(),
              note: 'string',
            };
          
            try {
              const res = await apiService.postTriggerIncidencia(formData);
              console.log(res)
              //setResponse(res);
              //setError(null);
              //res === undefined ? null : onOpen()
            } catch (err) {
              //setError(err);
              //setResponse(null);
              console.error(err)
            }
          };
    // Verificar si el archivo es un Excel
    const isExcelFile = file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'));
    
    const PopUpCustomAlert = React.useMemo(()=>{
        return(
            <>
            <CustomAlert 
                message = {messageFetch}
                isVisible = {isVisible}
                setIsVisible = {setIsVisible}
                />
            </>
        )
    },[isVisible])

    const handleDownload = async () => {
        try {
          const blob = await apiService.downloadTemplate();
          const url = window.URL.createObjectURL(blob);
    
          // Crear un enlace para forzar la descarga
          const a = document.createElement('a');
          a.href = url;
          a.download = 'PLANTILLA-INCIDENCIAS.xlsx'; // Nombre del archivo
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error al descargar el archivo:', error);
        }
      };

    return (
        <>
        <div className={`p-4 bg-gray-200 flex h-full lg:h-screen flex-col col-span-6 overflow-auto block`}>
            <div className={`${isVisible ? 'block': 'hidden'} relative z-[100]`}>
                {PopUpCustomAlert}
            </div>
            <div className='h-full w-full flex bg-gray-200 grid grid-cols-5 gap-4 min-h-full'>
                <div className="col-span-5 bg-white w-full h-full border-b border-gray-300 rounded-[20px]">
                    <div className='justify-center place-items-center p-4 h-full flex flex-col'>
                        <div className='border-b border-gray-300 flex'>
                            <h1 className="w-full text-2xl font-poppins font-regular text-gray-600">Cargar archivo de incidencias</h1>
                        </div>
                        <div className='w-full flex justify-end place-items-right px-24'>
                            <div className='flex flex-col justify-center place-items-center'>
                                <span className='text-right'>Descargar plantilla</span>
                                <Button 
                                    className='text-right flex mt-1 bg-custom-blue'
                                    isIconOnly={true}
                                    onClick={handleDownload}
                                    >
                                    <FaFileDownload className='text-white w-full h-4/6'/>
                                </Button>
                            </div>
                        </div>
                        <div className='py-6 px-10 w-full h-2/5 grid grid-cols-5'>
                            <div className='w-full h-full mx-auto place-items-center border-2 border-dashed border-gray-300 rounded-2xl shadow-medium'>
                                <div className="w-full h-full flex justify-center items-center ">
                                    {/* Input de archivo escondido */}
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="flex inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    
                                    {/* Botón personalizado con el SVG */}
                                    <div className='fixed'>
                                        <div
                                            type="button"
                                            className="flex items-center justify-center bg-custom-blue text-white px-4 py-2 rounded-lg z-[-20]"
                                            disabled
                                        >
                                            <FiUploadCloud className="w-6 h-6 mr-2" />
                                            Seleccionar archivo
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full h-full px-10 col-span-4'>
                                <div className='border border-gray-300 h-full px-5 rounded-2xl flex place-items-center bg-content1 shadow-medium'>
                                    <div className='w-full'>
                                        <div className='border-b border-gray-300 flex place-items-center py-2'>
                                            <h1 className="text-xl font-poppins font-regular text-gray-400">Archivos subidos</h1>
                                        </div>
                                        <div className='h-auto my-auto w-full px-10 py-4 rounded-2xl flex justify-center place-items-center items-center'>
                                        {/* Mostrar el nombre del archivo seleccionado */}
                                        {file && (
                                            <div className="text-gray-600 flex items-center">
                                                {isExcelFile && (
                                                    <SiMicrosoftexcel className="w-6 h-6 text-green-600 mr-2" />
                                                )}
                                                <p>Archivo seleccionado: <span className="font-bold">{file.name}</span></p>
                                            </div>
                                        )}

                                        {/* Barra de progreso */}
                                        {file && (
                                            <div className="w-full bg-gray-300 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-500 h-2.5 rounded-full"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                                <p className="text-sm text-gray-600">{uploadProgress}% completado</p>
                                            </div>
                                        )}
                                        
                                        </div>
                                        <div className='w-full px-10 py-4 flex'>
                                            <Button
                                                onClick={handleFileUpload}
                                                className="bg-custom-blue text-white px-10 w-full py-2 rounded-2xl"
                                            >
                                                Subir archivo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full h-1/2'>
                            <div className='w-full h-1/6 px-10'>
                                <div className='border-b-2'>
                                    <h1 className="text-xl font-poppins font-regular text-gray-400">Ejecutar cargue de incidencias</h1>
                                </div>
                            </div>
                            <div className='w-full h-5/6 grid grid-cols-6 px-10'>
                                <div className='h-full flex justify-center items-center'>
                                    <div className="flex flex-col space-y-4 w-full px-2">
                                        <div className="text-default-500 text-lg text-center">Oprima para ejecutar el workflow</div>
                                        <Divider className='w-full '></Divider>
                                        <div className="justify-center w-full flex">
                                            <Button
                                                className='w-full bg-custom-blue text-white'
                                                onClick={handleButtonClick}
                                                isDisabled={!filepointer}
                                                >
                                                WF INCIDENCIAS
                                                <LuWorkflow />
                                            </Button>
                                        </div>
                                        <Divider className='w-full '></Divider>
                                        <div className={`text-center ${!filepointer ? 'text-red-300': 'text-gray-400'}`}>{filepointer ? 'Botón habilitado': 'Seleccione un archivo para habilitar'}</div>
                                    </div>
                                </div>
                                <div className='h-full col-span-2 px-2'>
                                    <div className='h-full'>
                                        <div className='bg-white h-full rounded-[20px] flex flex-col'>
                                            <Card 
                                                className="w-full h-full margin-auto"
                                                isDisabled={!filepointer}
                                                >
                                                <CardHeader className="flex gap-3 h-1/9 py-2.5">
                                                    <Image
                                                        alt="medileser logo"
                                                        height={40}
                                                        radius="xs"
                                                        width={40}
                                                        src='../../../public/vite.svg'
                                                    />
                                                    <div className="flex flex-col">
                                                        <p className="text-md">Último cargue ejecutado</p>
                                                    <p className="text-small text-default-500">Equipo de medición smart</p>
                                                    </div>
                                                </CardHeader>
                                                <Divider/>
                                                <CardBody 
                                                    className='h-4/6 flex justify-center'
                                                    >
                                                    <div className='px-4'>
                                                        <span className='text-[56px] text-black font-poppins font-regular'>
                                                            {React.useMemo(() => {
                                                                console.log(finishedLineData.W)
                                                                return parseInt(finishedLineData.W);
                                                            }, [finishedLineData])//Se ejecuta cada que hay un cambio en la constante vsisibleColumns
                                                            }
                                                        </span>
                                                        <span  
                                                            className='px-1'
                                                            >
                                                            INCIDENCIAS
                                                        </span>
                                                    </div>
                                                    <div className='w-full px-4'>
                                                    {/*
                                                    <Chip 
                                                        color="success"
                                                        className='w-full'
                                                        >
                                                        Operativos
                                                    </Chip>
                                                    */}
                                                    </div>
                                                    <p className='text-left px-4 py-2'>Total de incidencias cargadas al sistema en el último cargue</p>
                                                </CardBody>
                                                <Divider/>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                                <div className='h-full col-span-3 px-2 mr-7'>
                                    <div className='bg-white h-full rounded-[20px] flex flex-col'>
                                            <Card 
                                                className="w-full h-full margin-auto"
                                                isDisabled={!filepointer}
                                                >
                                                <CardHeader className="flex gap-3 h-1/9 py-2.5">
                                                    <Image
                                                        alt="medileser logo"
                                                        height={40}
                                                        radius="xs"
                                                        width={40}
                                                        src='../../../public/vite.svg'
                                                    />
                                                    <div className="flex flex-col w-full">
                                                        <div className='grid grid-cols-8'>
                                                            <div className='col-span-6'>
                                                                <div className="text-md">Logs de la ejecución</div>
                                                                <p className="text-small text-default-500">Equipo de medición smart</p>
                                                            </div>
                                                            <div className='flex items-center justify-center col-span-2'>
                                                                <Spinner    
                                                                    size='md'
                                                                    label='Ejecutando'
                                                                    className={` ${loadingWf ? 'block' : 'hidden'}`}
                                                                    classNames={{
                                                                        base: 'px-4',
                                                                        wrapper: 'mx-auto'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <Divider/>
                                                <CardBody 
                                                    className='h-4/6 flex justify-center'
                                                    >
                                                    <div className='px-2 static overflow-auto text-left px-4 py-2 text-black h-[25vh]'>
                                                        {filepointer && logPointer? 
                                                            logs.content : 
                                                            <div className='h-full w-full text-2xl text-default-500 place-items-center'>
                                                                <div className='flex items-center justify-center h-1/2 w-full'>
                                                                        <span className='px-2 text-center'>Porfavor seleccione y ejecute el workflow para ver los logs</span>
                                                                </div>
                                                                <div className='flex justify-center w-full'>
                                                                    <FcWorkflow />
                                                                </div>
                                                            </div>
                                                            }
                                                    </div>    
                                                </CardBody>
                                                <Divider/>
                                            </Card>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default FileUpload;

