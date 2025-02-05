// SerialAutocomplete.jsx
import React from 'react';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';

const SerialAutocomplete = ({ suggestions, onAutocompleteChange }) => (
    <Autocomplete 
        className="w-full bg-gray-100 rounded-xl" 
        onInputChange={onAutocompleteChange}
        aria-hidden={true}
        listboxProps={{
        hideSelectedIcon: true,
        itemClasses: {
            base: [
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "dark:data-[hover=true]:bg-gray-100",
            "data-[pressed=true]:opacity-70",
            "data-[hover=true]:bg-default-200",
            "data-[selectable=true]:focus:bg-default-100",
            "data-[focus-visible=true]:ring-default-500",
            ],
        },
        }}
        aria-label="Select an employee"
        variant='flat'
        placeholder='Serial del medidor con incidencia'
        popoverProps={{
        offset: 10,
        classNames: {
            base: "rounded-large",
            content: "p-1 border-small border-black bg-gray-100 justify-center items-center",
            itemClasses: "hover"
        },
        }}
    >
    {suggestions.map((medidor) => (
      <AutocompleteItem key={medidor.meter_id} value={medidor.meter_code}>
        {medidor.meter_code}
      </AutocompleteItem>
    ))}
  </Autocomplete>
);

export default SerialAutocomplete;
