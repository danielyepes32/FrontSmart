import React from 'react';
import { BrowserRouter as Router, Route, Routes , useLocation, useNavigate} from 'react-router-dom';
import GatewayDashboard from './dashboard/GatewaysDashboard';
import {Pagination, PaginationItem} from "@nextui-org/react";
import ModeloFallas from './dashboard/ModeloFallas';

const DashboardMain = ({sidebar}) => {

    const navigate = useNavigate()

    const handlePageChange = (page) => {
        navigate(`/admin/gateways/${page}`);
    }

  return (
    <div className="h-screen w-full col-span-6">
      {/* Contenido principal */}
        <div className='flex h-[92%] bg-gray-200 w-full'>
            <Routes>
                <Route path="/" element={<GatewayDashboard sidebar={sidebar} />} />
                <Route path="/1" element={<GatewayDashboard sidebar={sidebar} />} />
                <Route path="/2" element={<ModeloFallas sidebar={sidebar} />} />
                <Route path="/3" element={<GatewayDashboard sidebar={sidebar} />} />
            </Routes>
        </div>
        <div className='h-[8%] bg-gray-200 w-full items-center flex justify-center text-center place-items-center'>

            <Pagination 
                className='w-full text-center items-center flex place-items-center justify-center h-full space-x-8'
                //isCompact 
                classNames={{
                    wrapper:"mx-1",
                    item: "w-full px-2",
                    cursor: "bg-custom-blue w-auto shadow-lg text-white font-bold transition-all duration-300 ease-in-out",
                    chevronNext: "transform rotate-180",
                  }}
                showControls 
                initialPage={1} 
                total={1} 
                variant='flat'
                onChange={handlePageChange}
            />
        </div>
    </div>
  )
};

export default DashboardMain;
