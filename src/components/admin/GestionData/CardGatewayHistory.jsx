import { 
    Card,
    CardHeader,
    Image,
    CardBody,
    Divider,
    CardFooter,
} from "@nextui-org/react";

import React from "react";


const CardGatewayHistory = ({scatterPlot}) => {
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
            <p className="text-md">Lecturas actuales por gateway</p>
            <p className="text-small text-default-500">Equipo de medición smart</p>
          </div>
        </CardHeader>
        <Divider/>
        <CardBody 
          className='h-auto flex justify-center items-center h-full'
          >
          {scatterPlot}
        </CardBody>
        <Divider/>
        <CardFooter className='h-auto px-7'>
        </CardFooter>
      </Card>
    )
}

export default CardGatewayHistory