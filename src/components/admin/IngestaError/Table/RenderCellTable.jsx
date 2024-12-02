import React from 'react';
import { Chip, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { VerticalDotsIcon } from '../../Shared/Icons/VerticalDotsIcon';

//Ejemplo para darle color a un estatus específico
const statusColorMap = {
  INCIDENCIA: "danger",
  ALARMA: "warning",
};
  

const renderCell = (user, columnKey, setActionKey, setSelectedMeter, onOpen) => {
  const cellValue = user[columnKey];

  //Realizar diferentes acciones dependiendo de la columkey
  switch (columnKey) {
    case "tipo":
      return (
        console.log(user),
        //Creo un componente Chip de tipo dot porque estamos agregando un boton de estatus
        <Chip
          variant="dot"
          size="sm"
          classNames={{
              //Las caracteristicas de base se cambian con respecto a tailwind para el tamaño del componente chip dentro de su contenedot
              base: "w-auto h-auto",
              content: "px-1",
              //le doy un tamaño al punto, en este caso con un padding de 1 y un color de bg en este caso caracterizado por el mapeo del estatus key
              dot: `p-1 bg-${statusColorMap[user.tipo]}`
          }}
          className="capitalize gap-4"
        >
          {cellValue}
        </Chip>
      );
    case "actions":
      return (
        <div className="relative flex justify-center items-center text-center gap-5">
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
            <DropdownTrigger>
              <Button 
                isIconOnly 
                radius="full" 
                size="sm" 
                variant="light"
                aria-hidden={false}
                aria-modal={true}
              >
                <VerticalDotsIcon 
                  className="text-default-400" 
                  aria-hidden={false}
                  aria-modal={true}
                  />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              id="dropdown-menu" // Asignar un ID para facilitar la referencia
              aria-label="MenuActionKey"
              variant="bordered"
              itemClasses={{
                base: [
                  "rounded-md",
                  "text-default-500",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[selectable=false]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                ],
              }}
              onAction={(key) => {
                switch (key) {
                  case 'details':
                    //console.log('Item 1 was selected.');
                    setActionKey("details");
                    //console.log("registro seleccionado", user.meter_id);
                    setSelectedMeter(user)
                    onOpen();
                    // Aquí puedes agregar el código para ejecutar tu función para el item 1
                    break;
                  case 'edit':
                    //console.log('Item 2 was selected.');
                    setActionKey("edit")
                    setSelectedMeter(user)
                    onOpen()
                    // Aquí puedes agregar el código para ejecutar tu función para el item 2
                    break;
                  case 'delete':
                    //console.log('Item 3 was selected.');
                    setActionKey("delete")
                    setSelectedMeter(user)
                    onOpen()
                    // Aquí puedes agregar el código para ejecutar tu función para el item 3
                    break;
                  case 'ScaleAlarm':
                    console.log("Entra a scatterPlot")
                    setActionKey("ScaleAlarm")
                    setSelectedMeter(user)
                    onOpen()
                    break;
                  case 'ShowImage':
                    setActionKey("ShowImage")
                    setSelectedMeter(user)
                    onOpen()
                    break;
                  default:
                    console.log('No function for this item.');
                }
              }}
              >
              <DropdownItem
                key='details'
                className="hover:bg-default-100"
              >Ver Detalles
              </DropdownItem>
              {/*
              <DropdownItem
                key='edit'
                className="hover:bg-default-100"
              >
                Editar Datos</DropdownItem>
              */}
              <DropdownItem
                key='ScaleAlarm'
                className={`text-danger hover:bg-red-200 ${user.tipo === "INCIDENCIA" ? 'hidden' : ''}`} //Esconder en caso de ser un registro de tipo INCIDENCIA
                color="danger"
              >Escalar a incidencia</DropdownItem>
              <DropdownItem
                key='ShowImage'
                className={`hover:bg-default-100 ${user.tipo === "INCIDENCIA" ? '' : 'hidden'}`} //Esconder en caso de ser un registro de tipo INCIDENCIA
              >Mostrar Imagen</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    default:
      return cellValue;
  }
};

export default renderCell;
