import { Button } from "@nextui-org/button";

const MeterDetails = ({ meter, onOpen, setActivateStatus }) => (
    Object.entries(meter)
      .filter(([key]) => key !== 'create_time_id' && key !== 'create_ts_id')
      .map(([key, value]) => (
        <div key={key} className="flex justify-between place-items-center">
          <span className="font-bold uppercase">
          {
            (() => {
              switch (key) {
                case 'meter_id':
                  return 'ID';
                case 'meter_code':
                  return 'Código del medidor';
                case 'meter_type':
                  return 'Identificación de tipo';
                case 'creaor':
                  return 'Usuario';
                case 'status':
                  return 'Estado del medidor';
                case 'tapa_id':
                  return 'Identificación de Tapa';
                case 'tapa_desc':
                  return 'Descripción de Tapa';
                case 'create_date':
                  return 'Fecha de creación';
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
              : 'NO DATA'}
          </span>
          )}
        </div>
      ))
  );

  export default MeterDetails
  