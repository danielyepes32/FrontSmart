import React from 'react';
import { CheckboxGroup, Divider, Checkbox, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from '@nextui-org/react';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import { ChevronDownIcon } from './ChevronDownIcon';
import { capitalize } from "../../../utils/utils";
import { FaCheck } from "react-icons/fa6";
import apiService from '../../../services/apiService';

const messageForm = ({ 
    isOpen, 
    onOpenChange, 
    }) => {

  return (
    <Modal
      backdrop="tranparent"
      shadow="lg"
      hideCloseButton={true}
      radius="xl"
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      className="items-center justify-center rounded=lg"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col w-1/2 gap-1 bg-custom-blue text-white border shadow shadow-lx text-center font-bold uppercase">Entra</ModalHeader>
            <ModalBody className="flex flex-col w-1/2 gap-1 bg-white border shadow shadow-lx">
              Entra
            </ModalBody>
            <ModalFooter className="flex flex-col w-1/2 gap-1 bg-white border shadow shadow-lx py-2">
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button 
                className = {`bg-custom-blue text-white`} 
                onPress={onclose}
                >
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default messageForm;