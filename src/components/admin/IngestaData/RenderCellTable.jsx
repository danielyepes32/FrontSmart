import React from 'react';
import { Chip, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { VerticalDotsIcon } from '../Shared/Icons/VerticalDotsIcon';

//Ejemplo para darle color a un estatus específico
const statusColorMap = {
    NORMAL: "success",
    INCIDENCIA: "danger",
    REVISION: "warning",
    'NO OPERATIVO': "custom-blue"
  };
  

const renderCell = (user, columnKey, setActionKey, setSelectedMeter, onOpen) => {
  const cellValue = user[columnKey];

  switch (columnKey) {
    case "status":
      return (
        <Chip
          variant="dot"
          size="sm"
          classNames={{
            base: "w-auto h-auto px-1",
            content: "px-1",
            dot: `p-1 bg-${statusColorMap[user.status]}`
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
              >
                <VerticalDotsIcon className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              id="dropdown-menu"
              aria-label="MenuActionKey"
              variant="bordered"
              itemClasses={{
                base: [
                  "rounded-md",
                  "text-default-500",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              }}
              onAction={(key) => {
                setActionKey(key);
                setSelectedMeter(user);
                onOpen();
              }}
            >
              <DropdownItem key="details" className="hover:bg-default-100">
                Ver Detalles
              </DropdownItem>
              <DropdownItem key="edit" className="hover:bg-default-100">
                Editar Datos
              </DropdownItem>
              <DropdownItem key="delete" className="text-danger hover:bg-red-200" color="danger">
                Eliminar Status
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );

    default:
      return cellValue;
  }
};

export default renderCell;
