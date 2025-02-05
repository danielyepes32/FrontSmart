// DropdownPanel.jsx

import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from '../../../Shared/Icons/ChevronDownIcon';
import { PlusIcon } from '../../../Shared/Icons/PlusIcon';
import { FaCheck } from 'react-icons/fa';
import { capitalize } from '../../../../../utils/utils';

const DropdownPanel = ({
  onOpen,
}) => {
  return (
    <div className='mb-4 place-items-center lg:pl-10 lg:space-x-3 justify-end flex flex-col md:space-x-0 sm:space-x-0 md:flex-row sm:flex-row w-full'>
      
      {/* Button to Add Incident */}
      <span>Oprima este botón para crear un nuevo usuario </span>
      <Button
        className="bg-custom-blue text-background"
        endContent={<PlusIcon />}
        isIconOnly
        onClick={onOpen}
      >
      </Button>
    </div>
  );
};

export default DropdownPanel;
