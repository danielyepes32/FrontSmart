import { Button } from "@nextui-org/button";

const MeterDetails = ({ meter, onOpen, setActivateStatus, setShowType }) => (
    Object.entries(meter)
      .filter(([key]) => key !== 'create_time_id' && key !== 'create_ts_id' && key !== 'meter_type' && key !== 'tapa_id')
      .map(([key, value]) => (
        <div key={key} className="flex justify-between place-items-center">
          <span className="font-bold uppercase">
          {
            (() => {
              switch (key) {
                case 'meter_id':
                  return 'ID CLIENTE';
                case 'meter_code':
                  return 'ID MEDIDOR';
                case 'meter_type':
                  return 'Identificación de tipo';
                case 'creator':
                  return 'Usuario';
                case 'status':
                  return 'CONDICION';
                case 'tapa_id':
                  return 'Identificación de Tapa';
                case 'tapa_desc':
                  return 'Descripción de Tapa';
                case 'create_date':
                  return 'Fecha de REGISTRO';
                case 'status_update_date':
                  return 'última actualización de estado';
                case 'falla_desc':
                  return 'Descripción de falla';
                case 'falla_id':
                  return 'Identificación de falla'; 
                case 'falla':
                  return 'Identificación de falla';
                case 'tipo':
                  return 'Tipo de alarma';
                case 'falla_type':
                  return 'Tipo de registro';
                case 'latitude':
                  return 'coordenadas (latitude)';
                case 'longitude':
                  return 'coordenadas (longitude)';
                default:
                  return key; // Opcional: para manejar otros casos
              }
            })()
          }:
          </span>
          {key === "status" ? (
            <Button
              color={value === 'NORMAL' ? 'success' : value === 'INCIDENCIA' ? 'danger' : 'warning'}
              variant="faded"
              radius="sm"
              onPress={value !== 'NORMAL' ? () => {
                setActivateStatus(true);
                onOpen();
                value == 'INCIDENCIA' ? setShowType(true) : setShowType(false);
              } : null}
            >
              {value}
            </Button>
          ) : (
          <span>
            {key === 'status_update_date' && value !== null
              ? new Date(value).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  timeZone: 'UTC',
                })
              : value !== null
              ? value
              : 'Sin información'}
          </span>
          )}
        </div>
      ))
  );

  export default MeterDetails
  