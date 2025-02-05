// PaginationInfo.jsx

import React from 'react';

const PaginationInfo = ({ usersLength, onRowsPerPageChange }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-default-400 text-small">
        Hay un total de {usersLength} alarmas registradas en el sistema
      </span>
      <label className="flex items-center text-default-400 text-small">
        Registros por página:
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
  );
};

export default PaginationInfo;
