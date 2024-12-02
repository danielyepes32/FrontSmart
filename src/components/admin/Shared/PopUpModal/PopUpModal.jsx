import React from 'react';
import { Chip } from '@nextui-org/react';
import {
  useDisclosure
} from "@nextui-org/react";
import apiService from '../../../../services/apiService';
import { columnsStatus } from '../../../../utils/tests/data';
//Libreria para hacer un parse a los datos de tipo fecha
import {parseAbsoluteToLocal} from "@internationalized/date";
//Importar luxon para poder agregar zona horaria a un dato de tipo Fecha
import { DateTime } from 'luxon';
//Componente superior de la pagina
import TableTopContent from "../../PopUpModal/TableTopContent";
import TableBottomContent from '../../PopUpModal/TableBottomContent'
import MeterDetails from './PopUpModalContent/Details';
import MeterEdit from './PopUpModalContent/Edit';
import ScaleAlarm from './PopUpModalContent/ScaleAlarm';
import MainModal from './MainModal/MainModal';
import TableInfo from './TableInfoModal/TableInfo';
import ModalTableInfo from './TableInfoModal/ModalTableInfo';
import ShowImage from './PopUpModalContent/ShowImage';

//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["alarm_pk", "meter_code", "falla_desc","falla_type","alarm_date"];

const PopUpModal = ({ 
    isOpenUpdate, 
    onOpenChangeUpdate, 
    meters,
    actionKey ,
    meter,
    tapas}) => {
//En esta parte inicializamos las variables useState, usadas para mejorar la optimización en el manejo de variables
//----------------------------------------------------------------------------------------------------------------
  //En esta variable se guardarán los medidores que se extraigan de la API
  const [metersFetch, setMeters] = React.useState([]);
        //Variable para establecer si está en uso el autocompletado
  const [hasSearchFilter, setVariable] = React.useState(false);
    //Variable para establecer el cambio de fechas seleccionadas en el filtro
    let [date, setDate] = React.useState({
      //Por default tiene el primer día del mes actual y de fin la fecha actual con zona horaria de perú
      start: parseAbsoluteToLocal(DateTime.now().setZone('America/Lima').startOf("month").toString()),
      end: parseAbsoluteToLocal(DateTime.now().setZone('America/Lima').toString()),
    });
        //Variable para guardar el tamaño del conteo de medidores totales puesto que los datos se traen por pagination
  const [metersLength, setMetersLength] = React.useState(0);
  //Variable que establece qué numero del pagination que se encuentra activa
  const [page, setPage] = React.useState(1);
  //En esta variable se guardan los nombre de creadores para los cuales se hará el filtrado en la consulta
  //En caso de estar todos activos se setea "all"
  const [statusFilter, setStatusFilter] = React.useState("all");
  //y el orden (ascending, descending)
  const [sortDescriptor, setSortDescriptor] = React.useState({});
  //Esta variable es la cantidad de registros por consulta
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //En caso de estar todos activos se setea "all"
  const [statusSelection, setStatusSelection] =React.useState("all");
  //Esta variable se usa para guardar los creadores unicos
  const [statusCreators, setFormattedCreators] = React.useState([]);
  //Esta variable se usa para guardar los status unicos
  const [statusStatus, setFormattedStatus] = React.useState([]);
  //Variable para activar el circulo de carga de datos en caso de estar ejecutando acciones de API
  const [isLoading, setIsLoading] = React.useState(true);
  //Constante usada para definir si se estan cargando los datos o si en su defecto simplemente no hay datos en la consulta
  const loadingState = isLoading === true & metersLength === 0 ? "loading" : "idle";
  //Constante para establecer si se esta ejecutando el autocomplete
  const [filterValue, setFilterValue] = React.useState("");
  //Este dato define si abrir o no el segundo PopUp modal de confirmación de la Ingesta de la Data
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  //Este dato define si abrir o no el segundo PopUp modal de confirmación de la Ingesta de la Data
  const [activateStatus, setActivateStatus] = React.useState(false)
  //Este dato almacena el valor que se está escribiendo en las inputs para modificar la latitude
  const [latitude, setLatitude] = React.useState('');
  //Este dato almacena el valor que se está escribiendo en las inputs para modificar la longitude
  const [longitude, setLongitude] = React.useState('');
  //Esta constante confirma si se desea visualizar la input de latitud o no dependiendo de las checkbox
  const [showLatitude, setShowLatitude] = React.useState(false);
  //Esta constante confirma si se desea visualizar la input de longitude o no dependiendo de las checkbox
  const [showLongitude, setShowLongitude] = React.useState(false);
  //Esta constante confirma si se desea visualizar la input de Tapa o no dependiendo de las checkbox
  const [showTapa, setShowTapa] = React.useState(false);
  //Esta variable guarda la validacion para evitar que se realizen consultas sin seleccionar un campo a modificar en el medidor
  const [isInvalid, setIsInvalid] = React.useState(true);
  //Esta variable guarda un arreglo con los valores seleccionados a modificar en el medidor (latitude, longitude y tapa_desc)
  const [selectedModify, setSelectedModify] = React.useState([])
  //Esta variable se refiere a los diferentes tipos de tapas que se pueden seleccionar puesto que esta input es un selector, se inicializa con el valor inicial del medidor
  const [selectedKeys, setSelectedKeys] = React.useState(meter.tapa_desc);
  //Constante para establecer las columnas visibles puesto que estas son dinamicas
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [messageFetch, setMessageFetch] = React.useState("");
  //Update 
  //Se almacena el archivo de la imagen seleccionada en el modal de incidencia en forma de ruta temporal para ser previsualizado
  const [image, setImage] = React.useState(null);

  const [imageFile, setImageFile] = React.useState(null);
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
  //Al cambiar el valor de la busqueda del autocomplete este se va actualizando en tiempo real con este callback
  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

    //Al cambiar el número de registros por pagina esta se establece de nuevo en la pagina 1
    const onRowsPerPageChange = React.useCallback((e) => {
      //al cambiar se establece la nueva cantidad de registros por pagina
      setRowsPerPage(Number(e.target.value));
      //setea por default en la pagina 1
      setPage(1);
    }, []);

      //Funcion callback al obtener datos para la tabla dependiendo del columkey
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    //Realizar diferentes acciones dependiendo de la columkey
    switch (columnKey) {
      case "status":
        return (
          //Creo un componente Chip de tipo dot porque estamos agregando un boton de estatus
          <Chip
            variant="dot"
            size="sm"
            aria-label={`Status: ${cellValue}`} // Agrega aria-label aquí
            classNames={{
                //Las caracteristicas de base se cambian con respecto a tailwind para el tamaño del componente chip dentro de su contenedot
                base: "w-auto h-auto px-1",
                content: "px-1",
                //le doy un tamaño al punto, en este caso con un padding de 1 y un color de bg en este caso caracterizado por el mapeo del estatus key
                dot: `p-1 bg-${statusColorMap[user.status]}`
            }}
            className="capitalize gap-4"
          >
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}${month}${day}`;
  };

 //Esta consulta se ejecuta y usa los parametros de consulta
 React.useEffect(() => {
  console.log("Entra a la consulta")
  if(isOpen === true){
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
        falla_type : statusFilter === 'all' ? '' : creatorString,
        //Parametro para el status
        falla_desc : statusSelection === 'all' ? '' : statusString,
        //Parametro de meter_code
        meter_code : meter.meter_code,
        //Parametro establecido en la api, gte se refiere a greater por lo que se agrega de manera concatenada el valor de inicio de la busqueda en el filtro de calendario
        alarm_time_id_gte : formatDate(meter.status_update_date),//`${date.start["year"]}${date.start["month"] < 10 ? `0${date.start["month"]}` : date.start["month"]}${date.start["day"] < 10 ? `0${date.start["day"]}` : date.start["day"]}`,
        //Parametro establecido en la api, lte se refiere a lower por lo que se agrega de manera concatenada el valor de fin de la busqueda en el filtro de calendario
        //alarm_time_id_lte : `${date.end["year"]}${date.end["month"] < 10 ? `0${date.end["month"]}` : date.end["month"]}${date.end["day"] < 10 ? `0${date.end["day"]}` : date.end["day"]}`

      };
      //Una vez con los parametros ejecutamos la consulta y obtenemos el resultado
      const initialMeters = await apiService.getAllAlarms(params);
      console.log("Consulta medidores", initialMeters)
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
  }
  //Esta consulta se establece al iniciar la pagina de ingesta Data y al haber un cambio en alguna variable de parametros
}, [page, rowsPerPage, sortDescriptor, statusSelection , statusFilter, date, meter.meter_code, isOpen]);
//La consulta de las alarmas se establece al cambiar la pagina, el tamaño de la pagina, el parametro ordering de los datos,
//el estatus de las alarmas que en este caso se refiere a si la falla es externa o interna, la seleccion de fallas y solo cuando el autocomplete es falso

  //Aqí se calcula la cantidad de paginas que va a tener el paginador, teniendo en cuenta la cantidad de registros y el tamaño de la consulta
  const pages = Math.ceil(metersLength / rowsPerPage);
  //Constante booleana para saber si se ejecuta el autocomplete, booleano que depende del cambio de filterValue
  //Al no haber valor en filter value "" en ese caso el booleano queda en false
  //---------------------------------------------------------------------------------------------------------------------------
  //Aquí se encuentran las funciones usadas en el componente IngestaData
  //Esta función se usa para calcular las columnas que se etsablecen como visibles
  const headerColumns = React.useMemo(() => {

    if (visibleColumns === "all") return columnsStatus;

    return columnsStatus.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns

  
    //console.log(messageFetch)
    const handleUpdate = () => {
        onOpen()
    }

    const fetchUpdateStatus = async () => {
      const updates = {};
      updates.status = 'NORMAL';
  
      try {
          // Llamada a la API para actualizar el medidor
          const result = await apiService.updateMeter(meter.meter_id, updates);
  
          // Limpia los estados y muestra un mensaje de éxito
          setSelectedModify([]);
          setMessageFetch("Medidor actualizado con éxito.");
  
          // Recarga la página después de un breve retraso (opcional)
          setTimeout(() => {
              window.location.reload();
          }, 3000); // 1 segundo de espera para mostrar el mensaje antes de recargar
      } catch (error) {
          // Manejo de errores
          console.error('An unexpected error occurred:', error);
          setMessageFetch(`Ocurrió un error inesperado con estatus ${error.statusText} CODE: ${error.status}`);
      }
  };

    const fetchUpdateMeterData = async () => {
        const updates = {};
        if (selectedModify.includes('latitude')) updates.latitude = latitude;
        if (selectedModify.includes('longitude')) updates.longitude = longitude;
        if (selectedModify.includes('tapa_desc')) updates.tapa_desc = selectedKeys;
        
        try {
          //console.log('Update Meter Values: ',updates)
          const result = await apiService.updateMeter(meter.meter_id, updates);
          //console.log('Updated Meter:', result);
          setSelectedModify([])
          setMessageFetch("Medidor actualizado con exito.")
          // Realiza acciones adicionales como mostrar un mensaje de éxito, etc.
        } catch (error) {
                console.error('An unexpected error occurred:', error);
                setMessageFetch(`Ocurrió un error inesperado con estatus ${error.statusText} CODE: ${error.status}`)
        }
          setLatitude('')
          setLongitude('')
      };

    // Efecto para actualizar selectedKeys cuando meter cambie
    React.useEffect(() => {
        if (meter && meter.tapa_desc) {
            setSelectedKeys(meter.tapa_desc);
        }
    }, [meter]);

    // Efecto para actualizar selectedKeys cuando meter cambie
    React.useEffect(() => {
        setShowLatitude(!selectedModify.includes('latitude'));
        setShowLongitude(!selectedModify.includes('longitude'));
        setShowTapa(!selectedModify.includes('tapa_desc'));
    }, [selectedModify]);

  //Usamos memo para describir la parte superior de la tabla como el buscador y los filtros
  const topContent = React.useMemo(() => {
    return (
      <TableTopContent
        usersLength = {metersLength}
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
    date
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

  const [encargado, setEncargado] = React.useState(null)


    const TablePopUpStatus = React.useMemo(()=>{
      return (
        <TableInfo
          topContent = {topContent}
          bottomContent = {bottomContent}
          sortDescriptor = {sortDescriptor}
          setSortDescriptor = {setSortDescriptor}
          headerColumns = {headerColumns}
          metersFetch = {metersFetch}
          renderCell = {renderCell}
          loadingState = {loadingState}
          isLoading = {isLoading}
        />
      )
    })
    
    const renderContent = (key) => {
      switch(key) {
        case 'details':
          return <MeterDetails meter={meter} onOpen={onOpen} setActivateStatus={setActivateStatus}/>;
        case 'edit':
        return (
          <MeterEdit
            meter={meter}
            selectedModify={selectedModify}
            selectedKeys={selectedKeys}
            setSelectedModify = {setSelectedModify}
            isInvalid = {isInvalid}
            setIsInvalid = {setIsInvalid}
            latitude = {latitude}
            setLatitude = {setLatitude}
            longitude = {longitude}
            setLongitude = {setLongitude}
            showLatitude = {showLatitude}
            showLongitude = {showLongitude}
            showTapa = {showTapa}
            setSelectedKeys = {setSelectedKeys}
            tapas = {tapas}
          />
        );
        case 'delete':
            fetchUpdateStatus();
            return messageFetch ? messageFetch : '...Ejecutando solicitud';
        case 'ScaleAlarm':
          return (
            <ScaleAlarm
              encargado={encargado}
              setEncargado={setEncargado}
              handleImageChange={handleImageChange}
              image={image}
            />
          )
        case 'ShowImage':
          return (
            <ShowImage
              meter={meter}
            />
          )
        default:
            return 'Acción no especificada.';
    }};


      //Función asincrónica para hacer llamado a la API y crear una incidencia
  const handleCreateIncidencia = async () => {
    // Crea el objeto incidencia basado en la lógica proporcionada
    const fechaActual = DateTime.fromFormat(meter.fecha, "yyyy/MM/dd HH:mm:ss", {
      zone: "America/Lima",
    });
    const meterCode = meter.meter_code; // Este es un ejemplo, asegúrate de obtener este valor dinámicamente
    const falloRegistro = meter.falla_desc
    const falloId = meter.falla

    // Validar que todos los valores estén presentes
    if (!meterCode || !fechaActual.isValid || !falloId || !encargado || !imageFile) {
      alert("Todos los campos son obligatorios. Por favor verifica los datos.");
      return; // Detener la ejecución si falta algún valor
    }

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

  return (
    <div>
      <MainModal
          onOpenChangeUpdate={onOpenChangeUpdate}
          isOpenUpdate = {isOpenUpdate}
          renderContent = {renderContent}
          actionKey = {actionKey}
          setLatitude = {setLatitude}
          setLongitude = {setLongitude}
          handleUpdate = {handleUpdate}
          handleCreateIncidencia = {handleCreateIncidencia}
          selectedModify = {selectedModify}
          meter={meter}
      />

    {/*Modal para las registros en revision e incidencia*/}
    <ModalTableInfo
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      activateStatus={activateStatus}
      messageFetch={messageFetch}
      meter={meter}
      setActivateStatus={setActivateStatus}
      setMessageFetch={setMessageFetch}
      fetchUpdateMeterData={fetchUpdateMeterData}
      TablePopUpStatus={TablePopUpStatus}
    />
    </div>
  );
};

export default PopUpModal;
