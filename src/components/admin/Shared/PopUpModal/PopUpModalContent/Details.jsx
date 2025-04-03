import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/react";
import React from "react";
import apiService from "../../../../../services/apiService";
import { TbMeterCube } from "react-icons/tb";

const LABELS_MAP = {
  meter_id: "ID CLIENTE",
  meter_code: "ID MEDIDOR",
  creator: "Usuario",
  status: "CONDICIÓN",
  tapa_desc: "Descripción de Tapa",
  create_date: "Fecha de REGISTRO",
  status_update_date: "Última actualización de estado",
  falla_desc: "Descripción de falla",
  falla_id: "Identificación de falla",
  falla: "Identificación de falla",
  tipo: "Tipo de alarma",
  falla_type: "Tipo de registro",
  latitude: "Coordenadas (latitud)",
  longitude: "Coordenadas (longitud)",
  typeReading: "Tipo de lectura",
  lastReading: "última lectura"
};

const MeterDetails = ({ meter, onOpen, setActivateStatus, setShowType }) => {

  const [typeReading, setTypeReading] = React.useState('');
  const [lastReading, setLastReading] = React.useState('');

  console.log('lastReading: ', lastReading);
  console.log('typeReading: ', typeReading);

  React.useMemo(async() => {
    setTypeReading('Cargando...');
    const controller = new AbortController(); // Crear un AbortController
    const signal = controller.signal; // Obtener la señal
    //Aquí se establece que el fetch o consulta es asincrónico para optimizar el batch
    const fetchData = async () => {
      //Al estar ejecutando el fetch activamos el loading de la data
      try {
        //Una vez con los parametros ejecutamos la consulta y obtenemos el resultado
        const response = await apiService.getTypeReading(meter.meter_code, signal);
        //el resultado contiene más de un campo por lo que extraemos solo la parte de "results" para setear los medidores
        setTypeReading(response?.status);
      } catch (error) {
        //En caso de error en el llamado a la API se ejecuta un console.error
        console.error('Error fetching typeReading from meter:', error);
      }
      //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
      if (!signal.aborted) {
        //apartado de la consulta se detiene el loading
      }
    };
    fetchData();

    return () => {
      console.warn("Cancelando solicitud anterior...");
      controller.abort(); // Cancelar la solicitud anterior antes de hacer una nueva
    };
  }, [meter]);

  React.useMemo(async() => {
    setLastReading('Cargando...');
    const controller = new AbortController(); // Crear un AbortController
    const signal = controller.signal; // Obtener la señal
    //Aquí se establece que el fetch o consulta es asincrónico para optimizar el batch
    const fetchData = async () => {
      //Al estar ejecutando el fetch activamos el loading de la data
      try {
        //Una vez con los parametros ejecutamos la consulta y obtenemos el resultado
        const response = await apiService.getLastReading(meter.meter_code, signal);
        //el resultado contiene más de un campo por lo que extraemos solo la parte de "results" para setear los medidores
        setLastReading(response?.real_volume);
      } catch (error) {
        //En caso de error en el llamado a la API se ejecuta un console.error
        console.error('Error fetching typeReading from meter:', error);
      }
      //al finalizar independientemente de haber encontrado o no datos se detiene el circulo de cargue de datos
      if (!signal.aborted) {
        //apartado de la consulta se detiene el loading
      }
    };
    fetchData();

    return () => {
      console.warn("Cancelando solicitud anterior...");
      controller.abort(); // Cancelar la solicitud anterior antes de hacer una nueva
    };
  }, [meter]);

  return Object.entries({ ...meter, typeReading, lastReading })
    .filter(([key]) => !["create_time_id", "create_ts_id", "meter_type", "tapa_id"].includes(key))
    .map(([key, value]) => {
      const label = LABELS_MAP[key] || key;
      const isStatus = key === "status";

      return (
        <div key={key} className={`${key === 'cobertura' ? 'mt-5':''} flex justify-between place-items-center`}>
          <span className="font-bold uppercase">{label}:</span>
          {isStatus ? (
            <Button
              color={value === "NORMAL" ? "success" : value === "INCIDENCIA" ? "danger" : "warning"}
              variant="faded"
              radius="lg"
              onPress={
                value !== "NORMAL"
                  ? () => {
                      setActivateStatus(true);
                      onOpen();
                      setShowType(value === "INCIDENCIA");
                    }
                  : null
              }
            >
              {value}
            </Button>
          ) : key === 'cobertura' ? (
            <Chip 
              className={`py-3 text-white font-bold`}
              variant="shadow"
              color={value === 'Dentro de cobertura' ? 'primary':'danger'}
              size="md"
              >
              {value ?? "Sin información"}
            </Chip>
          ): key === 'typeReading' ? (
            <Chip 
              className={`py-3 text-white font-bold`}
              variant="shadow"
              color={value === 'DIARIO' ? 'success': value === 'INTERMITENTE' ? 'warning' : value === 'WALKBY' || value === 'SIN LECTURA' ? 'danger': 'default'}
              size="md"
              >
              {value ?? "Sin información"}
            </Chip>
          ): key === 'lastReading' ? (
            <div className="flex gap-2 place-items-center">
            <span className="font-bold" variant="shadow" size="md">
              {value !== 'Cargando...' ? (
                <>
                  {value}
                </>
              ) : (
                value ?? "Sin información"
              )}
            </span>
            <span className={`${value === 'Cargando...' || value === '' || value === undefined ? 'hidden':'block'}`}>metros cúbicos </span>
            <TbMeterCube className={`${value === 'Cargando...' || value === '' || value === undefined ? 'hidden':'block'} font-bold my-2`}/>
            </div>
          ) : (
            <span className={``}>
              {key === "status_update_date" && value
                ? new Date(value).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: "UTC",
                  })
                : value ?? "Sin información"}
            </span>
          )
        }
        </div>
      );
    });
};

export default MeterDetails;
