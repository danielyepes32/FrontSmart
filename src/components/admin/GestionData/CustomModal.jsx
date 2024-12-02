import React, { useState } from 'react';
import { Button } from '@nextui-org/button';
import {  
  Modal,   
  ModalContent,   
  ModalHeader,   
  ModalBody,   
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Chip, table } from '@nextui-org/react';
import axios from 'axios';
import {Divider} from "@nextui-org/divider";

import { ChevronDownIcon } from '../Shared/Icons/ChevronDownIcon';
import { capitalize } from '../../../utils/utils';
import apiService from '../../../services/apiService';
import {columsGatewayLogs} from "../../../utils/tests/data"  //"../../utils/tests/data";
//Libreria para hacer un parse a los datos de tipo fecha
import {parseAbsoluteToLocal} from "@internationalized/date";
//Importar luxon para poder agregar zona horaria a un dato de tipo Fecha
import { DateTime } from 'luxon';
import {
  Table, //Componente tabla 
  TableHeader, //Componente header de la tabla
  TableColumn, //componente columnas de la tabla
  TableBody, //Componente body para identificar si poner algún texto o las celdas
  TableRow, //Componente que establece las filas de un registro
  TableCell, //Componente que representa una zelda de cada registro
  Spinner,
  chip,
} from "@nextui-org/react";
//Componente superior de la pagina
import TableTopContent from "../../../components/admin/PopUpModal/TableTopContent";
import TableBottomContent from '../../../components/admin/PopUpModal/TableBottomContent'

//Las columnas se pueden agregar o eliminar de la vista, aquí inicializamos por default las necesarias
const INITIAL_VISIBLE_COLUMNS = ["log_id", "equip_id", "status_time","online_status"];
//Ejemplo para darle color a un estatus específico
const statusColorMap = {
  1: "success",
  0: "danger",
};

const CustonModal = ({selectedGateway, isVisible, setIsVisible,}) => {

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
  const [metersLength, setMetersLength] = React.useState(2);
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
  const loadingState = isLoading === true ? "loading" : "idle"
  

  //Constante para establecer si se esta ejecutando el autocomplete
  const [filterValue, setFilterValue] = React.useState("");
      //Constante para establecer las columnas visibles puesto que estas son dinamicas
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [messageFetch, setMessageFetch] = React.useState("");

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  console.log("Visible: ",isVisible)

  React.useEffect(() => {
    if(isVisible === true){
      console.log("entra 1")
      onOpen()
    }else if (isVisible === false){
      null
    }
  }, [isVisible]);

  React.useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        // Consultar la API para obtener los datos de los últimos 24 horas
        console.log("Data consulta: ", selectedGateway.equip_id)
        const response = await axios.get(`http://localhost:8000/api/v1/logs/${selectedGateway.equip_id}/?page=${page}&page_size=${rowsPerPage}`);
        const data = response.data.results;
        console.log("Data del fetch: ", response)
        setMeters(data)
        setMetersLength(response.data.count)
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }

      setIsLoading(false)
    };
    fetchData();
  }, [selectedGateway, page, rowsPerPage]);

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
          console.log("Entra aquí: ", user)
          //Realizar diferentes acciones dependiendo de la columkey
          switch (columnKey) {
            case "status_time":
              // Crear un objeto de fecha a partir del string
              const date = new Date(cellValue);
    
              // Obtener los componentes de la fecha
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
              const day = String(date.getDate()).padStart(2, '0');
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              const seconds = String(date.getSeconds()).padStart(2, '0');
    
              // Formatear la fecha en el formato deseado
              return cellValue ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`: null;
            case "online_status":
              const status = cellValue ? 1 : 0
              return (
                //Creo un componente Chip de tipo dot porque estamos agregando un boton de estatus
                <Chip
                  variant="dot"
                  size="sm"
                  aria-label={`Status: ${status}`} // Agrega aria-label aquí
                  classNames={{
                      //Las caracteristicas de base se cambian con respecto a tailwind para el tamaño del componente chip dentro de su contenedot
                      base: "w-auto h-auto px-1",
                      content: "px-1",
                      //le doy un tamaño al punto, en este caso con un padding de 1 y un color de bg en este caso caracterizado por el mapeo del estatus key
                      dot: `p-1 bg-${statusColorMap[status]}`
                  }}
                  className="capitalize gap-4"
                >
                  {status === 1 ? 'Online' : 'Offline'}
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
      
          if (visibleColumns === "all") return columsGatewayLogs;
      
          return columsGatewayLogs.filter((column) => Array.from(visibleColumns).includes(column.uid));
        }, [visibleColumns]);//Se ejecuta cada que hay un cambio en la constante vsisibleColumns
      
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
        selectedKeys={'Emtra'}
        itemsLength={metersLength}
        hasSearchFilter={hasSearchFilter}
      />
    );
  }, [{/*selectedKeys*/}, metersLength, page, pages, hasSearchFilter]);
  //configuración tailwind para los componentes de la tabla de nextUI
  const classNames = React.useMemo(
    () => ({
      wrapper: ["", "max-w-3xl"],
      table:"h-full",
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider","text-center"],
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
    const TablePopUpStatus = React.useMemo(()=>{
      return (
        <>
        <Table
          isCompact
          removeWrapper
          topContent={topContent}
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          className="bg-white p-2 rounded-lg flex flex-col w-full h-full"
          classNames={classNames}
          sortDescriptor={sortDescriptor}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
        >
          {/*{column.uid === "actions" ? "end" : "end"}*/}
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align="start"
                allowsSorting={column.sortable}
                className="text-center"
                width="flex"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          {/*
          */}
          <TableBody 
            emptyContent={"No se encontraros registros"} 
            items={metersFetch}
            loadingContent={
              <Spinner 
                label="Obteniendo Datos"
                className='flex'/>}
            loadingState={loadingState}
            isLoading={isLoading}
            >{!isLoading ? (item) => (
              <TableRow 
                key={item.log_id}
                >
                {(columnKey) => <TableCell>{renderCell(item, columnKey) === null ? 'NO DATA': renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            ): null}
          </TableBody>
        </Table>
        </>
      )
    },[metersFetch, isLoading, loadingState])


  return (
    <Modal 
      isOpen={isOpen} 
      size='2xl'
      placement="center"
      onOpenChange={()=>{
        onOpenChange()
        console.log("isOpen: ", isVisible)
      }}
      onClose={()=>{
        console.log("Visible: " , isVisible)
        setIsVisible(false)
        console.log("Se cerró")
        console.log("Visible: " , isVisible)
      }}
      className="mx-5 w-auto"
      scrollBehavior='outside'
    >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1 text-center font-mulish font-bold text-[30px]">Registros de modificación de status</ModalHeader>
          <div className='border border-2 border-gray-400 mx-5 rounded-[20px]'></div>
          <ModalBody className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx h-auto">
                <aside className='h-auto'>
                  {TablePopUpStatus}
                </aside>            
          </ModalBody> 
          <ModalFooter>
            <div className='w-full h-full'>
              <div className='w-full h-full flex justify-center items-center place-items-center'>
                <Button 
                className='bg-red-300 text-white w-full mx-5 py-2'
                onPress={()=>{
                  setIsVisible(false)
                  onClose()
                }}
                >
                Cerrar
              </Button>
              </div>
            </div>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
  )
};

export default CustonModal;
