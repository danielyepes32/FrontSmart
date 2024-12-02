import React from 'react';
import {
        Divider, 
        Button,
        DropdownTrigger, //Componente para establecer la ejecución de un dropBox
        Dropdown, //Componente dropbox
        DropdownMenu, //Componente que representa los elementos desplegados 
        DropdownItem, //Componente que representa los elementos de un menú en un dropbox
        Modal, 
        ModalContent, 
        ModalHeader, 
        ModalBody, 
        ModalFooter,
        Input,
        Autocomplete,
        AutocompleteItem
    } from "@nextui-org/react";
import { ChevronDownIcon } from '../Shared/Icons/ChevronDownIcon';

import { capitalize } from "../../../utils/utils";

import apiService from '../../../services/apiService';

const PopUpGestion = (
    {
        isOpen,
        onOpenChange,
        actionKey,
        setActionKey,
        gatewayPost,
        setGatewayPost,
        latitudeGatewayPost,
        longitudeGatewayPost,
        setLongitudeGatewayPost,
        setLatitudeGatewayPost,
        selectedKeys,
        setSelectedKeys,
        statusCreators,
        selectedMeter,
        setIsOpenCustomMessage,
        handleCreateGateway
    }
    ) => {

    //Constante para establecer si se esta ejecutando el autocomplete
    const [filterValue, setFilterValue] = React.useState("");
    //Este dato almacena el valor que se está escribiendo en las inputs para modificar la longitude
    const [page, setPage] = React.useState(1);
    //Esta variable guarda los posibles valores de gateways recolectados en la API para los gateways en el autocomplete
    const [suggestions, setSuggestions] = React.useState([])

    //Al cambiar el valor de la busqueda del autocomplete este se va actualizando en tiempo real con este callback
    const onSearchChange = React.useCallback((value) => {
      if (value) {
      setFilterValue(value);
      setPage(1);
      } else {
      setFilterValue("");
      }
      console.log("Valor autocomplete: ", value)
    }, []);

    //Funciones condicionales 
    //Función para obtener los gateways del autocomplete
    React.useMemo(() => {
  
      //Al estar ejecutando el fetch activamos el loading de la data
      console.log("FilterValue: ", filterValue)
      if (filterValue.length > 0) {
        //setIsLoading(true);
        const fetchSuggestions = async () => {
          try {
          //inizializamos los parametros de consultas a la API de consumo
          //console.log("No ha salido")
          const params = {
            q: filterValue,
            page:1,
            page_size : 10
          };
          
          const response = await apiService.autocompleteGateway(params);;
          setSuggestions(response["results"]);
              //usamos el componente "count" de la consulta para establecer el tamaño de los registros
          } catch (error) {
            //En caso de error en el llamado a la API se ejecuta un console.error
            console.error('Error fetching initial meters:', error);
          } finally {
            //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
            //console.log("salio");
          }
        };

        fetchSuggestions();
      }
    }, [filterValue,page,]);

    return(
        <>
        <Modal 
        backdrop="tranparent" 
        shadow="lg"
        hideCloseButton={true}
        radius="lg"
        placement="center"
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: "blur"
        }}
        className="flex items-center justify-center"
        scrollBehavior="outside"
        size='2xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx justify-center items-center">{actionKey=== 'details' ? 'DETALLES DEL MEDIDOR' : 'AGREGAR UN NUEVO GATEWAY'}</ModalHeader>
              <ModalBody
                className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx h-auto"
              >
                {
                React.useMemo(()=>{
                return actionKey !== 'details' ? (
                  <div className="flex">
                    {/* Divisor vertical acá */}
                    <Divider 
                      orientation='vertical'
                      className='h-[25vh] mx-4 place-items-center justify-center my-auto'
                    />
                      {/* Divisor vertical acá */}
                      <div className='flex-col grid place-items-center w-full'>
                      {/*Segunda Columna*/}
                        <div className="mx-auto w-full">
                          <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Serial del nuevo gateway</label>
                          
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
                            placeholder='Serial del gateway ( Campo requerido )'
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
                                    setGatewayPost(key)
                                    console.log("gatewayPost: ", gatewayPost)
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
                          <div>
                            <label className={`mb-0.5 text-lg font-semibold mx-auto`}>latitude del gateway</label>
                            <Input
                              type="number"
                              label=""
                              placeholder={`Ingrese la latitud del gateway( Campo requerido )`}
                              labelPlacement="outside"
                              fullWidth
                              value={latitudeGatewayPost}
                              onValueChange={setLatitudeGatewayPost}
                              className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                            />
                          </div>
                          <div>
                            <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Longitud del gateway</label>
                            <Input
                              type="number"
                              label=""
                              placeholder={`Ingrese la longitud del medidor ( Campo requerido )`}
                              labelPlacement="outside"
                              fullWidth
                              value={longitudeGatewayPost}
                              onValueChange={setLongitudeGatewayPost}
                              className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                            />
                          </div>
                          <label className={`mb-0.5 text-lg font-semibold mx-auto`}>Creador asociado al gateway</label>
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
                                {console.log("Creadores",statusCreators)}
                                {statusCreators.map((column) => (
                                <DropdownItem 
                                  key={column.name} 
                                  className="capitalize justify-between"
                                  >
                                  {capitalize(column.name)}
                                </DropdownItem>
                                ))}
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    Object.entries(selectedMeter)
                    .filter(([key]) => key !== 'create_time_id' && key !== 'create_ts_id')
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-bold uppercase">{key}:</span>
                          {key === "online_status" ? 
                            <Button
                              color={value===1 ? 'success' : value === 0 ? 'danger' : 'warning'}
                              variant='faded'
                              radius='sm'
                              size='sm'
                              onClick={()=>{
                                //setActivateStatus(true)
                                setIsOpenCustomMessage(true);
                                console.log("se oprime")
                              }}
                              >
                                {value === 1 ? 'Online' : value === 0 ? 'Offline' : 'No Info'}
                            </Button> : <span>{value !== null ? value : 'NO DATA'}</span>}
                        </div>
                      ))
                    ) })}
              </ModalBody>
              <ModalFooter
                className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx"
              >
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={
                    ()=>{
                      onClose()
                      setActionKey(null)
                    }
                    }>
                  Cerrar
                </Button>
                {/*Con este botón se insertan los datos del Modal a la tabla de incidencias*/}
                <Button 
                  className={`bg-custom-blue text-white ${actionKey==='details' ? 'hidden' : ''}`}
                  onPress={handleCreateGateway}
                  >
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
    )
}

export default PopUpGestion