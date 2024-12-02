import { 
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    Spinner,
    TableRow,
    TableCell
} from "@nextui-org/react";

import React from "react";

const TableInfo = (
    {   
        topContent, 
        bottomContent, 
        sortDescriptor, 
        setSortDescriptor,
        headerColumns,
        metersFetch,
        renderCell,
        loadingState,
        isLoading
    }
    ) => {
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
    return(
    <Table
        isCompact
        removeWrapper
        topContent={topContent}
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        className="bg-white p-2 rounded-lg flex flex-col w-full"
        checkboxesProps={{
        classNames: {
            wrapper: "before:bg-black after:text-black text-black bg-gray-200 rounded-lg p-1",
        },
        }}
        classNames={classNames}
        sortDescriptor={sortDescriptor}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
    >
        {/*{column.uid === "actions" ? "end" : "end"}*/}
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
        emptyContent={"No se encontraros registros"} 
        items={metersFetch}
        loadingContent={
            <Spinner 
            label="Obteniendo Datos"
            className='flex top-[200px]'/>}
        loadingState={loadingState}
        isLoading={isLoading}
        >
        {(item) => (
            <TableRow 
            key={item.alarm_pk}
            >
            {(columnKey) => <TableCell>{renderCell(item, columnKey) === null ? 'NO DATA': renderCell(item, columnKey)}</TableCell>}
            </TableRow>
        )}
        </TableBody>
    </Table>
    )};

  export default TableInfo