// TableTopContent.jsx
import React from 'react';

export default function TableTopContent({
    onRowsPerPageChange,
}) {
  //-----------------------------------------------------------------------------------------------------------------------

  return (
    <div className="flex flex-col py-0">
      <div className="flex justify-between gap-3 items-end">
        <div className="flex flex-wrap items-center w-full justify-between min-h-full sm:space-x-2 sm:space-y-0">
        <label className="flex items-center text-default-400 text-small">
            Registros por pagina:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              defaultValue="5"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
