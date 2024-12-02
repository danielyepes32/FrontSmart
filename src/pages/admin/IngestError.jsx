//Librería De servicios integrados de react
import React from "react";
//Libreria usada para establecer el maneja de ventanas emergentes modal
import {useDisclosure} from "@nextui-org/react";
import {columnsAlarms} from "../../utils/tests/data"  //"../../utils/tests/data";
//Componente de Servicio para conexiones con la API
import apiService from "../../services/apiService";
//Eventos de cambio de variables constant
import TableTopContent from "../../components/admin/IngestaError/Table/TableTopContent";
import TableBottomContent from '../../components/admin/IngestaError/Table/TableBottomContent'
import PopUpModal from "../../components/admin/Shared/PopUpModal/PopUpModal";
//Libreria para hacer un parse a los datos de tipo fecha
import {parseAbsoluteToLocal} from "@internationalized/date";
//Importar luxon para poder agregar zona horaria a un dato de tipo Fecha
import { DateTime } from 'luxon';

import CustomTable from "../../components/admin/IngestaError/Table/CustomTable";



//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["id", "meter_code", "falla_desc","tipo","fecha", "falla_type","actions"];

//Aquí empieza la funcionalidad de la vista IngestaAdmin.jsx
export default function IngestaAdmin(sidebar) {

//En esta parte inicializamos las variables useState, usadas para mejorar la optimización en el manejo de variables
//----------------------------------------------------------------------------------------------------------------
  //En esta variable se guardarán los medidores que se extraigan de la API
  const [meters, setMeters] = React.useState([]);
  //En esta variable se guardarán los medidores que se extraigan de la API
  const [tapas, setTapas] = React.useState([]);
  //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
  const [isLoading, setIsLoading] = React.useState(true);
  //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
  const [metersLength, setMetersLength] = React.useState(0);
  //Variable que establece qué numero del pagination que se encuentra activa
  const [page, setPage] = React.useState(1);
  //Esta variable es la cantidad de registros por consulta
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //Variable que establece la columna y el orden de filtrado para la consulta, es un JSON con el nombre de columna
  //y el orden (ascending, descending)
  const [sortDescriptor, setSortDescriptor] = React.useState({});
  //En esta variable se guardan los typos de fallas para los cuales se hará el filtrado en la consulta
  //En caso de estar todos activos se setea "all"
  const [fallaTypeFilter, setFallaTypeFilter] = React.useState("all");
  //En esta variable se guardan todas las descripciones de las fallas para los cuales se hará el filtrado en la consulta
  //En caso de estar todos activos se setea "all"
  const [fallaDescFilter, setFallaDescFilter] = React.useState("all");
  //Esta variable guardará todos los tipos de fallas
  const [fallaType, setFallaType] = React.useState([]);
  //Esta variable se usa para guardar todas las descripciones de fallas
  const [fallaDesc, setFallaDesc] = React.useState([]);
  //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
  const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";
  //Constante para establecer si se esta ejecutando el autocomplete
  const [filterValue, setFilterValue] = React.useState("");
  //constante con los id de los medidores seleccionados
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  //Constante para establecer las columnas visibles puesto que estas son dinamicas
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  //Variable para establecer el cambio de fechas seleccionadas en el filtro
  let [date, setDate] = React.useState({
    //Por default tiene el primer día del mes actual y de fin la fecha actual con zona horaria de perú
    start: parseAbsoluteToLocal(DateTime.now().setZone('America/Lima').startOf("month").toString()),
    end: parseAbsoluteToLocal(DateTime.now().setZone('America/Lima').toString()),
  });
  //Variable para establecer si está en uso el autocompletado
  const [hasSearchFilter, setVariable] = React.useState(false);
  //Constante que alverga la action key de los 3 puntos
  const [actionKey, setActionKey] = React.useState("");
  //Aqui se establece el valor para saber si se activa o no la ventana emergente modal del actionKey
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  //Constante que alberga el medidor seleccionado al oprimir las acciones del actionKEY
  const [selectedMeter, setSelectedMeter] = React.useState([])
//---------------------------------------------------------------------------------------------------------------
  //Esta es la consulta principal para el metodo getAll del servicio apiService.js en la carpeta services
  //Esta consulta se ejecuta y usa los parametros de consulta
  React.useEffect(() => {
    //En caso de que no se esté ejecutando el autocomplete (podría mejorar implementando haSearcFilter)
    if(filterValue === ""){
    //Aquí se establece que el fetch o consulta es asincrónico para optimizar el batch
    const fetchData = async () => {
      //Al estar ejecutando el fetch activamos el loading de la data
      setIsLoading(true);
      //Inicializar la variable fuera del bloque condicional
      let falla_type_string = '';
      let falla_desc_string = '';
      //En caso que no todos los creadores estén activos ejecutamos el filtro de creador
      //&fallaTypeFilter es un set, no un JSON
      if (fallaTypeFilter !== 'all'){
        //Creamos un arreglo con el set de Datos
        const falla_type = Array.from(fallaTypeFilter);

        // Unir los elementos del Array en una cadena separada por comas
        falla_type_string = falla_type.join(',');
        //console.log(creatorString)
      } 
      if(fallaDescFilter !== 'all'){
        const falla_desc = Array.from(fallaDescFilter);
        falla_desc_string = falla_desc.join(',');
      }

      console.log(date)
      //Luego de tener los parametros de creador ejecutamos el try - catch
      try {
        //inizializamos los parametros de consultas a la API de consumo
        const params = {
          page,//numero de pagina
          page_size: rowsPerPage,//Tamaño de la consulta en número de registros
          //ordenamiento en caso de haberlo, en caso de haberlo se necesita el nombre de la columna y agregarle un - en caso de ser orden descendente
          ordering: sortDescriptor.direction === 'ascending' ? sortDescriptor.column : `-${sortDescriptor.column}`,
          //parametro de creador
          falla_type : fallaTypeFilter === 'all' ? '' : falla_type_string,
          //Parametro para el status
          falla_desc : fallaDescFilter === 'all' ? '' : falla_desc_string,
          //Parametro establecido en la api, gte se refiere a greater por lo que se agrega de manera concatenada el valor de inicio de la busqueda en el filtro de calendario
          fecha_gte : `${date.start["year"]}${date.start["month"] < 10 ? `0${date.start["month"]}` : date.start["month"]}${date.start["day"] < 10 ? `0${date.start["day"]}` : date.start["day"]}`,
          //Parametro establecido en la api, lte se refiere a lower por lo que se agrega de manera concatenada el valor de fin de la busqueda en el filtro de calendario
          fecha_lte : `${date.end["year"]}${date.end["month"] < 10 ? `0${date.end["month"]}` : date.end["month"]}${date.end["day"] < 10 ? `0${date.end["day"]}` : date.end["day"]}`

        };
        //Una vez con los parametros ejecutamos la consulta y obtenemos el resultado
        const initialMeters = await apiService.getAllCombined(params);
        
        //el resultado contiene más de un campo por lo que extraemos solo la parte de "results" para setear los medidores
        setMeters(initialMeters["results"]);
        //usamos el componente "count" de la consulta para establecer el tamaño de los registros
        setMetersLength(initialMeters["count"]);
      } catch (error) {
        // En caso de error en el llamado a la API se ejecuta un console.error
        if (error.response) {
          // La respuesta del servidor tiene un error (código 4xx o 5xx)
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          // No se recibió respuesta del servidor
          console.error('Error request:', error.request);
        } else {
          // Otro tipo de error
          console.error('Error:', error.message);
        }
      } finally {
        //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
        setIsLoading(false);
      }
    };
    fetchData();
    //Esta consulta se establece al iniciar la pagina de ingesta Data y al haber un cambio en alguna variable de parametros
    }

  }, [page, rowsPerPage, sortDescriptor, fallaDescFilter , fallaTypeFilter, hasSearchFilter===false, date, filterValue ==! ""]);
  //La consulta de las alarmas se establece al cambiar la pagina, el tamaño de la pagina, el parametro ordering de los datos,
  //el estatus de las alarmas que en este caso se refiere a si la falla es externa o interna, la seleccion de fallas y solo cuando el autocomplete es falso

  // Función para convertir un nombre en formato UID
  const convertToUID = (name) => {
    return name;
  };

  //Fetch para traer todos los tipos de fallas
  const fetchUniqueFallaType = async () => {
    try {
      const response = await apiService.getFallaType();
      const fallaTypes = response.unique_falla_type;

      // Formatear los datos
      return fallaTypes.map((fallaType) => ({
        name: fallaType.toUpperCase(),
        uid: convertToUID(fallaType),
      }));
    } catch (error) {
      console.error('Error fetching unique falla types:', error);
      return [];
    }
  };

  //Aqui se guardan los tipos de fallas unicos al ejecutar el fetch de arriba
  React.useEffect(() => {
    const getFallaType = async () => {
      const unique_falla_type = await fetchUniqueFallaType();
      setFallaType(unique_falla_type);
    };

    getFallaType();
  }, []);


    //Fetch para traer los nombres de todos los creadores
  const fetchUniqueFallas = async () => {

    let fallaTypeString = '';
    //En caso que no todos los creadores estén activos ejecutamos el filtro de creador
    //&fallaTypeFilter es un set, no un JSON
    if (fallaTypeFilter !== 'all'){
      //Creamos un arreglo con el set de Datos
      const fallaTypeArray = Array.from(fallaTypeFilter);

      // Unir los elementos del Array en una cadena separada por comas
      fallaTypeString = fallaTypeArray.join(',');
      console.log(fallaTypeString)
    }
    try {
      const params = {
        falla_type: fallaTypeFilter === 'all' ? '': fallaTypeString
      }
      const response = await apiService.getFallaDesc(params);
      const fallas = response.results;
      console.log("fallas_API", fallas)
      console.log("fallaDescFilter", fallaTypeFilter)
        // Formatear los datos
      return fallas.map((falla) => ({
        name: falla["falla_desc"].toUpperCase(),
        uid: convertToUID(falla["falla_desc"]),
       }));
      } catch (error) {
        console.error('Error fetching unique status:', error);
        return [];
      }
  };

  //Aqui se guardan las fallas unicos al ejecutar el fetch de arriba
  React.useEffect(() => {
    const getFallaDesc = async () => {
      const fallas = await fetchUniqueFallas();
      setFallaDesc(fallas);
    };
  
    getFallaDesc();
  }, [fallaTypeFilter]);

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
      console.error('Error fetching unique Tapas:', error);
      return [];
    }
  };

    //Aqui se guardan los creadores unicos al ejecutar el fetch de arriba
    React.useEffect(() => {
      const getTapas = async () => {
        const tapas = await fetchUniqueTapas();
        setTapas(tapas);
      };
  
      getTapas();
    }, []);
    //Aqui vamos a llamar la API para la ruta de autocomplete
    React.useEffect(() => {
    //Al estar ejecutando el fetch activamos el loading de la data
    if (filterValue.length > 0) {

      setIsLoading(true);

      const fetchSuggestions = async () => {
        try {
        //inizializamos los parametros de consultas a la API de consumo
        //console.log("No ha salido")
        const params = {
          q: filterValue,
          page,
          page_size : rowsPerPage
        };

          const response = await apiService.autocompleteCombined(params);;
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
  }, [filterValue,page,hasSearchFilter===true]);
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

    if (visibleColumns === "all") return columnsAlarms;

    return columnsAlarms.filter((column) => Array.from(visibleColumns).includes(column.uid));
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
  //fallaDescFilter lo cambia cuando se cambia el estatus de los medidores
  const volverDefault = React.useMemo(() =>{
    setPage(1)
    setSelectedKeys(new Set([]))
  },[fallaTypeFilter, fallaDescFilter])

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

    //console.log("Entra al Model")
    //console.log("OpenState: ", isOpen)
    return (
      <>
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

  //Usamos memo para describir la parte superior de la tabla como el buscador y los filtros
  const topContent = React.useMemo(() => {
    return (
      <TableTopContent
        date = {date}
        setDate = {setDate}
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        setFilterValue={setFilterValue}
        statusSelection = {fallaDescFilter}
        setStatusSelection={setFallaDescFilter}
        statusFilter={fallaTypeFilter}
        setStatusFilter={setFallaTypeFilter}
        statusOptions={fallaType}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columns={columnsAlarms}
        users={meters}
        haFilterSelect={hasSearchFilter}
        usersLength = {metersLength}
        dataStatusOptions = {fallaDesc}
        onRowsPerPageChange={onRowsPerPageChange}
        meter = {selectedMeter}
        meters = {meters}
        tapas={tapas}
        setMeters = {setFilterValue}
      />
    );
  }, [
    filterValue,
    fallaDescFilter,
    fallaTypeFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    metersLength,
    date,
    fallaDesc
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

  //configuración tailwind para los componentes de la tabla de nextUI
  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider","items-center","justify-center","place-items-center","text-center"],
      td: [ 
        //Agregar las celdas en la mitad del componente
        "align-middle text-center",
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  //console.log(sidebar)
  //console.log("creadoresSelect: ", fallaType)
  //console.log("Status select: ", fallaDescFilter)
  //console.log("Filtro", fallaTypeFilter)
  //console.log("Filtro Status", statusSelection)

  return (
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
  );
}
