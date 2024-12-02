import React, { useEffect, useState } from "react";
import { Divider } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
//Libreria para hacer un parse a los datos de tipo fecha
//Importar luxon para poder agregar zona horaria a un dato de tipo Fecha
import { DateTime } from 'luxon';
import { capitalize } from "../../../utils/utils";
import {parseZonedDateTime} from "@internationalized/date";
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Button,
    DateRangePicker,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { ChevronDownIcon } from "../Shared/Icons/ChevronDownIcon";

const SearchFiltersCard = ({ suggestions, statusCreators, setFilteredGatewayu, setDate, date, selectedKeys, setSelectedKeys, onSearchChange, setFilterValue }) => {

    return (
<div className="w-full h-full col-span-5 bg-white shadow-xl ml-2 rounded-[20px]">
                                <Card className="w-full h-full margin-auto">
                                    <CardHeader className="flex gap-3 h-1/9 py-2.5">
                                        <div className="flex flex-col">
                                            <p className="text-md">Filtros de busqueda</p>
                                        <p className="text-small text-default-500">Equipo de medición smart</p>
                                        </div>
                                    </CardHeader>
                                    <Divider/>
                                    <CardBody 
                                        className='h-4/6 flex justify-center'
                                        >
                                        {/*Aquí se configura el autocomplete*/}
                                        <div className='flex flex-col w-full h-full'>
                                            <span className="font-poppins font-regular text-gray-500 text-sm"> Filtrado por gateway</span>
                                            <Autocomplete 
                                                className="w-full bg-gray-100 rounded-xl" 
                                                onInputChange={onSearchChange}
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
                                                placeholder='Serial del gateway a detallar'
                                                popoverProps={{
                                                offset: 10,
                                                classNames: {
                                                    base: "rounded-large",
                                                    content: "p-1 border-small border-black bg-gray-100 justify-center items-center",
                                                    itemClasses: "hover"
                                                },
                                                }}
                                                onSelectionChange={
                                                    (key)=>{
                                                        setFilteredGatewayu(key)
                                                        console.log(key)
                                                    }
                                                }

                                                onClear={() => {setFilterValue("")}}
                                                >
                                                {suggestions.map((medidor) => (
                                                    <AutocompleteItem key={medidor.gateway_id} value={medidor.gateway_id}>
                                                        {medidor.gateway_id}
                                                    </AutocompleteItem>
                                                    ))
                                                    }
                                            </Autocomplete>
                                            <span className="font poppins font-regular mt-5 text-gray-500">Filtrado por fecha</span>
                                            <DateRangePicker
                                                hideTimeZone
                                                aria-label='Date Picker'
                                                value={date}
                                                onChange={setDate}
                                                autoFocus={true}
                                                variant='faded'
                                                description="Seleccione una fecha para filtrar"
                                                size="sm"
                                                className=''
                                                visibleMonths={1}
                                                calendarProps={{
                                                    classNames:{
                                                        base:"text-red-100",
                                                    cellButton: "text-gray-600",
                                                }
                                                }}
                                                classNames={{
                                                    input: "h-auto text-[13px] flex overflow-x-auto", //bg
                                                    base:"w-auto", //bg- wrapper del input, no del icono
                                                    innerWrapper: "text-[5px] w-full", //bg-total input
                                                    inputWrapper: "w-full text-[5px]", //bg-wrapper más externo
                                                    popoverContent: "bg-gray-200 border border-gray-300 shadow-lg",
                                                    selectorButton: "bg-gray-200 border p-4",
                                                    calendar: "bg-gray-200 text-red-100",
                                                    timeInputLabel: "bg-blue-200 border border-gray-100 round rounded-lg px-2 block"
                                                }}
                                                defaultValue={{
                                                    start: parseZonedDateTime("2024-04-01T00:45[America/lima]"),
                                                    end: DateTime.now().setZone('America/Lima').toFormat("yyyy-MM-dd'T'HH:mm:ss"),
                                                }}
                                                //color='danger'
                                            />
                                            {/*DropBox Status*/}
                                            <div className="w-full mt-5">
                                                <span className="font-poppins font-regular text-gray-500 text-sm"> Filtrado por base</span>
                                                <Dropdown>
                                                    <DropdownTrigger className="hidden w-full sm:flex">
                                                        <Button
                                                            fullWidth={true}
                                                            endContent={<ChevronDownIcon className="text-small text-custom-blue flex" />}
                                                            variant="bordered"
                                                            className="Capitalize justify-between w-full"
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
                                                        //selectedIcon={<FaCheck />}
                                                        onSelectionChange={setSelectedKeys}
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
                                                        {
                                                        statusCreators.map((status) => (
                                                        <DropdownItem 
                                                            key={status.name} 
                                                            className="capitalize hustify-between"
                                                            textValue={status.name}
                                                            >
                                                            <div>
                                                            {capitalize(status.name)} 
                                                            </div>
                                                        </DropdownItem>
                                                        ))
                                                        }
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
    );
};

export default SearchFiltersCard;
