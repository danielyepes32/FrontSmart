import { 
  CheckboxGroup,
  Checkbox,
  Divider,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem 
} from "@nextui-org/react";
import { ChevronDownIcon } from "../../Icons/ChevronDownIcon";
import { capitalize } from "../../../../../utils/utils";

const MeterEdit = ({
  meter,
  selectedModify,
  selectedKeys,
  setSelectedModify,
  isInvalid,
  setIsInvalid,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  showLatitude,
  showLongitude,
  showTapa,
  setSelectedKeys,
  tapas,
}) => (
  <div className="flex">
    <div className="w-1/3">
      <CheckboxGroup
        description="Selecciona algún campo para modificar"
        isInvalid={isInvalid}
        label="Selecciona los campos a modificar"
        value={selectedModify}
        onValueChange={(value) => {
            setIsInvalid(value.length < 1);
            setSelectedModify(value);
        }}
      >
        <div>
          <Checkbox 
            value="latitude"
            color="blue-100"
            className={`justify-start p-1 rounded-lg w-[30px] transition-colors duration-500 ${isInvalid ? 'bg-red-100' : ''}`}
            size='xl'
            radius='xl'
          />
          <span className='mx-2'>Latitude</span>
        </div>
        <div>
          <Checkbox 
            value="longitude"
            className={`justify-start p-1 rounded-lg w-[30px] transition-colors duration-500 ${isInvalid ? 'bg-red-100' : ''}`}
            size='xl'
            radius='xl'
          />
          <span className='mx-2'>Longitude</span>
        </div>
        <div>
          <Checkbox 
            value="tapa_desc"
            color="blue-100"
            className={`justify-start p-1 rounded-lg w-[30px] transition-colors duration-500 ${isInvalid ? 'bg-red-100' : ''}`}
            size='xl'
            radius='xl'
          />
          <span className='mx-2'>Tipo de tapa</span>
        </div>
      </CheckboxGroup>
    </div>
    {/* Divisor vertical acá */}
    <Divider 
      orientation='vertical'
      className="mx-4 h-[25vh] justify-center place-items-center my-auto"/>
    {/* Divisor vertical acá */}
    <div className='flex-col justify-center w-full h-full'>
      {/*Segunda Columna*/}
      <div className="mx-auto w-full">
        <label className={`mb-0.5 text-lg font-semibold mx-auto ${showLatitude === false ? '' : 'hidden'}`}>Latitude del medidor</label>
        <Input
          type="number"
          label=""
          placeholder={`Latitude del medidor ( Dato actual: ${meter.latitude} )`}
          labelPlacement="outside"
          fullWidth
          value={latitude}
          onValueChange={setLatitude}
          maxLength={18}
          className={`transition-max-height duration-500 ease-in-out overflow-hidden ${showLatitude === false ? 'max-h-screen' : 'max-h-0'}`}
        />
        <label className={`mb-0.5 text-lg font-semibold mx-auto ${showLongitude === false ? '' : 'hidden'}`}>Longitude del medidor</label>
        <Input
          type="number"
          label=""
          placeholder={`Longitude del medidor ( Dato actual: ${meter.longitude} )`}
          labelPlacement="outside"
          fullWidth
          maxLength={18}
          value={longitude}
          onValueChange={setLongitude}
          className={`transition-max-height duration-500 ease-in-out overflow-hidden ${showLongitude === false ? 'max-h-screen' : 'max-h-0'}`}
        />
        <label className={`mb-0.5 text-lg font-semibold mx-auto ${showTapa === false ? '' : 'hidden'}`}>Tapa del medidor</label>
        {/*DropBox para las Tapas*/}
        <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${showTapa === false ? 'max-h-screen' : 'max-h-0'}`}>
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
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              }}
            >
              {tapas.map((column) => (
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
);

export default MeterEdit