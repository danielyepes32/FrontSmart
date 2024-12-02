//Librería De servicios integrados de react
import React from "react";
//Importaciones de librerias nextUI para los diferentes componentes 
import {
  Table, //Componente tabla 
  TableHeader, //Componente header de la tabla
  TableColumn, //componente columnas de la tabla
  TableBody, //Componente body para identificar si poner algún texto o las celdas
  TableRow, //Componente que establece las filas de un registro
  TableCell, //Componente que representa una zelda de cada registro
  Spinner,
} from "@nextui-org/react";

import renderCell from "./RenderCellTable";

const CustomTable = ({
  bottomContent,
  selectedKeys,
  setSelectedKeys,
  sortDescriptor,
  setSortDescriptor,
  topContent,
  headerColumns,
  meters,
  loadingState,
  isLoading,
  //renderCell,
  popUp,
  setActionKey,
  setSelectedMeter,
  onOpen
}) => {

  //configuración tailwind para los componentes de la tabla de nextUI
  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider","text-center"],
      td: [ 
        //Agregar las celdas en la mitad del componente
        "align-middle text-center",
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
      <div className="w-full h-full">
        <Table
          isCompact
          removeWrapper
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          className="bg-white p-4 rounded-lg flex flex-col w-full overflow-x-auto h-auto"
          checkboxesProps={{
            classNames: {
              wrapper: "bg-gray-200 rounded-lg p-1",
            },
          }}
          classNames={classNames}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align="start"
                allowsSorting={column.sortable}
                className="text-center"
                width="flex"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody 
            emptyContent="No se encontraron medidores"
            items={meters}
            loadingContent={
              <Spinner 
                label="Obteniendo Datos"
                className="flex top-[200px]"
              />
            }
            loadingState={loadingState}
            isLoading={isLoading}
          >
            {(item) => (
              <TableRow key={item.meter_id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey, setActionKey, setSelectedMeter, onOpen) === null 
                        ? 'NO DATA' 
                        : renderCell(item, columnKey, setActionKey, setSelectedMeter, onOpen)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div>
          {popUp}
        </div>
      </div>
  );
};

export default CustomTable;
