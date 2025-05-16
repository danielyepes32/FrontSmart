import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { ChevronDownIcon } from "../../../../Shared/Icons/ChevronDownIcon";
import { FaCheck } from "react-icons/fa";
import { capitalize } from "../../../../../../utils/utils";
import React, { useState } from "react";

const CreadoresDropdown = ({ selectedKeys, onSelectionChange, options }) => {

  return (
    <Dropdown>
      <DropdownTrigger className="hidden sm:flex">
        <Button
          endContent={<ChevronDownIcon className="text-small text-custom-blue" />}
          variant="bordered"
          className="Capitalize"
        >
          Usuarios
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Table Columns"
        variant="flat"
        closeOnSelect={false}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        selectedIcon={<FaCheck />}
        onSelectionChange={(keys) => {
          keys.has("all") ? null : onSelectionChange(keys);
        }}
        className="w-full rounded-lg text-left"
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
        <DropdownItem
          isSelected = {false}
          hideSelectedIcon = {true}
          className="capitalize justify-between"
          onClick={() => {
            if ((selectedKeys.size >= options.length)|| selectedKeys == 'all'){
              const keys = new Set([options[0].name])
              onSelectionChange(keys)
            } else {
              const allKeys = new Set([...options.map((creator) => creator.name)]);
              onSelectionChange(allKeys);
            }
          }}
        >
          <span className="font-bold">SELECCIONAR TODOS</span>
        </DropdownItem>
        {options.map((creator) => (
          <DropdownItem
            key={creator.name}
            className="capitalize justify-between"
            textValue={creator.name}
          >
            {capitalize(creator.name)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CreadoresDropdown;
