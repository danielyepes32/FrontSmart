// DropdownPanel.jsx

import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from '../../../Shared/Icons/ChevronDownIcon';
import { PlusIcon } from '../../../Shared/Icons/PlusIcon';
import { FaCheck } from 'react-icons/fa';
import { capitalize } from '../../../../../utils/utils';

const DropdownPanel = ({
  statusSelection,
  setStatusSelection,
  statusFilter,
  setStatusFilter,
  visibleColumns,
  setVisibleColumns,
  onOpen,
  firstColumn,
  secondColumn,
  statusOptions,
  columns
}) => {
  return (
    <div className='lg:pl-10 lg:space-x-3 justify-between flex flex-col md:space-x-0 sm:space-x-0 md:flex-row sm:flex-row w-full'>
      
      {/* Dropdown for Status */}
      <Dropdown>
        <DropdownTrigger className="sm:flex">
          <Button
            endContent={<ChevronDownIcon className="text-small text-custom-blue" />}
            variant="bordered"
            className="Capitalize"
          >
            Falla
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Table Columns"
          variant="flat"
          closeOnSelect={false}
          selectedKeys={statusSelection}
          selectionMode="multiple"
          selectedIcon={<FaCheck />}
          onSelectionChange={setStatusSelection}
          className="w-auto rounded-lg text-left"
          classNames={{ list: "grid grid-cols-2 w-[400px] gap-1 text-center p-2" }}
          itemClasses={{
            base: [
              "rounded-lg",
              "font-bold",
              "text-black",
              "data-[selectable=true]:focus:bg-custom-blue",
              "data-[selectable=true]:focus:text-white",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          }}
        >
          {firstColumn.map((status) => (
            <DropdownItem
              key={status.name}
              className="capitalize justify-between"
              selectedIcon={({ isSelected, isDisabled }) => isSelected && !isDisabled ? <FaCheck /> : null}
              textValue={status.name}
            >
              <div>{capitalize(status.name)}</div>
            </DropdownItem>
          ))}
          {secondColumn.map((status) => (
            <DropdownItem
              key={status.name}
              className="capitalize justify-between"
              selectedIcon={({ isSelected, isDisabled }) => isSelected && !isDisabled ? <FaCheck /> : null}
              textValue={status.name}
            >
              <div>{capitalize(status.name)}</div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Dropdown for Failure Type */}
      <Dropdown>
        <DropdownTrigger className="sm:flex">
          <Button
            endContent={<ChevronDownIcon className="text-small text-custom-blue" />}
            variant="bordered"
            className="Capitalize"
          >
            Tipo de Falla
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Table Columns"
          variant="flat"
          closeOnSelect={false}
          selectedKeys={statusFilter}
          selectionMode="multiple"
          onSelectionChange={setStatusFilter}
          className="w-auto mx-auto rounded-lg text-left p-3"
          itemClasses={{
            base: [
              "rounded-lg",
              "font-bold",
              "text-black",
              "data-[selectable=true]:focus:bg-custom-blue",
              "data-[selectable=true]:focus:text-white",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          }}
        >
          {statusOptions.map((status) => (
            <DropdownItem
              key={status.name}
              className="capitalize justify-between"
              selectedIcon={({ isSelected, isDisabled }) => isSelected && !isDisabled ? <FaCheck /> : null}
              textValue={status.name}
            >
              <div>{capitalize(status.name)}</div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Dropdown for Columns */}
      <Dropdown>
        <DropdownTrigger className="sm:flex bg-white">
          <Button
            endContent={<ChevronDownIcon className="text-small text-custom-blue" />}
            variant="bordered"
            className="Capitalize w-auto"
          >
            Columnas
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Table Columns"
          closeOnSelect={false}
          selectedKeys={visibleColumns}
          selectionMode="multiple"
          onSelectionChange={setVisibleColumns}
          variant="flat"
          className="w-full rounded-lg p-2"
          itemClasses={{
            base: [
              "rounded-lg",
              "font-bold",
              "text-black",
              "data-[selectable=true]:focus:bg-custom-blue",
              "data-[selectable=true]:focus:text-white",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          }}
        >
          {columns.map((column) => (
            <DropdownItem
              key={column.uid}
              className="capitalize justify-between"
              selectedIcon={({ isSelected, isDisabled }) => isSelected && !isDisabled ? <FaCheck /> : null}
              textValue={column.name}
            >
              <div>{capitalize(column.name)}</div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Button to Add Incident */}
      <Button
        className="bg-custom-blue text-background"
        endContent={<PlusIcon />}
        onClick={onOpen}
      >
        Agregar Incidencia
      </Button>
    </div>
  );
};

export default DropdownPanel;
