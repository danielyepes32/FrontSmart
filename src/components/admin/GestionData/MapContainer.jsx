import React from 'react';
import { FaMap } from "react-icons/fa";
import MapComponent from './Mapa';
import {
        Spinner,
    } from "@nextui-org/react";


const MapContainer = ({
    loadingApi,
    arrayGateways,
    arrayMeters
}) => {
    return (
        <div className='w-full h-full flex flex-col col-span-2'>
          <div className='w-full h-1/9 bg-white border-b border-gray-300 rounded-tl-[20px] rounded-tr-[20px]'>
            <div className="flex items-center gap-2 p-3 px-6 text-[26px] text-black-menu">
              <div className={`${loadingApi ? 'hidden' : 'block'}`}>
                <FaMap />
              </div>
              <span className="font-poppins font-regular">
                Gateways
              </span>
              <span className={`ml-auto text-default-500 text-[16px] ${loadingApi ? 'block' : 'hidden'}`}>
                Obteniendo medidores
              </span>
              <Spinner    
                size='md'
                className={` ${loadingApi ? 'block' : 'hidden'}`}
                classNames={{
                  base: '',
                  wrapper: 'ml-auto'
                  }}
              />
            </div>
          </div>
          <div className='p-4 w-full bg-white h-full rounded-bl-[20px] rounded-br-[20px]'>
            <MapComponent 
              gatewaysData={arrayGateways}
              metersData={arrayMeters}
              loading = {loadingApi}
            ></MapComponent>
          </div>
        </div>  
    )
}

export default MapContainer