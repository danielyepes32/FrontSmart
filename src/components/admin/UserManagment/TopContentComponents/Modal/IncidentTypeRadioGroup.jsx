// TableTopContent.jsx
import React from 'react';
import {RadioGroup, Radio, cn} from '@nextui-org/react'

const IncidentTypeRadioGroup = ({ selectedModify, setSelectedModify, isInvalid, setIsInvalid, setSelectedKeys }) => (
    <RadioGroup
    className='h-full'
    description="Selecciona algún tipo de incidencia"
    isInvalid={isInvalid}
    label="Selecciona el tipo de incidencia a modificar"
    value={selectedModify}
    classNames={{
      wrapper:'flex-grow justify-center space-y-3'
    }}
    onValueChange={(value) => {
      setIsInvalid(value.length < 1);
          setSelectedModify(value);
          setSelectedKeys()
        }}
      >
      <div className='flex my-2'>
        <div className='my-auto flex flex-col justify-center place-items-center'>
          <Radio 
              value="externo"
              color="blue-100"
              className={`justify-start p-1 rounded-lg w-[30px] transition-colors duration-500 ${isInvalid ? 'bg-red-100' : 'bg-blue-200'}`}
              size='xl'
              radius='xl'
              classNames={{
                base: cn(
                  "hover:bg-gray-200",
                  "group hover:opacity-70 active:opacity-50",
                  "rounded-lg data-[selected=true]:bg-custom-blue",
                  "h-full"
                )
              }}
          />
        </div>
          <span className='mx-4 my-auto'>Externo</span>
      </div>
      <div className='flex justify-center'>
        <div className='h-full my-auto flex flex-col justify-center'>
          <Radio 
              value="manipulacion"
              className={`justify-start p-1 rounded-lg w-[30px] transition-colors duration-500 ${isInvalid ? 'bg-red-100' : 'bg-blue-200'}`}
              size='xl'
              radius='xl'
              classNames={{
                base: cn(
                  "hover:bg-gray-200",
                  "group hover:opacity-70 active:opacity-50",
                  "rounded-lg data-[selected=true]:bg-custom-blue"
                )
              }}
          />
          </div>
          <span className='mx-4'>
          <div className='w-1/3'>
            Manipulación de conexión
          </div>  
          </span>
      </div>
      <div className='flex my-2 place-items-center'>
          <Radio 
              value="inaccesible"
              color="blue-100"
              className={`justify-start flex flex-col p-1 rounded-lg w-[30px] transition-colors duration-500 ${isInvalid ? 'bg-red-100' : 'bg-blue-200'}`}
              size='xl'
              radius='xl'
              classNames={{
                base: cn(
                  "hover:bg-gray-200",
                  "group hover:opacity-70 active:opacity-50",
                  "rounded-lg data-[selected=true]:bg-custom-blue",
                  "place-items-center my-auto"
                )
              }}
          />
          <span className='mx-4 my-auto'>Inaccesible</span>
      </div>
      <div className='flex place-items-center pb-2'>
          <Radio
              value="interno"
              color="blue-100"
              className={`justify-start flex flex-col p-1 rounded-lg w-[30px] transition-colors duration-500 ${isInvalid ? 'bg-red-100' : 'bg-blue-200'}`}
              size='xl'
              radius='xl'
              classNames={{
                base: cn(
                  "hover:bg-gray-200",
                  "group hover:opacity-70 active:opacity-50",
                  "rounded-lg data-[selected=true]:bg-custom-blue",
                  "place-items-center my-auto"
                )
              }}
          />
          <span className='mx-4 my-auto'>Interno</span>
      </div>
  </RadioGroup>
);

export default IncidentTypeRadioGroup;
