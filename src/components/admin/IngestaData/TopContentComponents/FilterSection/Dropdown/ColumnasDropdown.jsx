import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from '@nextui-org/react';
import { ChevronDownIcon } from '../../../../Shared/Icons/ChevronDownIcon';
import { capitalize } from '../../../../../../utils/utils';

const ColumnasDropdown = ({ selectedKeys, onSelectionChange, options }) => (
    <Dropdown>
      <DropdownTrigger className="hidden sm:flex">
        <Button
          endContent={<ChevronDownIcon className="text-small text-custom-blue" />}
          variant="bordered"
          className="Capitalize"
        >
          Columnas
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Table Columns"
        closeOnSelect={false}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
        variant="flat"
        className="w-full rounded-lg"
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
        {options.map((column) => (
          <DropdownItem
            key={column.uid}
            className="capitalize justify-between"
            textValue={column.name}
          >
            {capitalize(column.name)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
  
  export default ColumnasDropdown;
  