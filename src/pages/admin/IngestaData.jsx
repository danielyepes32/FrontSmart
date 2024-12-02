//Librería De servicios integrados de react
import React from "react";
//Libreria usada para establecer el maneja de ventanas emergentes modal
import {useDisclosure} from "@nextui-org/react";
//Componente
import {columns} from "../../utils/tests/data"  //"../../utils/tests/data";
//Componente de Servicio para conexiones con la API
import apiService from '../../services/apiService';
//Componente para el manejo de variables y estados
import {useState, useEffect} from 'react'
//Componente superior de la pagina
import TableTopContent from "../../components/admin/IngestaData/TableTopContent";
//Componente Inferior de la tabla
import TableBottomContent from '../../components/admin/IngestaData/TableBottomContent'
//Componente nextUI para los PopUps modal
import PopUpModal from "../../components/admin/Shared/PopUpModal/PopUpModal";

import CustomTable from "../../components/admin/IngestaData/CustomTable";

//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["meter_id", "meter_code", "status", "creator","create_date","actions"];

//Aquí empieza la funcionalidad de la vista IngestaAdmin.jsx
export default function IngestaAdmin(sidebar) {

//En esta parte inicializamos las variables useState, usadas para mejorar la optimización en el manejo de variables
//----------------------------------------------------------------------------------------------------------------
  //En esta variable se guardarán los medidores que se extraigan de la API
  const [meters, setMeters] = useState([]);
  //En esta variable se guardarán los medidores que se extraigan de la API
  const [tapas, setTapas] = useState([]);
  //En esta variable se guardan los creadores únicos de los medidores
  const [creators, setCreators] = useState([]);
  //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
  const [isLoading, setIsLoading] = useState(true);
  //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
  const [metersLength, setMetersLength] = useState(0);
  //Variable que establece qué numero del pagination que se encuentra activa
  const [page, setPage] = React.useState(1);
  //Esta variable es la cantidad de registros por consulta
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //Variable que establece la columna y el orden de filtrado para la consulta, es un JSON con el nombre de columna
  //y el orden (ascending, descending)
  const [sortDescriptor, setSortDescriptor] = React.useState({});
  //En esta variable se guardan los nombre de creadores para los cuales se hará el filtrado en la consulta
  //En caso de estar todos activos se setea "all"
  const [statusFilter, setStatusFilter] = React.useState("all");
  //En caso de estar todos activos se setea "all"
  const [statusSelection, setStatusSelection] = React.useState(["REVISION", "INCIDENCIA", "NORMAL"]);
  //Esta variable se usa para guardar los creadores unicos
  const [statusCreators, setFormattedCreators] = useState([]);
  //Esta variable se usa para guardar los status unicos
  const [statusStatus, setFormattedStatus] = useState([]);
  //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
  const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";
  //Constante para establecer si se esta ejecutando el autocomplete
  const [filterValue, setFilterValue] = React.useState("");
  //constante con los id de los medidores seleccionados
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  //Constante para establecer las columnas visibles puesto que estas son dinamicas
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  //Esta constante establece si se está ejecutando o no el autocomplete de los medidores
  const [hasSearchFilter, setVariable] = React.useState(false);
  //Aquí se establece cual de las posibles acciones de los tres puntos se oprimió
  const[actionKey, setActionKey] = useState("");
  //Aqui se establece el valor para saber si se activa o no la ventana emergente
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  //Aquí se establece cuál de los registros se seleccionó al oprimir los tres puntos
  const [selectedMeter, setSelectedMeter] = useState([])

//---------------------------------------------------------------------------------------------------------------
  //Esta es la consulta principal para el metodo getAll del servicio apiService.js en la carpeta services
  //Esta consulta se ejecuta y usa los parametros de consulta
  useEffect(() => {

    //Aquí se establece que el fetch o consulta es asincrónico para optimizar el batch
    const fetchData = async () => {
      //Al estar ejecutando el fetch activamos el loading de la data
      setIsLoading(true);
      //Inicializar la variable fuera del bloque condicional
      let creatorString = '';
      let statusString = '';
      //En caso que no todos los creadores estén activos ejecutamos el filtro de creador
      //&statusFilter es un set, no un JSON
      if (statusFilter !== 'all'){
        //Creamos un arreglo con el set de Datos
        const creatorsArray = Array.from(statusFilter);

        // Unir los elementos del Array en una cadena separada por comas
        creatorString = creatorsArray.join(',');
        //console.log(creatorString)
      } 
      if(statusSelection !== 'all'){
        const statusArray = Array.from(statusSelection);
        statusString = statusArray.join(',');
      }
      //Luego de tener los parametros de creador ejecutamos el try - catch
      try {
        //inizializamos los parametros de consultas a la API de consumo
        const params = {
          page,//numero de pagina
          page_size: rowsPerPage,//Tamaño de la consulta en número de registros
          //ordenamiento en caso de haberlo, en caso de haberlo se necesita el nombre de la columna y agregarle un - en caso de ser orden descendente
          ordering: sortDescriptor.direction === 'ascending' ? sortDescriptor.column : `-${sortDescriptor.column}`,
          //parametro de creador
          creator : statusFilter === 'all' ? '' : creatorString,
          //Parametro para el status
          status : statusSelection === 'all' ? '' : statusString

        };
        //Una vez con los parametros ejecutamos la consulta y obtenemos el resultado
        const initialMeters = await apiService.getAll(params);
        //el resultado contiene más de un campo por lo que extraemos solo la parte de "results" para setear los medidores
        setMeters(initialMeters["results"]);
        //usamos el componente "count" de la consulta para establecer el tamaño de los registros
        setMetersLength(initialMeters["count"]);
      } catch (error) {
        //En caso de error en el llamado a la API se ejecuta un console.error
        console.error('Error fetching initial meters:', error);
      } finally {
        //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
        setIsLoading(false);
      }
    };
    fetchData();
    //Esta consulta se establece al iniciar la pagina de ingesta Data y al haber un cambio en alguna variable de parametros
  }, [page, rowsPerPage, sortDescriptor, statusSelection , statusFilter, hasSearchFilter===false]);
  
  // Función para convertir un nombre en formato UID
  const convertToUID = (name) => {
    return name;
  };

  //Fetch para traer los nombres de todos los creadores
  const fetchUniqueCreators = async () => {
    try {
      const response = await apiService.getCreator();
      const creators = response.unique_creators;

      // Formatear los datos
      return creators.map((creator) => ({
        name: creator.toUpperCase(),
        uid: convertToUID(creator),
      }));
    } catch (error) {
      console.error('Error fetching unique creators:', error);
      return [];
    }
  };

  //Fetch para traer todos los posibles estados únicos
  const fetchUniqueStatus = async () => {
    try {
      const response = await apiService.getStatus();
      const status = response.unique_status;
  
      // Formatear los datos
      return status.map((status) => ({
        name: status.toUpperCase(),
        uid: convertToUID(status),
       }));
      } catch (error) {
        console.error('Error fetching unique status:', error);
        return [];
      }
  };

  //Fetch para traer los nombres de todas las tapas
  const fetchUniqueTapas = async () => {
    try {
      const response = await apiService.getTapas();
      const tapasDesc = response.results;
      //console.log("tapas: ",tapasDesc)
      // Formatear los datos
      return tapasDesc.map((tapa) => ({
        name: tapa["tapa_desc"].toUpperCase(),
        uid: tapa["tapa_id"],
      }));
    } catch (error) {
      //console.error('Error fetching unique Tapas:', error);
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

  //Aqui se guardan los status unicos al ejecutar el fetch de arriba
  useEffect(() => {
    const getStatus = async () => {
      const creators = await fetchUniqueStatus();
      setFormattedStatus(creators);
    };
  
      getStatus();
    }, []);

    //Aqui se guardan las tapas unicos al ejecutar el fetch de arriba
    useEffect(() => {
      const getTapas = async () => {
        const tapas = await fetchUniqueTapas();
        setTapas(tapas);
      };
  
      getTapas();
    }, []);

  //Aqui vamos a llamar la API para la ruta de autocomplete
  useEffect(() => {
    //Al estar ejecutando el fetch activamos el loading de la data
    if (filterValue.length > 0) {

      setIsLoading(true);

      const fetchSuggestions = async () => {
        try {
        //inizializamos los parametros de consultas a la API de consumo
        //console.log("No ha salido")
        const params = {
          q: filterValue,
          page: 1,
          page_size : rowsPerPage
        };

          const response = await apiService.autocompleteMeters(params);;
          setMeters(response["results"]);
          //usamos el componente "count" de la consulta para establecer el tamaño de los registros
          setMetersLength(response["count"]);
        } catch (error) {
          //En caso de error en el llamado a la API se ejecuta un console.error
          console.error('Error fetching initial meters:', error);
        } finally {
          //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
          setIsLoading(false);
          //console.log("salio");
        }
      };

      fetchSuggestions();
    }
  }, [filterValue]);
  //Aquí terminan los llamados a la API
  //----------------------------------------------------------------------------------------------------

  //Aqí se calcula la cantidad de paginas que va a tener el paginador, teniendo en cuenta la cantidad de registros y el tamaño de la consulta
  const pages = Math.ceil(metersLength / rowsPerPage);
  //Constante booleana para saber si se ejecuta el autocomplete, booleano que depende del cambio de filterValue
  //Al no haber valor en filter value "" en ese caso el booleano queda en false


  //---------------------------------------------------------------------------------------------------------------------------
  //Aquí se encuentran las funciones usadas en el componente IngestaData
  //Esta función se usa para calcular las columnas que se etsablecen como visibles
  const headerColumns = React.useMemo(() => {

    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

  
  //En esta función se usa para filtrar los medidores según el autocomplete en el campo meter_code
  const filteredItems = React.useMemo(() => {

    //Se inicializa la variable filteredUsers con el valor de los medidores
    //let filteredMeters = meters;

    //En caso de enontrarse activo el autocomplete
    if (filterValue != "") {
      setVariable(true)
    }
    else{
      setVariable(false)
    }
    //al final devuelve los registros filtrados
    //return filteredMeters;
  
  }, [filterValue]);

  //Al cambiar el número de registros por pagina esta se establece de nuevo en la pagina 1
  const onRowsPerPageChange = React.useCallback((e) => {
    //al cambiar se establece la nueva cantidad de registros por pagina
    setRowsPerPage(Number(e.target.value));
    //setea por default en la pagina 1
    setPage(1);
  }, []);

  //Volver las llaves de medidor y la pagina a la primera en caso de cambiar el criterio de busqueda para los creadores
  //statusSelection lo cambia cuando se cambia el estatus de los medidores
  const volverDefault = React.useMemo(() =>{
    setPage(1)
    setSelectedKeys(new Set([]))
  },[statusFilter, statusSelection])

  //Al cambiar el valor de la busqueda del autocomplete este se va actualizando en tiempo real con este callback
  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);



  {/*Seccion para el PopUp de los medidores paginas*/}
  const popUp = React.useMemo(() => {

    return (
      <>
      {/*Componente modal importado del componente PopUpModal.jsx*/}
      <PopUpModal
        isOpenUpdate={isOpen} 
        onOpenChangeUpdate={onOpenChange} 
        meters={meters} 
        actionKey={actionKey}
        meter={selectedMeter}
        tapas={tapas}
      >
      </PopUpModal>
      </>
    );
  },[isOpen]);
  //El componente se actualiza cada vez que cambie el estado de isOpen

  //Usamos memo para describir la parte superior de la tabla como el buscador y los filtros
  const topContent = React.useMemo(() => {
    return (
      <TableTopContent
        filterValue={filterValue} //El valor de cambio del input del autocomplete
        onSearchChange={onSearchChange} //Evento de cambio del valor del autocomplete, para que se establezca la primera pagina del paginador y se cambie el valor del autocomplete 
        setFilterValue={setFilterValue}  //Cambiar el valor del autocomplete
        statusSelection = {statusSelection}
        setStatusSelection={setStatusSelection}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={statusCreators}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columns={columns}
        users={meters}
        usersLength = {metersLength}
        dataStatusOptions = {statusStatus}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    );
  }, [
    filterValue,
    statusSelection,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    metersLength,
  ]);

  {/*Seccion para el pasa paginas*/}
  const bottomContent = React.useMemo(() => {
    return (
      <TableBottomContent
        page={page}
        setPage={setPage}
        pages={pages}
        selectedKeys={selectedKeys}
        itemsLength={metersLength}
        hasSearchFilter={hasSearchFilter}
      />
    );
  }, [selectedKeys, metersLength, page, pages, hasSearchFilter]);


  return (
    <>
    <div className={`p-4 bg-gray-200 flex h-full lg:h-screen flex-col col-span-6 overflow-auto`}>
      <CustomTable
        bottomContent={bottomContent}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        topContent={topContent}
        headerColumns={headerColumns} 
        meters={meters}
        loadingState={loadingState}
        isLoading={isLoading}
        popUp={popUp}
        setActionKey={setActionKey}
        setSelectedMeter={setSelectedMeter}
        onOpen={onOpen}
      />
    </div>
    </>
  );
}
