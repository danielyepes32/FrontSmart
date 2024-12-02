import { 
    Divider,
    Input
} from "@nextui-org/react";

import ImageUpload from "../../../IngestaError/TopContentComponents/Modal/ImageUpload";

const ScaleAlarm = ({ encargado, setEncargado, handleImageChange, image }) => (
    <div className="flex flex-col place-items-center justify-center h-full w-full">
      <span className="font-bold text-[20px] text-center mb-3">
        Por favor cargue una imagen y un encargado para escalar a incidencia
      </span>
      <Divider />
      <div className="flex flex-col justify-center mt-2">
        <label className="mb-0.5 text-lg font-semibold">
          Nombre de quien registra la falla
        </label>
        <Input
          type="text"
          placeholder="Nombre del encargado (default: Plataforma)"
          fullWidth
          value={encargado ? encargado : ''}
          onValueChange={setEncargado}
          maxLength={20}
        />
        <ImageUpload handleImageChange={handleImageChange} image={image} />
      </div>
    </div>
  );
  
export default ScaleAlarm