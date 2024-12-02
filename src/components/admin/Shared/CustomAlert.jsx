import React, { useState } from 'react';
import { Button } from '@nextui-org/button';

const CustomAlert = ({ message, isVisible, setIsVisible }) => {
  const closeAlert = () => {
    setIsVisible(false);
  };

  return isVisible ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 h-full">
          <div className="bg-white text-white p-6 shadow-lg rounded-[20px] h-1/4 flex flex-col border border-gray-300">
            <div className='flex-grow flex items-center justify-center'>
                <p className="text-lg text-black font default-100 py-5">{message}</p>
            </div>
            <div className='flex justify-end'>
                <Button
                onClick={closeAlert}
                color="danger" 
                variant="light"
                className='ml-auto w-full'
                >
                Cerrar
                </Button>
            </div>
          </div>
        </div>
      ) : null
};

export default CustomAlert;
