import { 
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@nextui-org/react";

const MainModal = (
    {   
        onOpenChangeUpdate,
        isOpenUpdate,
        renderContent,
        actionKey,
        setLatitude,
        setLongitude,
        handleUpdate,
        handleCreateIncidencia,
        selectedModify,
        meter
    }
    ) => {

    return(
        <Modal
        backdrop="tranparent"
        shadow="lg"
        hideCloseButton={true}
        radius="xl"
        onOpenChange={onOpenChangeUpdate}
        isOpen={isOpenUpdate}
        className="items-center justify-center rounded=lg"
        scrollBehavior="outside"
        aria-hidden={false}
        aria-modal={true}
        size='xl'
      >
        <ModalContent
        
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col w-full gap-1 bg-custom-blue text-white border shadow shadow-lx text-center font-bold uppercase">{`Meter code Seleccionado: ${meter.meter_code}`}</ModalHeader>
              <ModalBody className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx">
                {renderContent(actionKey)}
              </ModalBody>
              <ModalFooter className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx py-2">
                <Button 
                  color="danger" 
                  variant="light"
                  onPress={
                    ()=>{
                      onClose()
                      setLatitude('')
                      setLongitude('')
                  }}>
                  Cancelar
                </Button>
                <Button 
                  className = {`bg-custom-blue font-bold text-[15px] text-white ${actionKey === "details" || actionKey === 'ShowImage' ? 'hidden' : ''}`} 
                  onPress={actionKey === 'edit' ? handleUpdate : actionKey === 'ScaleAlarm' ? handleCreateIncidencia : onClose}
                  isDisabled={actionKey === "edit" ? selectedModify.length === 0 ? true : false : false}
                  
                  >
                  Escalar Alarma
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )};

  export default MainModal
  