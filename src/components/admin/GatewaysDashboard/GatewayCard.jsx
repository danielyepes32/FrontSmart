import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Chip } from '@nextui-org/react'; // Asumimos que usas Material-UI
import { Image } from '@nextui-org/react';

const GatewayCard = ({ metersLength, animate, handleOnclickCleanFilter }) => {
    return (
        <div className="h-full w-full mb-2 col-span-4 bg-white shadow-lg rounded-[20px]">
            <Card className="w-full h-full margin-auto">
                <CardHeader className="flex gap-3 h-1/9 py-2.5">
                    <Image
                        alt="medileser logo"
                        height={40}
                        radius="xs"
                        width={40}
                        src="../../../public/vite.svg" // Asegúrate de que la ruta de la imagen sea correcta
                    />
                    <div className="flex flex-col">
                        <p className="text-md">Gateways operativos</p>
                        <p className="text-small text-default-500">Equipo de medición smart</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className='h-4/6 flex justify-center'>
                    <div className='px-4 flex flex-col'>
                        <span
                            className={`text-[56px] text-black font-poppins font-regular ${animate ? 'fade-change' : 'fade-change-enter'}`}
                        >
                            {metersLength}
                        </span>
                        <span className='ml-1 text-[13px]'>
                            Lecturas
                        </span>
                    </div>
                    <div className='w-full px-4'>
                        <Chip color="success" className='w-full'>
                            Operativos
                        </Chip>
                    </div>
                    <p className='text-left px-4 py-2'>Lecturas registradas por el gateway</p>
                </CardBody>
                <Divider />
                <CardFooter className='h-1/5 px-5'>
                    <Button
                        className='bg-custom-blue w-full text-white text-[18px] justify-center max-h-full'
                        onClick={handleOnclickCleanFilter}
                    >
                        Limpiar filtros
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default GatewayCard;
