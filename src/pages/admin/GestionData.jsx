import React from 'react';
import {
        useDisclosure,
    } from "@nextui-org/react";
//Libreria para hacer un parse a los datos de tipo fecha
import {parseAbsoluteToLocal} from "@internationalized/date";
import TableBottomContent from "../../components/admin/GestionData/Table/TableBottomContent"
//Importar luxon para poder agregar zona horaria a un dato de tipo Fecha
import { DateTime } from 'luxon';
import {columnsGateways} from "../../utils/tests/data"  //"../../utils/tests/data";
import apiService from '../../services/apiService';
import ScatterPlot from '../../components/admin/GestionData/ScatterPlot';
import CustomAlert from '../../components/admin/Shared/CustomAlert';
import CustonModal from '../../components/admin/GestionData/CustomModal';
import PopUpGestion from '../../components/admin/GestionData/PopUpGestion';
import TableComponent from '../../components/admin/GestionData/Table/Table';
import MapContainer from '../../components/admin/GestionData/MapContainer';
import CardGateway from '../../components/admin/GestionData/CardGateway';
import CardGatewayHistory from '../../components/admin/GestionData/CardGatewayHistory';


//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["equip_id", "online_status", "service_center","last_update_time","actions"];


const GestionData = ({ sidebar }) => {
//En esta parte inicializamos las variables useState, usadas para mejorar la optimización en el manejo de variables
//----------------------------------------------------------------------------------------------------------------
  //Variables para el post del gateway
  //------------------------------------------------------------------------------------------------------------
  //Nombre del nuevo gateway a registrar
  const [isOpenCustomMessage, setIsOpenCustomMessage] = React.useState(false);
  const [selectedGateway,setSelectedGateway] = React.useState(null)
  const [gatewayPost, setGatewayPost] = React.useState(null)
  //latitude del nuevo gateway a registrar
  const [latitudeGatewayPost, setLatitudeGatewayPost] = React.useState(null)
  //longitude del nuevo gateway a registrar
  const [longitudeGatewayPost, setLongitudeGatewayPost] = React.useState(null)
  //------------------------------------------------------------------------------------------------------------
  //En esta variable se guardarán los medidores que se extraigan de la API
  const [metersFetch, setMeters] = React.useState([]);
  //En esta variable se guardarán los medidores que se extraigan de la API
  const [arrayGateways, setArrayGateways] = React.useState([]);
  //En esta variable se guardarán los medidores que se extraigan de la API
  const [arrayMeters, setArrayMeters] = React.useState([]);
  //Aquí se establece cual de las posibles acciones de los tres puntos se oprimió
  const[actionKey, setActionKey] = React.useState("");
  //Variable para establecer si está en uso el autocompletado
  let [date, setDate] = React.useState({
    //Por default tiene el primer día del mes actual y de fin la fecha actual con zona horaria de perú
    start: parseAbsoluteToLocal(DateTime.now().setZone('America/Lima').startOf("month").toString()),
    end: parseAbsoluteToLocal(DateTime.now().setZone('America/Lima').toString()),
  });
  //Aqui se establece el valor para saber si se activa o no la ventana emergente
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedMeter, setSelectedMeter] = React.useState([])
  //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
  const [metersLength, setMetersLength] = React.useState(0);
  //Variable que establece qué numero del pagination que se encuentra activa
  const [page, setPage] = React.useState(1);
  //En esta variable se guardan los nombre de creadores para los cuales se hará el filtrado en la consulta
  //En caso de estar todos activos se setea "all"
  const [statusFilter, setStatusFilter] = React.useState(true);
  //y el orden (ascending, descending)
  const [sortDescriptor, setSortDescriptor] = React.useState({column: 'online_status', direction: 'ascending'});
  //Esta variable es la cantidad de registros por consulta
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //En caso de estar todos activos se setea "all"
  const [statusSelection, setStatusSelection] =React.useState("all");
  //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
  const [isLoading, setIsLoading] = React.useState(true);
  //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
  const [loadingApi, setLoadingApi] = React.useState(false);
  //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
  const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";
  //Constante para establecer si se esta ejecutando el autocomplete
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  //Esta variable se usa para guardar los creadores unicos
  const [statusCreators, setFormattedCreators] = React.useState([]);
  //Update 
  //Al cambiar el número de registros por pagina esta se establece de nuevo en la pagina 1
  const onRowsPerPageChange = React.useCallback((e) => {
    //al cambiar se establece la nueva cantidad de registros por pagina
    setRowsPerPage(Number(e.target.value));
    //setea por default en la pagina 1
    setPage(1);
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
      
    return `${year}${month}${day}`;
  };
        // Función para convertir un nombre en formato UID
  const convertToUID = (name) => {
    return name;
  };
  const [isVisible, setIsVisible] = React.useState(false)
  const [messageFetch, setMessageFetch] = React.useState('')

  const handleCreateGateway = async () => {
    //setLoading(true);
    // Verifica que todos los parámetros necesarios estén presentes
    if (!gatewayPost || !latitudeGatewayPost || !longitudeGatewayPost || !selectedKeys.anchorKey) {
      setIsVisible(true);
      setMessageFetch('Todos los campos son obligatorios. Por favor, complete los datos faltantes.');
      return; // Detiene la ejecución si faltan parámetros
    }
    // Crea el objeto incidencia basado en la lógica proporcionada
    const gateway_id = gatewayPost; // Este es un ejemplo, asegúrate de obtener este valor dinámicamente
    //const service_center = selectedKeys;
    const latitude = latitudeGatewayPost;
    const longitude = longitudeGatewayPost;

    console.log("Base seleccionada: ", selectedKeys.anchorKey)

    const newGatewayData = {
      gateway_id : gateway_id.toUpperCase(),
      latitude,
      longitude,
      status : "OPERATIONAL",
      service_center: selectedKeys.anchorKey ? selectedKeys.anchorKey : selectedKeys
    };

    console.log("Datos del nuevo gateway: ",newGatewayData)
    try {
      const newGateway = await apiService.postGateways(newGatewayData);
      console.log('Nueva incidencia creada:', newGateway);
      //alert("Nuevo gateway creado ", newGateway.gateway_id)//setLoading(false);
      setIsVisible(true)
      setMessageFetch('Nuevo medidor agregado con exito al sistema')
      // Aquí puedes manejar el éxito de la creación, como mostrar una notificación o actualizar el estado
    } catch (error) {
      console.error('Error al crear incidencia:', error);
      if(error.gateway_id){
        setIsVisible(true)
        setMessageFetch(`Inserción cancelada, el identificador ${newGatewayData.gateway_id} ya existe`)
        //alert("Inserción cancelada, ese identificador ya existe")
        console.log(error.incidencia_id)
      }else{
        setIsVisible(true)
        setMessageFetch('Error inesperado, intente de nuevo')
      }
      // Maneja el error, como mostrar un mensaje de error
    } finally {
        setStatusFilter(!statusFilter)
    }
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

    //Aqui se guardan los creadores unicos al ejecutar el fetch de arriba
  React.useEffect(() => {
    const getCreators = async () => {
      const creators = await fetchUniqueCreators();
      setFormattedCreators(creators);
    };
    getCreators();
  }, [isOpen===true]);

  //Esta consulta se ejecuta y usa los parametros de consulta
  React.useEffect(() => {
    setIsLoading(true)

    console.log("SortDescriptyor: ", sortDescriptor)
    const params= {
        page,
        page_size : rowsPerPage,
        //ordenamiento en caso de haberlo, en caso de haberlo se necesita el nombre de la columna y agregarle un - en caso de ser orden descendente
        ordering: sortDescriptor ? sortDescriptor.direction === 'ascending' ? sortDescriptor.column : `-${sortDescriptor.column}` : null,
    }

    console.log(params)
    //Aquí se establece que el fetch o consulta es asincrónico para optimizar el batch
    const fetchData = async () => {
      
      try {
        //Una vez con los parametros ejecutamos la consulta y obtenemos el resultado
        const initialMeters = await apiService.getGatewaysMysql(params);
        console.log("Consulta gateways", initialMeters)
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
  }, [page, rowsPerPage, sortDescriptor, statusSelection , statusFilter, date]);

  //Esta consulta se ejecuta y usa los parametros de consulta
  React.useEffect(() => {
    //Aquí se establece que el fetch o consulta es asincrónico para optimizar el batch
    const fetchData = async () => {
      
      try {
        //Una vez con los parametros ejecutamos la consulta y obtenemos el resultado
        const gateways = await apiService.getGatewaysMysql();
        //el resultado contiene más de un campo por lo que extraemos solo la parte de "results" para setear los medidores
        setArrayGateways(gateways["results"]);
      } catch (error) {
        // En caso de error en el llamado a la API se ejec  uta un console.error
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
      }
    };
    fetchData();
    //Esta consulta se establece al iniciar la pagina de ingesta Data y al haber un cambio en alguna variable de parametros
  }, []);

  // Función para extraer parámetros de la URL
  const extractParamsFromUrl = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return {
      page: parseInt(urlParams.get('page')) || 1,
      page_size: parseInt(urlParams.get('page_size')) || 50,
    };
  };

  React.useEffect(() => {
    setLoadingApi(true)
    const fetchData = async () => {
      try {
        let nextPage = {
          page: 1,
          page_size: 2000
        };  // Comienza con la primera página

        // Función para hacer la llamada a la API y actualizar el estado progresivamente
        const fetchPage = async (params) => {
          const response = await apiService.getAll(params);

          // Actualizar el estado de arrayMeters incrementando con los nuevos resultados
          setArrayMeters(prevMeters => [...prevMeters, ...response.results]);

          // Si hay una página siguiente, extraer los parámetros de la URL
          if (response.next) {
            nextPage = extractParamsFromUrl(response.next);
          } else {
            nextPage = null;  // No hay más páginas
          }
        };

        // Continuar llamando a fetchPage mientras haya una página siguiente
        while (nextPage) {
          await fetchPage(nextPage);
        }

      } catch (error) {
        if (error.response) {
          console.error('Error en la respuesta:', error.response.data);
        } else if (error.request) {
          console.error('Error en la solicitud:', error.request);
        } else {
          console.error('Error:', error.message);
        }
        setError(error);
      } finally {
        setLoadingApi(false);  // Finalizar el estado de carga
      }
    };

    fetchData();
  }, []);  // Solo ejecuta una vez cuando el componente se monta
  //Funcion callback al obtener datos para la tabla dependiendo del columkey

  //Aqí se calcula la cantidad de paginas que va a tener el paginador, teniendo en cuenta la cantidad de registros y el tamaño de la consulta
  const pages = Math.ceil(metersLength / rowsPerPage);

  //Esta función se usa para calcular las columnas que se etsablecen como visibles
  const headerColumns = React.useMemo(() => {

    if (visibleColumns === "all") return columnsGateways;

    return columnsGateways.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

  {/*Seccion para el pasa paginas*/}
  const bottomContent = React.useMemo(() => {
    return (
      <TableBottomContent
        page={page}
        setPage={setPage}
        pages={pages}
      />
    );
  }, [metersLength, page, pages]);

  {/*Seccion para el pasa paginas*/}
  const scatterPlot = React.useMemo(() => {
    return (
      <ScatterPlot
        selectedGateway={selectedGateway}
      />
    );
  }, [selectedGateway]);

  const TablePopUpStatus = React.useMemo(()=>{
    return (
      <TableComponent
        setSelectedGateway = {setSelectedGateway}
        bottomContent = {bottomContent}
        sortDescriptor = {sortDescriptor}
        setSortDescriptor = {setSortDescriptor}
        headerColumns = {headerColumns}
        metersFetch = {metersFetch}
        isLoading = {isLoading}
        loadingState = {loadingState}
        setActionKey = {setActionKey}
        onOpen = {onOpen}
        setSelectedMeter = {setSelectedMeter}
      />
    )
  })
  //Esta variable se refiere a los diferentes tipos de tapas que se pueden seleccionar puesto que esta input es un selector, se inicializa con el valor inicial del medidor
  const [selectedKeys, setSelectedKeys] = React.useState("SEDAPAL COMAS");

  const CustomModal = React.useMemo(() => {
    console.log("CustomMessage: ", isOpenCustomMessage)
    return isOpenCustomMessage === true ? (
      <CustonModal selectedGateway={selectedMeter} isVisible={isOpenCustomMessage} setIsVisible={setIsOpenCustomMessage}></CustonModal>
    ) : null
  }, [isOpenCustomMessage]);

  const PopUpGateway = React.useMemo(()=>{
    return(
      <PopUpGestion
        isOpen = {isOpen}
        onOpenChange = {onOpenChange}
        actionKey = {actionKey}
        setActionKey = {setActionKey}
        gatewayPost = {gatewayPost}
        setGatewayPost = {setGatewayPost}
        latitudeGatewayPost = {latitudeGatewayPost}
        setLatitudeGatewayPost = {setLatitudeGatewayPost}
        longitudeGatewayPost={longitudeGatewayPost}
        setLongitudeGatewayPost={setLongitudeGatewayPost}
        selectedKeys = {selectedKeys}
        setSelectedKeys = {setSelectedKeys}
        statusCreators = {statusCreators}
        selectedMeter = {selectedMeter}
        setIsOpenCustomMessage = {setIsOpenCustomMessage}
        handleCreateGateway = {handleCreateGateway}
      />
        )
    })

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

  return (
    <div className={`p-4 bg-gray-200 flex h-screen flex-col col-span-6 overflow-auto`}>
      <div className=''>
        {PopUpGateway}
      </div>
      <div className={`${isVisible ? 'block': 'hidden'} h-screen relative z-[100]`}>
          {PopUpCustomAlert}
      </div>
      <div className={`${isOpenCustomMessage ? 'block': 'hidden'} relative z-[120]`}>
          {CustomModal}
      </div>
      <div className='h-full w-full flex bg-gray-200 grid grid-cols-5 gap-4'>
        {/* Cuadrícula 4x2: 8 elementos */}
        <MapContainer
          loadingApi={loadingApi}
          arrayGateways={arrayGateways}
          arrayMeters={arrayMeters}
        />    
        <div className='w-full h-full flex flex-col col-span-3'>
          {/*Separación */}
          <div className='h-1/2 w-full flex bg-gray-200 grid lg:grid-cols-2 mb-5'>
            <div className='bg-white h-full rounded-[20px] flex flex-col mr-5'>
              <CardGateway
                onOpen={onOpen}
                metersLength={metersLength}
              />
            </div>
            <div className='w-full h-full flex flex-col bg-white rounded-[20px]'>
              <CardGatewayHistory
                scatterPlot={scatterPlot}
              />
            </div>
          </div>
          <div className='bg-white flex items-center place-items-center justify-center col-span-2 flex-grow rounded-[20px]' >
            {TablePopUpStatus}
          </div>
        </div>
    </div>
  </div>
  );
};

export default GestionData;
