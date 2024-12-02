import { 
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@nextui-org/react";

const ModalTableInfo = ({
    isOpen,
    onOpenChange,
    activateStatus,
    messageFetch,
    meter,
    setActivateStatus,
    setMessageFetch,
    fetchUpdateMeterData,
    TablePopUpStatus,
  }) => {
    return (
      <Modal
        backdrop="tranparent"
        shadow="lg"
        hideCloseButton={true}
        radius="xl"
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        className="items-center justify-center rounded-lg"
        scrollBehavior="inside"
        aria-hidden={false}
        size="3xl"
        labelplacement="center"
        classNames={{
          base: "bg-red-100 h-auto justify-center",
        }}
      >
        <ModalContent>
          {(onCloseError) => (
            <>
              {/* Header */}
              <ModalHeader className="flex flex-col w-full gap-1 bg-custom-blue text-white border shadow shadow-lx text-center font-bold uppercase">
                {activateStatus ? "Datos de alarma" : "Confirmar Selección de Datos"}
              </ModalHeader>
  
              {/* Body */}
              <ModalBody className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx h-auto">
                {activateStatus ? (
                  <aside className="h-auto">{TablePopUpStatus}</aside>
                ) : (
                  messageFetch === ""
                    ? `Desea modificar el medidor ${meter.meter_code}`
                    : messageFetch
                )}
              </ModalBody>
  
              {/* Footer */}
              <ModalFooter className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx py-2">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    if (messageFetch === "") {
                      onCloseError();
                      setActivateStatus(false);
                    } else {
                      onCloseError();
                      setMessageFetch("");
                      setActivateStatus(false);
                    }
                  }}
                >
                  Close
                </Button>
                {!activateStatus && (
                  <Button
                    className={`bg-custom-blue text-white`}
                    onPress={() => {
                      if (messageFetch === "") {
                        fetchUpdateMeterData();
                      } else {
                        onCloseError();
                        setMessageFetch("");
                      }
                    }}
                  >
                    Confirmar
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

export default ModalTableInfo
  