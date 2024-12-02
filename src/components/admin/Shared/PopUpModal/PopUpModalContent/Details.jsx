import { Button } from "@nextui-org/button";

const MeterDetails = ({ meter, onOpen, setActivateStatus }) => (
    Object.entries(meter)
      .filter(([key]) => key !== 'create_time_id' && key !== 'create_ts_id')
      .map(([key, value]) => (
        <div key={key} className="flex justify-between place-items-center">
          <span className="font-bold uppercase">{key}:</span>
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
            <span>{value !== null ? value : 'NO DATA'}</span>
          )}
        </div>
      ))
  );

  export default MeterDetails
  