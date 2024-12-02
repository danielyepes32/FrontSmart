import { 
    Card,
    CardHeader,
    Image,
    CardBody,
    Chip,
    Divider,
    CardFooter,
    Button 
} from "@nextui-org/react";

import React from "react";

const CardGateway = ({onOpen, metersLength}) => {
    return (
        <Card className="w-full h-full margin-auto">
        <CardHeader className="flex gap-3 h-auto py-2.5">
          <Image
            alt="medileser logo"
            height={40}
            radius="xs"
            width={40}
            src='../../../public/vite.svg'
          />
          <div className="flex flex-col">
            <p className="text-md">Gateways operativos</p>
            <p className="text-small text-default-500">Equipo de medición smart</p>
          </div>
        </CardHeader>
        <Divider/>
        <CardBody 
          className='h-auto flex justify-center'
          >
          <div className='px-4'>
            <span className='text-[56px] text-black font-poppins font-regular'>
              {React.useMemo(() => {
                return metersLength;
                }, [metersLength])//Se ejecuta cada que hay un cambio en la constante vsisibleColumns
                }
            </span>
            <span  
              className='px-1'
              >
              gateways
            </span>
          </div>
          <div className='w-full px-4'>
            <Chip 
              color="success"
              className='w-full'
              >
              Operativos
            </Chip>
          </div>
          <p className='text-left px-4 py-2'>Gateways operativos registrados en el sistema</p>
        </CardBody>
        <Divider/>
        <CardFooter className='h-auto px-7'>
          <Button
            className='bg-custom-blue w-full text-white text-[18px] justify-center max-h-full'
            onClick={onOpen}>
              Agregar nuevo gateway
          </Button>
        </CardFooter>
      </Card>
    )
}

export default CardGateway