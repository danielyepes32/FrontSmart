import React, { useState, useEffect } from "react";
import apiService from "../../../../../services/apiService";

const ShowImage = ({ meter }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <p>Cargando imagen...</p>
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Imagen de la incidencia"
          className="rounded-lg shadow-lg mt-4"
          style={{ maxWidth: "100%", maxHeight: "400px" }}
        />
      ) : (
        <p>Esta incidencia no tiene imagen asociada</p>
      )}
    </div>
  );
};

export default ShowImage;
