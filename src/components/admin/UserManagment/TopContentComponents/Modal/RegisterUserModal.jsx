// TableTopContent.jsx
import React from 'react';
import { Input, Button, Divider} from "@nextui-org/react";
//import {useState, /*useEffect*/} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import IncidentTypeRadioGroup from './IncidentTypeRadioGroup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterUserModal = (
  { 
    nombre, 
    setNombre,
    email, 
    setEmail,
    user, 
    setUser,
    password,
    setPassword, 
    isOpen, 
    onOpenChange, 
    handleCreateUser, 
    selectedModify, 
    setSelectedModify, 
    setSelectedKeys, 
    isInvalid, 
    setIsInvalid 
  }
) => {
  
  const [openEye, setOpenEye] = React.useState(true);

  const handleClick = () => {
    setOpenEye(!openEye);
    console.log("Open: ", openEye)
  };

  return (
    <>
    <Modal 
      backdrop="tranparent" 
      shadow="lg"
      hideCloseButton={true}
      radius="lg"
      isOpen={isOpen} 
      size='2xl'
      onClose={()=>{
        setUser('')
        setEmail('')
        setPassword('')
        setNombre('')
      }}
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
          <ModalHeader className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx justify-center items-center">AGREGAR UN NUEVO USUARIO</ModalHeader>
            <ModalBody
              className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx"
              >
              <div className="flex">
                <div className="w-1/4">
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
                  className='mx-4 h-auto'
                />
                {/* Divisor vertical acá */}
                <div className='flex-col grid place-items-center w-full'>
                {/*Segunda Columna*/}
                  <div className="mx-auto w-full py-2">
                    <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Usuario del nuevo miembro del equipo</label>
                    <Input
                        type="name"
                        label=""
                        placeholder={`Usuario de inicio de sesión`}
                        labelPlacement="outside"
                        fullWidth
                        value={user}
                        onValueChange={setUser}
                        maxLength={20}
                        className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                      />
                    <div className='py-4'>
                      <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Nombre del operario</label>
                      <Input
                        type="name"
                        label=""
                        placeholder={`Nombre del encargado`}
                        labelPlacement="outside"
                        fullWidth
                        value={nombre}
                        onValueChange={setNombre}
                        maxLength={20}
                        className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                      />
                    </div>
                    <div className='py-4'>
                      <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Correo asociado al usuario</label>
                      <Input
                        type="email"
                        label=""
                        placeholder={`Correo del usuario`}
                        labelPlacement="outside"
                        fullWidth
                        value={email}
                        onValueChange={setEmail}
                        maxLength={25}
                        className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                      />
                    </div>

                    <div className='py-4'>
                      <div className='flex place-items-center justify-left pb-2'>
                      <label className={`mb-0.5 text-lg font-semibold mr-4`}>Contraseña para el usuario</label>  
                      <Button
                        onClick={handleClick}
                        className='ease-in-out duration-200 h-auto py-3 bg-custom-blue'
                        isIconOnly
                        >
                        {openEye ? <FaEye className='text-white' /> : <FaEyeSlash className='text-white'/>}
                      </Button>
                      </div>
                      <Input
                        type={openEye ? 'name' : 'password'}
                        label=""
                        placeholder={`Ingrese la contraseña`}
                        labelPlacement="outside"
                        fullWidth
                        value={password}
                        onValueChange={setPassword}
                        maxLength={20}
                        className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                      />
                    </div>
                    <div className='py-4'>
                      <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Confirme la contraseña</label>
                      <Input
                        type={openEye ? 'name' : 'password'}
                        label=""
                        placeholder={`Repita la contraseña`}
                        labelPlacement="outside"
                        fullWidth
                        //value={encargado}
                        //onValueChange={setEncargado}
                        maxLength={20}
                        className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                      />
                    </div>
                    {/*                    
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
                    {/*                    
                    </div>*/}
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
                onPress={handleCreateUser}
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

export default RegisterUserModal;
