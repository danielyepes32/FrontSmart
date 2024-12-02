// FilterSearchAndDatePicker.jsx

import React from 'react';
import { Input, DateRangePicker } from '@nextui-org/react';
import { SearchIcon } from '../../../Shared/Icons/SearchIcon';
import {parseZonedDateTime} from "@internationalized/date";
//import {parseAbsoluteToLocal} from "@internationalized/date";
import { DateTime } from 'luxon';

const FilterSearchAndDatePicker = ({
  filterValue,
  setFilterValue,
  onSearchChange,
  haFilterSelect,
  date,
  setDate
}) => {
  return (
    <div className='space-y-1 w-full flex flex-col justify-center place-items-start max-w-full'>
      <Input
        isClearable
        isReadOnly={false}
        classNames={{
          base: "w-full lg:w-full flex justify-center",
          inputWrapper: "border-1",
        }}
        placeholder="Buscar por identificador del medidor..."
        size="sm"
        className='flex min-h-full justify-between'
        startContent={<SearchIcon className="mx-1 text-default-300" />}
        value={filterValue}
        variant="flat"
        onClear={() => setFilterValue("")}
        onValueChange={onSearchChange}
        maxLength={16}
      />
      <DateRangePicker
        hideTimeZone
        aria-label='Date Picker'
        isDisabled={haFilterSelect}
        value={date}
        onChange={setDate}
        autoFocus={true}
        variant='faded'
        description="Seleccione una fecha para filtrar"
        size="sm"
        className='w-full lg:w-full flex justify-center'
        visibleMonths={1}
        calendarProps={{
          classNames: {
            base: "text-red-100",
            cellButton: "text-gray-600",
          }
        }}
        classNames={{
          popoverContent: "bg-gray-200 border border-gray-300 shadow-lg",
          selectorButton: "bg-gray-200 border p-4",
          calendar: "bg-gray-200 text-red-100",
          timeInputLabel: "bg-blue-200 border border-gray-100 rounded-lg px-2 block"
        }}
        defaultValue={{
          start: parseZonedDateTime("2024-04-01T00:45[America/lima]"),
          end: DateTime.now().setZone('America/Lima').toFormat("yyyy-MM-dd'T'HH:mm:ss"),
        }}
      />
    </div>
  );
};

export default FilterSearchAndDatePicker;
