// TableTopContent.jsx
import React from 'react';
import CreadoresDropdown from './TableTopContent/CreadoresDropdown';

export default function TableTopContent({
    statusFilter,
    setStatusFilter,
    statusOptions
}) {
  //-----------------------------------------------------------------------------------------------------------------------

  return (
    <div className="flex flex-col py-0 w-full h-[10vh]">
      <div className="flex justify-between place-items-center w-full h-full pr-[5vh]">
            <span className='text-medium text-center pl-[5vh]'>Filtros de selección</span>
            <CreadoresDropdown selectedKeys={statusFilter} onSelectionChange={setStatusFilter} options={statusOptions} />
      </div>
    </div>
  );
}
