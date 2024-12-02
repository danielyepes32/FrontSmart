// TableTopContent.jsx
import React from 'react';
import apiService from '../../../../services/apiService';
//import {useState, /*useEffect*/} from 'react'
import {useDisclosure} from "@nextui-org/react";
import DropdownPanel from '../TopContentComponents/FilterSection/DropdownPanel';
//import {parseAbsoluteToLocal} from "@internationalized/date";
import { DateTime } from 'luxon';
import AddIncidenciaModal from '../TopContentComponents/Modal/AddIncidenciaModal';
import FilterSearchAndDatePicker from '../TopContentComponents/FilterSection/SelectionInput';
import PaginationInfo from '../TopContentComponents/FilterSection/PaginationInfo';

const data = [
  { name: 'MEDIDOR MECANICO', uid: 'MEDIDOR MECANICO', filter: 'manipulacion', id: 12},
  { name: 'NIPLE CAJA VACIA', uid: 'NIPLE CAJA VACIA', filter: 'manipulacion', id: 13 },
  { name: 'NO SE UBICA', uid: 'NO SE UBICA', filter: 'inaccesible', id: 11 },
  { name: 'DIFICIL ACCESO', uid: 'DIFICIL ACCESO', filter: 'inaccesible', id: 10 },
  { name: 'INUNDADO', uid: 'INUNDADO', filter: 'externo', id: 9 },
  { name: 'VANDALIZADO', uid: 'VANDALIZADO', filter: 'externo', id: 8 },
  { name: 'DISPLAY APAGADO', uid: 'DISPLAY APAGADO', filter: 'interno', id: 6 },
  { name: 'TEMPERATURA', uid: 'TEMPERATURA', filter: 'interno', id: 4 },
  { name: 'FLUJO INVERSO', uid: 'FLUJO INVERSO', filter: 'interno', id: 3 },
  { name: 'AIRE EN TUBERIA', uid: 'AIRE EN TUBERIA', filter: 'interno', id: 1 },
  { name: 'DIGITOS INCOMPLETOS', uid: 'DIGITOS INCOMPLETOS', filter: 'interno', id: 7 },
  { name: 'FUGA DE AGUA', uid: 'FUGA DE AGUA', filter: 'interno', id: 5 },
  { name: 'FALLO DE FLUJO', uid: 'FALLO DE FLUJO', filter: 'interno', id: 2 },
  { name: 'PROBLEMA DE MEMORIA', uid: 'PROBLEMA DE MEMORIA', filter: 'interno', id: 15 },
  { name: 'ESTADO DE COMUNICACION', uid: 'ESTADO DE COMUNICACION', filter: 'interno', id: 16 },
  { name: 'BATERIA BAJA', uid: 'BATERIA BAJA', filter: 'interno', id: 17 },
  { name: 'FALLO SENSOR DE TRANSMISION', uid: 'FALLO SENSOR DE TRANSMISION', filter: 'interno', id: 14 },
  { name: 'FALLO SENSOR DE TEMPERATURA', uid: 'FALLO SENSOR DE TEMPERATURA', filter: 'interno', id: 18 },
  { name: 'APERTURA DE TAPA', uid: 'APERTURA DE TAPA', filter: 'interno', id: 19 }
];

export default function TableTopContent({
    filterValue,
    onSearchChange,
    setFilterValue,
    statusFilter,
    setStatusFilter,
    statusSelection,
    setStatusSelection,
    statusOptions,
    visibleColumns,
    setVisibleColumns,
    columns,
    date,
    setDate,
    usersLength,
    onRowsPerPageChange,
    dataStatusOptions,
    haFilterSelect,
}) {
  //Variables del componente-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------
  //Aqui se establece el valor para saber si se activa o no la ventana emergente
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  //Esta variable guarda la validacion para evitar que se realizen consultas sin seleccionar un campo a modificar en el medidor
  const [isInvalid, setIsInvalid] = React.useState(true);
  //Esta variable guarda un arreglo con los valores seleccionados a modificar en el medidor (latitude, longitude y tapa_desc)
  const [selectedModify, setSelectedModify] = React.useState([])
  //Variable para establecer el encargado en el formulario de incidencia
  const [encargado, setEncargado] = React.useState(null)
  //Esta variable guarda los posibles identificadores del medidor que se quiere establecer en el autocomplete del modal
  const [suggestions, setSuggestions] = React.useState([])
  //Esta variable se refiere a los diferentes tipos de fallas que se pueden seleccionar puesto que esta input es un selector
  const [selectedKeys, setSelectedKeys] = React.useState(null);
  //Este dato almacena el valor que se está escribiendo en las input del autocomplete
  const [searchValue, setSearchValue] = React.useState('');
  //Este dato almacena la página en la que nos encontramos ahora
  const [page, setPage] = React.useState(1);
  //Se almacena el archivo de la imagen seleccionada en el modal de incidencia en forma de ruta temporal para ser previsualizado
  const [image, setImage] = React.useState(null);
  //Aquí se guarda la imagen en un archivo base64
  const [imageFile, setImageFile] = React.useState(null); // Estado para el archivo de la imagen
    
  //-------------------------------------------------------------------------------------------------------------
  //Funciones del componente----------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------

  //Se ejecuta un effect cada que se modifica la selección del radioGroup en el modal modificando los campos se fallas para el dropdown
  React.useEffect(() => {

    //En caso de que la selección del modify sea mayor a 0, es decir que deje de ser nula
    if (selectedModify.length > 0) {
      //filtrar los datos del campo data solamente con los valores que correspondan con el filtro
      const filteredItems = data.filter(item => item.filter === selectedModify);
  
      if (filteredItems.length > 0) {
        setSelectedKeys(filteredItems[0].name); // Asigna el primer valor encontrado
      }
    }
  }, [selectedModify]);

  //Se ejecuta un effect para cargar las posibles sugerencias del autocomplete para el medidor a cargar la incidencia
  React.useEffect(() => {
    //Al estar ejecutando el fetch activamos el loading de la data
    //El llamado a la API se ejecuta solo cuando cambia el valor del input deja de ser null o empty
    if (searchValue.length > 0) {
      //setIsLoading(true);
      //Función para hacer llamado a la API
      const fetchSuggestions = async () => {
        try {
        //inizializamos los parametros de consultas a la API de consumo
        const params = {
          q: searchValue, //Parametro a comparar para buscar coincidencias
          page:1, //La API trae los datos de manera paginada, aquí se establece que se quiere solo la p´rimer página
          page_size : 10 //Además solo trae las primeras 10 coincidencias
        };
        const response = await apiService.autocompleteMeters(params);
        //Guardamos las sugerencias con un useState en suggestions
        setSuggestions(response["results"]);
        } catch (error) {
        //En caso de error en el llamado a la API se ejecuta un console.error
        console.error('Error fetching initial meters:', error);
        } finally {
        //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
        //console.log("salio");
        }
      };
      //Se ejecuta la función luego de ser declarado en el effect puesto que es una función asincronica
      fetchSuggestions();
    }
  }, [searchValue]); //Se ejecuta siempre qeu cambie el valor de busqueda en el Autocomplete


  //Función asincrónica para hacer llamado a la API y crear una incidencia
  const handleCreateIncidencia = async () => {
    // Crea el objeto incidencia basado en la lógica proporcionada
    const fechaActual = DateTime.now().setZone('America/Lima');
    const meterCode = searchValue; // Este es un ejemplo, asegúrate de obtener este valor dinámicamente



    // Validación de los parámetros necesarios
    if (!selectedKeys) {
      alert("Error: El 'anchorKey' de selectedKeys es necesario.");
      return;
    }

    const falloRegistro = data
                          .filter((falla)=> falla.name === selectedKeys.anchorKey)
                          .map((record) => record.id); // Extrae el campo 'id' de los registros filtrados // Este es un ejemplo, asegúrate de obtener este valor dinámicamente
    const falloId = falloRegistro[0]

    if (!meterCode) {
      alert("Error: El 'meterCode' es necesario.");
      return;
    }

    if (!falloId) {
      alert("Error: El 'falloId' no está definido.");
      return;
    }

    if (!imageFile) {
      alert("Error: La imagen en base64 es necesaria.");
      return;
    }

    if (!encargado) {
      alert("Error: El encargado debe estar definido.");
      return;
    }

    // Eliminar el prefijo 'data:image/png;base64,' si está presente
    const base64Data = imageFile.split(',')[1]; // Esto elimina el prefijo

    //Parametros necesarios para la creación de la incidencia
    const incidenciaData = {
      //ID de la incidencia compuesto por IDENTIFICADO + FECHA + FALLOID
      incidencia_id: `${meterCode}${fechaActual.toFormat('yyyyMMdd')}${falloId}`,
      //Identificador del medidor
      meter_code: meterCode,
      //Fecha de la incidencia
      fecha_incidencia: fechaActual.toFormat('yyyy-MM-dd HH:mm:ss'),
      //Identificador de la falla
      falla: falloId,
      //Encargado de reportar la falla
      encargado: encargado,
      //Imagen de la incidencia en base 64
      img: base64Data,
    };

    console.log("Datos incidencia: ",incidenciaData)

    try {
      const newIncidencia = await apiService.postIncidencia(incidenciaData);
      console.log('Nueva incidencia creada:', newIncidencia);
      alert("Nueva incidencia insertada para el medidor ", newIncidencia.meter_code)
      // Aquí puedes manejar el éxito de la creación, como mostrar una notificación o actualizar el estado
    } catch (error) {
      console.error('Error al crear incidencia:', error);
      if(error.incidencia_id){
        alert("Inserción cancelada, ese identificador ya existe")
        console.log(error.incidencia_id)
      }else{
        alert("Error al crear la incidencia")
        console.log("Otro error")
      }
      // Maneja el error, como mostrar un mensaje de error
      } finally {
    }
  };
  //Fin de la función de creación de incidencias

  //Al cambiar el valor de la busqueda del autocomplete este se va actualizando en tiempo real con este callback
  const onAutocompleteChange = React.useCallback((value) => {
    if (value) {
      setSearchValue(value);
      setPage(1);
    } else {
      setSearchValue("");
    }
  }, []);

  //Función para obtener la imagen del modal
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result); // Establecer la imagen en base64
        setImage(URL.createObjectURL(file)); // Establecer la previsualización
      };
      reader.readAsDataURL(file); // Lee el archivo como base64
    } else {
      alert('Por favor, selecciona un archivo de imagen válido');
    }
  };
  //------------------------------------------------------------------------------------------------------------------------
  // Dividir el arreglo en dos partes
  const midIndex = Math.ceil(dataStatusOptions.length / 2);
  const firstColumn = dataStatusOptions.slice(0, midIndex);
  const secondColumn = dataStatusOptions.slice(midIndex);

  //-----------------------------------------------------------------------------------------------------------------------
  // Componentes reenderizados de manera externa

  //Componente modal para el cargue de incidencias
  const Modal = React.useMemo(()=>{
    return (
      <AddIncidenciaModal
        isOpen={isOpen} //Está el modal abierto
        onOpenChange={onOpenChange} //Se ha ejecutado un cambio en la visibilidad del modal
        suggestions={suggestions} //Sugerencias del autocmplete de la incidencia
        data={data} // Proporciona datos de las fallas
        handleImageChange={handleImageChange} //Carga de la imagen
        image={image} //Imagen temporal para previsualizar
        setEncargado={setEncargado} //state para cambiar el valor de encargado
        encargado={encargado} //Valor del encargado de cargar esa incidencia
        handleCreateIncidencia={handleCreateIncidencia} //Función para crear la incidencia
        selectedModify={selectedModify} //Selección del tipo de falla en el radioGroup
        setSelectedModify={setSelectedModify} //Cambiar la selección
        selectedKeys={selectedKeys} //Valor seleccionado de falla
        setSelectedKeys={setSelectedKeys} //Cambiar el valor de falla seleccionada
        isInvalid={isInvalid} //Invalidar en caso de no seleccionbar algun valor en el radioGroup
        setIsInvalid={setIsInvalid} //Cambiar el estado de validación
        onAutocompleteChange={onAutocompleteChange} //En caso de que cambie el valor del autocomplete
        dataStatusOptions={dataStatusOptions} //Posibles fallas en el dropdown
      />
    )
  },[isOpen, selectedModify, selectedKeys, suggestions, image, encargado])  

  return (
    //Contenedor del area de los filtros y la sección con los datos de paginado
    <div className="flex flex-col gap-4">
      {/*Contenedor de los datos de filtrado*/}
      <div className="flex justify-between items-end">
        {Modal} {/*El Modal solo se reenderiza en las condiciones del useMemo()*/}
        <div className="flex flex-col md:flex-row md:justify-start sm:justify-start sm:flex-row items-center w-full justify-between min-h-full sm:space-x-2 sm:space-y-0">
          {/*Aquí se configura el autocomplete*/}
          <FilterSearchAndDatePicker
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            onSearchChange={onSearchChange}
            haFilterSelect={haFilterSelect}
            date={date}
            setDate={setDate}
          />
          <DropdownPanel
            statusSelection={statusSelection}
            setStatusSelection={setStatusSelection}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            onOpen={onOpen}
            firstColumn={firstColumn}
            secondColumn={secondColumn}
            statusOptions={statusOptions}
            columns={columns}
          />
        </div>
      </div>
      <PaginationInfo
        usersLength={usersLength}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
}
