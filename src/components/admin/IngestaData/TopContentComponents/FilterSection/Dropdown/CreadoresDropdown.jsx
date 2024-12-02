import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from '@nextui-org/react';
import { ChevronDownIcon } from '../../../../Shared/Icons/ChevronDownIcon';
import { FaCheck } from 'react-icons/fa';
import { capitalize } from '../../../../../../utils/utils';

const CreadoresDropdown = ({ selectedKeys, onSelectionChange, options }) => (
    <Dropdown>
      <DropdownTrigger className="hidden sm:flex">
        <Button
          endContent={<ChevronDownIcon className="text-small text-custom-blue" />}
          variant="bordered"
          className="Capitalize"
        >
          Creadores
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
  
  export default CreadoresDropdown;
  