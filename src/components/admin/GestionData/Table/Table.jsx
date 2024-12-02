import React from 'react';
import {Table, 
        TableHeader, 
        TableColumn, 
        TableBody,
        TableRow, 
        TableCell, 
        Spinner,
        Dropdown,
        DropdownTrigger,
        DropdownMenu,
        DropdownItem,
        Button,
        Chip
    } from "@nextui-org/react";
import { VerticalDotsIcon } from '../../Shared/Icons/VerticalDotsIcon';

    //Ejemplo para darle color a un estatus específico
const statusColorMap = {
    1: "success",
    0: "danger",
  };


const TableComponent = (
    {
        setSelectedGateway,
        bottomContent,
        sortDescriptor,
        setSortDescriptor,
        headerColumns,
        metersFetch,
        isLoading,
        loadingState,
        setActionKey,
        onOpen,
        setSelectedMeter
    }
) => {

    const classNames = React.useMemo(
        () => ({
          wrapper: ["w-full", "flex justify-center items-center"],
          table:["h-full w-full mt-5 mx-2"],
          th: ["bg-oi-bg py-2 h-full", "text-default-500", "", "border-divider","text-center"],
          td: [ 
            //Agregar las celdas en la mitad del componente
            "align-middle text-center px-1",
            // changing the rows border radius
            // first
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            // middle
            "group-data-[middle=true]:before:rounded-none",
            // last
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
          ]
        }),
        [],
      );

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
  
    
      //Realizar diferentes acciones dependiendo de la columkey
      switch (columnKey) {
          case "last_update_time":
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
            return cellValue ? (
              <>
                {`${year}-${month}-${day}`}
                <br />
                {`${hours}:${minutes}:${seconds}`}
              </>
            ): null;
          case "online_status":
            return (
              //Creo un componente Chip de tipo dot porque estamos agregando un boton de estatus
              <Chip
                variant="dot"
                size="sm"
                classNames={{
                    //Las caracteristicas de base se cambian con respecto a tailwind para el tamaño del componente chip dentro de su contenedot
                    base: "w-auto h-auto",
                    content: "",
                    //le doy un tamaño al punto, en este caso con un padding de 1 y un color de bg en este caso caracterizado por el mapeo del estatus key
                    dot: `bg-${statusColorMap[user.online_status]}`
                }}
                className="capitalize"
              >
                {cellValue === 1 ? 'Online' : cellValue === 0 ? 'Offline' : 'No Info'}
              </Chip>
            );
          //Ejecución en caso de que se active la columna de actions (los 3 puntos)
          case "actions":
            return (
              <div className="relative flex justify-center items-center text-center gap-5">
                {/*Establecemos un dropDown*/}
                <Dropdown 
                  className="bg-background border-1 border-default-200"
                  backdrop="blur"
                  onOpenChange={(isOpen) => {
                    // Aplica o elimina el atributo "inert" basado en si el dropdown está abierto
                    const dropdownMenu = document.getElementById('dropdown-menu');
                    if (dropdownMenu) {
                      dropdownMenu.inert = !isOpen;
                    }
                  }}
                  >
                  {/*Evento de dropdownTrigger*/}
                  <DropdownTrigger>
                    {/*Icono de 3 puntos verticales*/}
                    <Button 
                      isIconOnly 
                      radius="full" 
                      size="sm" 
                      variant="light"
                    >
                      <VerticalDotsIcon className="text-default-400" />
                    </Button>
                  </DropdownTrigger>
                  {/*Menú de acciones al oprimir los 3 puntos*/}
                  <DropdownMenu
                    id="dropdown-menu" // Asignar un ID para facilitar la referencia
                    aria-label="MenuActionKey"
                    variant="bordered"
                    itemClasses={{
                      base: [
                        //con bordeado
                        "rounded-md",
                        //Tamaño de texto 500
                        "text-default-500",
                        //Transición de la opacidad del blur
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    }}
                    //Dependiendo de las acciones a oprimir teniendo 3 opciones (details, edit, delete)
                    //Realizamos el evento OnAction()
                    onAction={(key) => {
                      switch (key) {
                        //Caso details
                        case 'details':
                          //Establecemos la llave de acceso cómo Details
                          setActionKey("details");
                          //Establecemos el medidor seleccionado por el medidor seleccionado
                          setSelectedMeter(user)
                          //Abrir el PopModal del componente PopUpModal.jsx
                          onOpen();
                          break;
                        case 'edit':
                          //Establecemos la llave de acceso cómo Edit
                          setActionKey("edit")
                          //Establecemos el medidor seleccionado por el medidor seleccionado
                          setSelectedMeter(user)
                          //Abrir el PopModal del componente PopUpModal.jsx
                          onOpen()
                          // Aquí puedes agregar el código para ejecutar tu función para el item 2
                          break;
                        default:
                          console.error('No function for this item.');
                      }
                    }}
                    >
                    {/*Item con la key Details*/}
                    <DropdownItem
                      key='details'
                      className="hover:bg-default-100"
                    >Ver Detalles
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            );
          default:
            return <span className='whitespace-pre-wrap break-words'>{cellValue}</span>;
        }
      }, []);

    return(
        <>
        <Table
          isCompact
          selectionMode='single'
          onSelectionChange={(Selection)=>{
            setSelectedGateway(Selection)
          }}
          removeWrapper
          //topContent={topContent}
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          className="px-2 rounded-[20px] flex flex-col items-center gap-0 place-items-center justify-center h-full w-full"
          checkboxesProps={{
            classNames: {
              wrapper: "before:bg-black after:text-black text-black bg-gray-200 rounded-[20px] px-10 ",
            },
          }}
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
          <TableBody 
            emptyContent={"No se encontraros registros"} 
            items={metersFetch}
            loadingContent={
              <Spinner 
                label="Obteniendo Datos"
                className='flex'/>}
            loadingState={loadingState}
            isLoading={isLoading}
            >
            {!isLoading ? (item) => (
              <TableRow 
                key={item.equip_id}
                >
                {(columnKey) => <TableCell>{renderCell(item, columnKey) === null ? 'NO DATA': renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            ):null}
          </TableBody>
        </Table>
        </>
    )
}

export default TableComponent