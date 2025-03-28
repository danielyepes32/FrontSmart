// TableTopContent.jsx
import React from 'react';
import { Input, Dropdown, Button, DropdownTrigger, DropdownMenu, DropdownItem, Divider} from "@nextui-org/react";
import { ChevronDownIcon  } from '../../../Shared/Icons/ChevronDownIcon';
import { capitalize } from '../../../../../utils/utils';
//import {useState, /*useEffect*/} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import {Autocomplete, AutocompleteItem} from '@nextui-org/react'
import IncidentTypeRadioGroup from './IncidentTypeRadioGroup';
import ImageUpload from './ImageUpload';
import SerialAutocomplete from './SerialAutocomplete';

const AddIncidenciaModal = ({ isOpen, onOpenChange, onAutocompleteChange, dataStatusOptions, suggestions, data, handleImageChange, image, setEncargado, encargado, handleCreateIncidencia, selectedModify, setSelectedModify, selectedKeys, setSelectedKeys, isInvalid, setIsInvalid }) => {
  return (
    <>
    <Modal 
      backdrop="tranparent" 
      shadow="lg"
      hideCloseButton={true}
      radius="lg"
      isOpen={isOpen} 
      size='2xl'
      onOpenChange={onOpenChange}
      classNames={{
        backdrop: ""
      }}
      className="items-center justify-center h-auto"
      scrollBehavior="outside"
      >
      <ModalContent>
        {(onClose) => (
          <>
          <ModalHeader className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx justify-center items-center">AGREGAR UNA NUEVA INCIDENCIA</ModalHeader>
            <ModalBody
              className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx"
              >
              <div className="flex">
                <div className="w-1/3">
                  <IncidentTypeRadioGroup
                    selectedModify={selectedModify}
                    setSelectedModify={setSelectedModify}
                    isInvalid={isInvalid}
                    setIsInvalid={setIsInvalid}
                    setSelectedKeys={setSelectedKeys}
                  />
                </div>
                {/* Divisor vertical acá */}
                <Divider 
                  orientation='vertical' 
                  className='mx-4 my-auto h-[40vh]'
                />
                {/* Divisor vertical acá */}
                <div className='flex-col grid place-items-center'>
                {/*Segunda Columna*/}
                  <div className="mx-auto w-full py-2">
                    <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Serial del medidor con incidencia</label>
                    <SerialAutocomplete suggestions={suggestions} onAutocompleteChange={onAutocompleteChange} />
                    <div className='py-4'>
                      <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Nombre de quien registra la falla</label>
                      <Input
                        type="name"
                        label=""
                        placeholder={`Nombre del encargado ( default: Plataforma )`}
                        labelPlacement="outside"
                        fullWidth
                        value={encargado}
                        onValueChange={setEncargado}
                        maxLength={20}
                        className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                      />
                    </div>
                    <label className={`mb-0.5 text-lg font-semibold mx-auto `}>Descripción de la falla</label>
                    <div className={`transition-max-height duration-500 ease-in-out overflow-hidden`}>
                      <Dropdown>
                        <DropdownTrigger className="sm:flex bg-white w-full justify-start">
                          <Button
                            endContent={<ChevronDownIcon className="text-small text-custom-blue" />}
                            variant="bordered"
                            className="Capitalize"
                          >
                            {selectedKeys}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          disallowEmptySelection
                          aria-label="Table Columns"
                          selectedKeys={selectedKeys}
                          selectionMode="single"
                          onSelectionChange={setSelectedKeys}
                          variant="flat"
                          className="w-full rounded-lg"
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
                          {data.filter(item => item.filter === selectedModify).map((column) => (
                            <DropdownItem 
                              key={column.name} 
                              className="capitalize justify-between"
                            >
                              {capitalize(column.name)}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                      <ImageUpload handleImageChange={handleImageChange} image={image} />
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter
              className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx"
            >
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              {/*Con este botón se insertan los datos del Modal a la tabla de incidencias*/}
              <Button 
                className="bg-custom-blue text-white" 
                onPress={handleCreateIncidencia}
                >
                Confirmar
              </Button>
            </ModalFooter>
          </>
          )}
      </ModalContent>
    </Modal>
    </>
  );
};

export default AddIncidenciaModal;
