// TableTopContent.jsx
import React from 'react';
import { FaCheck } from "react-icons/fa6";
import { Input, Dropdown, Button, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { SearchIcon } from "../Shared/Icons/SearchIcon";
import StatusDropdown from './TopContentComponents/FilterSection/Dropdown/StatusDropdown';
import ColumnasDropdown from './TopContentComponents/FilterSection/Dropdown/ColumnasDropdown';
import CreadoresDropdown from './TopContentComponents/FilterSection/Dropdown/CreadoresDropdown';
import PaginationInfo from './TopContentComponents/PaginationInfo';

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
    usersLength,
    onRowsPerPageChange,
    dataStatusOptions
}) {
  //-----------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">

      {/*Aquí se configura el autocomplete*/}
      <Input
        isClearable
        isReadOnly = {false}
        classNames={{
          base: "w-2/5 sm:max-w-[60%]",
          inputWrapper: "border-1",
        }}
        placeholder="  Buscar por identificador del medidor..."
        size="sm"
        startContent={<SearchIcon className="mx-1 text-default-300" />}
        value={filterValue}
        variant="bordered"
        onClear={() => setFilterValue("")}
        onValueChange={onSearchChange}
        maxLength={15}
      />

      <div className="flex gap-3">
        <StatusDropdown selectedKeys={statusSelection} onSelectionChange={setStatusSelection} options={dataStatusOptions} />
        <CreadoresDropdown selectedKeys={statusFilter} onSelectionChange={setStatusFilter} options={statusOptions} />
        <ColumnasDropdown selectedKeys={visibleColumns} onSelectionChange={setVisibleColumns} options={columns} />
      </div>
    </div>
    <PaginationInfo
        usersLength={usersLength}
        onRowsPerPageChange={onRowsPerPageChange}
      />
  </div>
  );
}
