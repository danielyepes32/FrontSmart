// TableTopContent.jsx
import React from 'react';
import apiService from '../../../../services/apiService';
//import {useState, /*useEffect*/} from 'react'
import {useDisclosure} from "@nextui-org/react";
import DropdownPanel from '../TopContentComponents/FilterSection/DropdownPanel';
//import {parseAbsoluteToLocal} from "@internationalized/date";
import { DateTime } from 'luxon';
import RegisterUserModal from '../TopContentComponents/Modal/RegisterUserModal';
import PaginationInfo from '../TopContentComponents/FilterSection/PaginationInfo';

const data = [
  { name: 'MEDIDOR MECANICO', uid: 'MEDIDOR MECANICO', filter: 'manipulacion', id: 12},
  { name: 'NIPLE CAJA VACIA', uid: 'NIPLE CAJA VACIA', filter: 'manipulacion', id: 13 },
  { name: 'NO SE UBICA', uid: 'NO SE UBICA', filter: 'inaccesible', id: 11 },
  { name: 'DIFICIL ACCESO', uid: 'DIFICIL ACCESO', filter: 'inaccesible', id: 10 },
  { name: 'INUNDADO', uid: 'INUNDADO', filter: 'externo', id: 9 },
  { name: 'VANDALIZADO', uid: 'VANDALIZADO', filter: 'externo', id: 8 },
  { name: 'DISPLAY APAGADO', uid: 'DISPLAY APAGADO', filter: 'interno', id: 6 },
  { name: 'TEMPERATURA', uid: 'TEMPERATURA', filter: 'interno', id: 4 },
  { name: 'FLUJO INVERSO', uid: 'FLUJO INVERSO', filter: 'interno', id: 3 },
  { name: 'AIRE EN TUBERIA', uid: 'AIRE EN TUBERIA', filter: 'interno', id: 1 },
  { name: 'DIGITOS INCOMPLETOS', uid: 'DIGITOS INCOMPLETOS', filter: 'interno', id: 7 },
  { name: 'FUGA DE AGUA', uid: 'FUGA DE AGUA', filter: 'interno', id: 5 },
  { name: 'FALLO DE FLUJO', uid: 'FALLO DE FLUJO', filter: 'interno', id: 2 },
  { name: 'PROBLEMA DE MEMORIA', uid: 'PROBLEMA DE MEMORIA', filter: 'interno', id: 15 },
  { name: 'ESTADO DE COMUNICACION', uid: 'ESTADO DE COMUNICACION', filter: 'interno', id: 16 },
  { name: 'BATERIA BAJA', uid: 'BATERIA BAJA', filter: 'interno', id: 17 },
  { name: 'FALLO SENSOR DE TRANSMISION', uid: 'FALLO SENSOR DE TRANSMISION', filter: 'interno', id: 14 },
  { name: 'FALLO SENSOR DE TEMPERATURA', uid: 'FALLO SENSOR DE TEMPERATURA', filter: 'interno', id: 18 },
  { name: 'APERTURA DE TAPA', uid: 'APERTURA DE TAPA', filter: 'interno', id: 19 }
];

export default function TableTopContent({
    usersLength,
    onRowsPerPageChange,
}) {
  //Variables del componente-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------
  //Aqui se establece el valor para saber si se activa o no la ventana emergente

  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  //Esta variable guarda la validacion para evitar que se realizen consultas sin seleccionar un campo a modificar en el medidor
  const [isInvalid, setIsInvalid] = React.useState(true);
  //Esta variable guarda un arreglo con los valores seleccionados a modificar en el medidor (latitude, longitude y tapa_desc)
  const [selectedModify, setSelectedModify] = React.useState([])
  //Variable para establecer el encargado en el formulario de incidencia
  const [encargado, setEncargado] = React.useState(null)
  //Esta variable guarda los posibles identificadores del medidor que se quiere establecer en el autocomplete del modal
  const [suggestions, setSuggestions] = React.useState([])
  //Esta variable se refiere a los diferentes tipos de fallas que se pueden seleccionar puesto que esta input es un selector
  const [selectedKeys, setSelectedKeys] = React.useState(null);
  //Este dato almacena el valor que se está escribiendo en las input del autocomplete
  const [searchValue, setSearchValue] = React.useState('');
  //Este dato almacena la página en la que nos encontramos ahora
  //Se almacena el archivo de la imagen seleccionada en el modal de incidencia en forma de ruta temporal para ser previsualizado
  const [image, setImage] = React.useState(null);
  //Aquí se guarda la imagen en un archivo base64
  const [imageFile, setImageFile] = React.useState(null); // Estado para el archivo de la imagen
    
  //-------------------------------------------------------------------------------------------------------------
  //Funciones del componente----------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------

  //Se ejecuta un effect cada que se modifica la selección del radioGroup en el modal modificando los campos se fallas para el dropdown
  React.useEffect(() => {

    //En caso de que la selección del modify sea mayor a 0, es decir que deje de ser nula
    if (selectedModify.length > 0) {
      //filtrar los datos del campo data solamente con los valores que correspondan con el filtro
      const filteredItems = data.filter(item => item.filter === selectedModify);
  
      if (filteredItems.length > 0) {
        setSelectedKeys(filteredItems[0].name); // Asigna el primer valor encontrado
      }
    }
  }, [selectedModify]);

  //Función asincrónica para hacer llamado a la API y crear una incidencia
  const handleCreateUser = async () => {

    if (!nombre) {
      alert("Error: El nombre de usuario es necesario.");
      return;
    }

    if (!user) {
      alert("Error: El usuario de acceso no está definido.");
      return;
    }

    if (!password) {
      alert("Error: La contraseña es necesaria");
      return;
    }

    if (!email) {
      alert("Error: El correo debe estar definido.");
      return;
    }

    //Parametros necesarios para la creación de la incidencia
    const UsuarioData = {
      username: user,
      email: email,
      password: password,
      descriptions: [
          {
              description_desc: 'descripción',
              user_name: nombre
          }
      ]
    };

    try {
      const newUser = await apiService.createUser(UsuarioData);
      alert("Nuevo usuario insertado con acceso a la plataforma", newUser)
      window.location.reload();
      // Aquí puedes manejar el éxito de la creación, como mostrar una notificación o actualizar el estado
    } catch (error) {
      if(error.response.status === 400){
        alert("Inserción cancelada, ese usuario ya existe")
      }else if (error.response.status === 404) {
        if (error.response.data.email){
          alert("Ingrese un correo válido")
        }else{
          alert("Inserción cancelada, ingrese todos los valores")
        }
      }else{
        alert("Error al crear la incidencia")
      }
    }
  };
  //Fin de la función de creación de incidencias
  //-----------------------------------------------------------------------------------------------------------------------
  // Componentes reenderizados de manera externa

  //Componente modal para el cargue de incidencias
  const Modal = React.useMemo(()=>{
    return (
      <RegisterUserModal
        nombre={nombre}
        user={user}
        email={email}
        password={password}
        setNombre={setNombre}
        setUser={setUser}
        setEmail={setEmail}
        setPassword={setPassword}
        isOpen={isOpen} //Está el modal abierto
        onOpenChange={onOpenChange} //Se ha ejecutado un cambio en la visibilidad del modal
        handleCreateUser={handleCreateUser} //Función para crear la incidencia
        selectedModify={selectedModify} //Selección del tipo de falla en el radioGroup
        setSelectedModify={setSelectedModify} //Cambiar la selección
        setSelectedKeys={setSelectedKeys} //Cambiar el valor de falla seleccionada
        isInvalid={isInvalid} //Invalidar en caso de no seleccionbar algun valor en el radioGroup
        setIsInvalid={setIsInvalid} //Cambiar el estado de validación
      />
    )
  },[isOpen, selectedModify, selectedKeys, suggestions, image, encargado, nombre, user, email, password])  

  return (
    //Contenedor del area de los filtros y la sección con los datos de paginado
    <div className="flex flex-col w-full h-auto">
      {/*Contenedor de los datos de filtrado*/}
      <div className="flex justify-between items-end">
        {Modal} {/*El Modal solo se reenderiza en las condiciones del useMemo()*/}
        <div className="flex h-full overflow-y-hidden flex-col md:flex-row md:justify-start sm:justify-start sm:flex-row items-end w-full justify-end sm:space-x-2 sm:space-y-0">
          {/*Aquí se configura el autocomplete*/}
          <div className='w-full h-full flex justify-start place-items-center'>
            <span className='text-left font-bold justify-center place-content-center'>
              Plataforma de monitoreo y gestión de usuarios 
            </span>
          </div>
          <DropdownPanel
            onOpen={onOpen}
          />
        </div>
      </div>
      <PaginationInfo
        usersLength={usersLength}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
}
