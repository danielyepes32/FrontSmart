import React, { useState, useEffect } from "react";
import apiService from "../../../../../services/apiService";
import ImageUpload from "../../../IngestaError/TopContentComponents/Modal/ImageUpload";
import { Divider } from "@nextui-org/react";

const GenerateReport = ({ meter, handleImageChange, image, setImageSrcFile}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thereImgSrc, setThereImgSrc] = useState(false);

  const handleImageChangeMeter = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrcFile(reader.result); // Establecer la imagen en base64
        setImageSrc(URL.createObjectURL(file)); // Establecer la previsualización
      };
      reader.readAsDataURL(file); // Lee el archivo como base64
    } else {
      alert('Por favor, selecciona un archivo de imagen válido');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parámetros para la consulta a la API
        const params = {
          incidencia_id: meter.id,
        };

        // Llamada a la API
        const response = await apiService.getIncidencia(params);

        // Verificar que los resultados existan y decodificar la imagen
        if (response && response.results && response.results.length > 0) {
          const incidencia = response.results[0];
          if (incidencia.img) {
            const base64Image = `data:image/png;base64,${incidencia.img}`;
            setImageSrc(base64Image);
            setThereImgSrc(true);

          }
        } else {
          console.error("No se encontraron resultados para la incidencia");
        }
      } catch (error) {
        console.error("Error fetching incidencia data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [meter.id]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h3>{meter.meter_code}</h3>
      {loading ? (
        <p>Cargando y validando datos...</p>
      ) : (
        <div className="flex flex-col place-items-center justify-center h-full w-full">
        <span className="font-bold text-[20px] text-center mb-3">
          Por favor cargue las imagenes correspondientes para generar el reporte
        </span>
        <Divider />
        <div className="flex space-x-10">
            <div className="flex flex-col w-full justify-center mt-2">
            <label className="mb-0.5 text-lg font-semibold">
                Condición del suminisitro en visita a campo
            </label>
            <ImageUpload handleImageChange={handleImageChange} image={image} />
            </div>
            <div className="flex w-full flex-col justify-center mt-2">
            <label className="mb-0.5 text-lg font-semibold">
                Estado actual del medidor
            </label>
            <div className="py-2">
                <label className={`${thereImgSrc ? 'hidden':'block'} text-sm font-medium text-gray-700`}>Sube la imagen de la incidencia</label>
                {!thereImgSrc ?               
                (<input
                type="file"
                accept="image/*"
                onChange={handleImageChangeMeter}
                className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />): null}
                {imageSrc && (
                <div className="mt-4 flex flex-col justify-center">
                    <p className="text-sm text-gray-600">{thereImgSrc ? 'Imagen guardada en servidor' : 'Imagen seleccionada:'}</p>
                    <img src={imageSrc} alt="Preview" className="mt-2 mx-auto w-60 h-60 object-cover rounded-lg" />
                </div>
                )}
            </div>            
            </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default GenerateReport;
