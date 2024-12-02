import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from '@nextui-org/react';
import { ChevronDownIcon } from '../../../../Shared/Icons/ChevronDownIcon';
import { FaCheck } from 'react-icons/fa';
import { capitalize } from '../../../../../../utils/utils';

const StatusDropdown = ({ selectedKeys, onSelectionChange, options }) => (
  <Dropdown>
    <DropdownTrigger className="hidden sm:flex">
      <Button
        endContent={<ChevronDownIcon className="text-small text-custom-blue" />}
        variant="bordered"
        className="Capitalize"
      >
        Status
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
      onSelectionChange={onSelectionChange}
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
      {options.map((status) => (
        <DropdownItem
          key={status.name}
          className="capitalize justify-between"
          textValue={status.name}
        >
          {capitalize(status.name)}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </Dropdown>
);

export default StatusDropdown;
