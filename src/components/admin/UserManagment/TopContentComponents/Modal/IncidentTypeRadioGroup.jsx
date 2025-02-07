// TableTopContent.jsx
import React from 'react';
import {RadioGroup, Radio, cn} from '@nextui-org/react'

const IncidentTypeRadioGroup = ({ selectedModify, setSelectedModify, isInvalid, setIsInvalid, setSelectedKeys }) => (
    <RadioGroup
    className='h-full'
    description="Selecciona algún tipo de usuario"
    isInvalid={isInvalid}
    label="Selecciona los permisos del usuario"
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
              value="Operario"
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
          <span className='mx-4 my-auto'>Operario</span>
      </div>
  </RadioGroup>
);

export default IncidentTypeRadioGroup;
