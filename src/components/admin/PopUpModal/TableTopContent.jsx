// TableTopContent.jsx
import React from 'react';

export default function TableTopContent({
    usersLength,
    onRowsPerPageChange,
}) {
  //-----------------------------------------------------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-4">
    <div className="flex justify-between gap-3 items-end">
    <div className="flex flex-wrap items-center w-full justify-between min-h-full sm:space-x-2 sm:space-y-0">

      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-default-400 text-small">Hay un total de {usersLength} alarmas posterior a la actualización del status</span>
      <label className="flex items-center text-default-400 text-small">
        Registros por pagina:
        <select
          className="bg-transparent outline-none text-default-400 text-small"
          onChange={onRowsPerPageChange}
          defaultValue="10"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </label>
    </div>
  </div>
  );
}
