import { 
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
} from "@nextui-org/react";
import React from "react";
import { PDFDocument, rgb } from "pdf-lib";
import apiService from "../../../../../services/apiService";

const incidenciaMapping = {
  "FALLO SENSOR DE TRANSMISION": {
    detalle:
      "El operario de campo intentó tomar lectura por radio portátil (Walk by), sin embargo no se obtuvo respuesta. Se verificó que el medidor presenta falla en el sensor de transmisión.",
    conclusiones:
      "Medidor presenta fallo en el sensor de transmisión, no se puede obtener lectura por radiofrecuencia.",
    recomendaciones:
      "Se recomienda cambiar el medidor por otro operativo para obtener la lectura por radiofrecuencia (Vía Antena o Walk by) para asi no afectar el parque de medidores ultrasónicos. Asimismo, se solicita que se envíe correo para retirar el medidor de la plataforma EMRC para mantener una base de datos real y actualizada.",
  },
  "DISPLAY APAGADO": {
    detalle:
      "El operario de campo intentó tomar lectura por radio portátil (Walk by), sin embargo no se obtuvo respuesta. Se verificó que el medidor presenta display apagado.",
    conclusiones:
      "Medidor presenta el display apagado, no se puede obtener lectura por radiofrecuencia.",
    recomendaciones:
      "Se recomienda cambiar el medidor por otro operativo para obtener la lectura por radiofrecuencia (Vía Antena o Walk by) para asi no afectar el parque de medidores ultrasónicos. Asimismo, se solicita que se envíe correo para retirar el medidor de la plataforma EMRC para mantener una base de datos real y actualizada.",
  },
  "NIPLE CAJA VACIA": {
    detalle:
      "El operario de campo intentó tomar lectura por radio portátil (Walk by), sin embargo no se obtuvo respuesta. Se aperturó la tapa y se verificó que la caja de suministro se encuentra vacía.",
    conclusiones:
      "Caja de suministro vacía, no se puede obtener lectura por radiofrecuencia.",
    recomendaciones:
      "Se recomienda instalar nuevo medidor ultrasónico y asegurar la tapa para evitar el acceso a terceras personas.",
  },
  "VANDALIZADO": {
    detalle:
      "El medidor fue vandalizado.",
    conclusiones:
      "Medidor ultrasónico vandalizado con display apagado, a causa de impacto por una tercera persona.",
    recomendaciones:
      "Se recomienda cambiar el medidor por otro medidor con radio para obtener la lectura por radiofrecuencia (Vía Antena o Walk by) para asi no afectar el parque de medidores ultrasónicos. Asimismo, se solicita que se envíe correo para retirar el medidor de la plataforma EMRC para mantener una base de datos real y actualizada.",
  },
  "DIFICIL ACCESO": {
    detalle:
      "Se intentó tomar lectura por radio portátil (Walk by), sin embargo no se obtuvo respuesta. No se puede verificar el medidor, se requiere realizar una visita para la inspección, asi poder levantar la información respectiva del medidor y actualizar la Base de datos recopilada.",
    conclusiones:
      "Suministro con tapa sellada, o los suministros se encuentran ubicados en zonas de difícil acceso, no se puede verificar el medidor ni obtener lectura por radiofrecuencia.",
    recomendaciones:
      "Se recomienda realizar una visita de inspección, para asi revisar el estado del medidor ultrasónico.",
  },
  "DIGITOS INCOMPLETOS": {
    detalle:
      "El operario de campo intentó tomar lectura por radio portátil (Walk by), sin embargo no se obtuvo respuesta. Se verificó que el medidor presenta falla dígitos incompletos en el display.",
    conclusiones:
      "Medidor presenta fallo digitos incompletos en el display, no se puede obtener lectura por radiofrecuencia.",
    recomendaciones:
      "Se recomienda cambiar el medidor por otro operativo para obtener la lectura por radiofrecuencia (Vía Antena o Walk by) para asi no afectar el parque de medidores ultrasónicos. Asimismo, se solicita que se envíe correo para retirar el medidor de la plataforma EMRC para mantener una base de datos real y actualizada.",
  },
  "MEDIDOR MECANICO": {
    detalle:
      "El operario de campo intentó tomar lectura por radio portátil (Walk by), sin embargo no se obtuvo respuesta. Se revisó el suministro y se encontró medidor mecánico.",
    conclusiones:
      "No se encontró medidor ultrasónico en la caja de suministro.",
    recomendaciones:
      "Se recomienda la instalación de medidor ultrasónico en el suministro.",
  },
  "NO SE UBICA": {
    detalle:
      "Se intentó tomar lectura por radio portátil (Walk by), sin embargo no se obtuvo respuesta. No se puede verificar el medidor, se requiere realizar una visita para la inspección, para así poder levantar la información respectiva del medidor y actualizar la Base de datos recopilada.",
    conclusiones:
      "No se encontró medidor ultrasónico.",
    recomendaciones:
      "Se recomienda realizar una visita de inspección para verificar el medidor.",
  },
  // Agrega más casos según la tabla.
};

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
        meter,
        imageFile,
        imageSrcFile
    }
    ) => {

      console.log("meter: ", meter)

      const {isOpen, onOpen, onOpenChange} = useDisclosure();
      const [pdfData, setPdfData] = React.useState(null);
      const [pdfUrl, setPdfUrl] = React.useState(null);
      const [editedPdfUrl, setEditedPdfUrl] = React.useState(null);
      const [dynamicText, setDynamicText] = React.useState("Texto dinámico");
      const [meterData, setMeterData] =  React.useState(null)

      function calculateXObject(start, end, text) {
        const textWidth = text.length * 3.423; // Ancho del texto
        const center = (start + end) / 2; // Centro del objeto
        return center - textWidth / 2; // Posición inicial para centrar el texto
      }

      const assignIncidenciaData = (fallaDesc) => {
        if (incidenciaMapping[fallaDesc]) {
          return incidenciaMapping[fallaDesc];
        } else {
          return {
            detalle: "No se encontró información para esta incidencia.",
            conclusiones: "",
            recomendaciones: "",
          };
        }
      };

      const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            setPdfUrl(URL.createObjectURL(file));
    
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
    
            const form = pdfDoc.getForm();
    
            // Crear un textbox en la primera página
            const textBox = form.createTextField('customTextBox');
            textBox.setText('Escribe aquí...');
    
            // Función para evitar repetición al dibujar texto
            const drawText = (text, x, y) => {
                firstPage.drawText(text, {
                    x,
                    y,
                    size: 8,
                    z: 1,
                    width: 306,
                    height: 9,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 0,
                    textColor: rgb(0, 0, 0),
                    backgroundColor: rgb(1, 1, 1),
                });
            };
    
            function splitTextIntoLines(text, maxCharsPerLine) {
              const words = text.split(' '); // Dividir el texto por palabras
              const lines = [];
              let currentLine = '';
          
              words.forEach(word => {
                  if ((currentLine + word).length <= maxCharsPerLine) {
                      currentLine += (currentLine ? ' ' : '') + word;
                  } else {
                      lines.push(currentLine);
                      currentLine = word;
                  }
              });
          
              if (currentLine) {
                  lines.push(currentLine);
              }
          
              return lines;
          }

          const { detalle, conclusiones, recomendaciones } = assignIncidenciaData(
            meter.falla_desc
          );

          let response = null
          
          try {
            response = await apiService.getAll({ meter_code: meter.meter_code });
            setMeterData(response.results[0]);
            response = response.results[0];
            //setIsMeterDataLoaded(true); // Marca que los datos están listos
          } catch (error) {
            alert("Error en extracción de datos del medidor: ", error);
          }
          
          const diametro = meter.meter_code.substring(2,4) === 'KA' ? '15mm' : '20mm'
          // Lista de textos y posiciones
          const textsAndPositions = [
              { text: 'No. de informe', x: calculateXObject(215, 523, 'No. de informe'), y: 757 }, //Identificador del informe
              { text: response.status_update_date, x: calculateXObject(215, 523, response.status_update_date), y: 746.5 }, //Fecha en la que se generó el informe
              { text: meter.meter_code, x: calculateXObject(215, 523, meter.meter_code), y: 736 }, //Identificador del medidor
              { text: 'No. NIS del registro', x: calculateXObject(215, 523, 'No. NIS del registro'), y: 725 }, //Nis asociado al servicio
              { text: 'Calle de ejemplo Carrera 25 29-128', x: calculateXObject(215, 523, 'Calle de ejemplo Carrera 25 29-128'), y: 709 }, //Dirección del registro o cliente
              //Condiciones iniciales de instalación
              { text: response.create_date, x: calculateXObject(53, 215, response.create_date), y: 668 }, //Fecha de registro en plataforma
              { text: 'Coordenadas de ubicación del medidor', x: calculateXObject(215, 422, 'Coordenadas de ubicación del medidor'), y: 668 }, //Coordenadas de ubicación del medidor
              { text: diametro, x: calculateXObject(420, 523, diametro), y: 668 }, //Diametro del medidor
              //Condiciones de visita a campo
              { text: response.tapa_desc, x: calculateXObject(205, 510, response.tapa_desc), y: 620 },
              { 
                text: detalle, 
                x: 221, 
                start: 205,
                end:  510,
                y: 365,
                maxCharsPerLine: 80,
              },
              //Reporte de incidencia despues de inspección	
              { text: meter.falla_desc, x: calculateXObject(205, 510, meter.falla_desc), y: 422 },		
              { text: '2025-01-02', x: calculateXObject(53, 215, '2025-01-02'), y: 464 }, //Fecha en la que se generó el informe		
              {
                  text: 'No cumple con la condición de tipo de tapa para una adecuada transmisión de datos por radiofrecuencia.',
                  x: 219,
                  start: 205,
                  end: 510,
                  y: 563,
                  maxCharsPerLine: 80,
              },
              {
                text: conclusiones,
                x: calculateXObject(52, 523, conclusiones),
                start: 50,
                end: 510,
                y: 280,
                maxCharsPerLine: 120,
              },
              {
                text: recomendaciones,
                x: calculateXObject(50, 526, recomendaciones),
                start: 50,
                end: 510,
                y: 220,
                maxCharsPerLine: 120,
              },
          ];
          
            // Generar posiciones para textos largos
            const processedTextsAndPositions = textsAndPositions.flatMap(({ text, x, start, end, y, maxCharsPerLine}) => {
              const lines = splitTextIntoLines(text, maxCharsPerLine ? maxCharsPerLine : 80);
              return lines.map((line, index) => ({
                text: line,
                x: start ? calculateXObject(start, end, line) : x,
                y: y + (lines.length > 2 ? 10 : 0) - index * 10, // Ajustar y si hay más de 2 líneas
              }));
            });
          
          // Dibujar textos usando la función auxiliar
          processedTextsAndPositions.forEach(({ text, x, y }) => drawText(text, x, y));
        
            // Agregar imagen al PDF desde Base64
            const base64Image = imageFile; // Aquí tu imagen en base64
            const imageBytes = Uint8Array.from(atob(base64Image.split(",")[1]), (char) => char.charCodeAt(0));
            let embeddedImage;

            if (base64Image.startsWith("data:image/png")) {
                embeddedImage = await pdfDoc.embedPng(imageBytes);
            } else if (base64Image.startsWith("data:image/jpeg")) {
                embeddedImage = await pdfDoc.embedJpg(imageBytes);
            } else {
                alert("Formato de imagen no soportado. Solo PNG o JPEG.");
                return;
            }

            firstPage.drawImage(embeddedImage, {
                x: 53, // Posición X de la imagen
                y: 525, // Posición Y de la imagen
                z: 200,
                width: 158,
                height: 120,
            });

            // Agregar imagen al PDF desde Base64
            const base64Image2 = imageSrcFile; // Aquí tu imagen en base64
            const imageBytes2 = Uint8Array.from(atob(base64Image2.split(",")[1]), (char) => char.charCodeAt(0));
            let embeddedImage2;

            if (base64Image2.startsWith("data:image/png")) {
                embeddedImage2 = await pdfDoc.embedPng(imageBytes2);
            } else if (base64Image2.startsWith("data:image/jpeg")) {
                embeddedImage2 = await pdfDoc.embedJpg(imageBytes2);
            } else {
                alert("Formato de imagen no soportado. Solo PNG o JPEG.");
                return;
            }

            firstPage.drawImage(embeddedImage2, {
                x: 53, // Posición X de la imagen
                y: 317, // Posición Y de la imagen
                z: 200,
                width: 158,
                height: 130,
            });

            // Crear un nuevo PDF editado
            const pdfBytes = await pdfDoc.save();
            const editedPdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
            setEditedPdfUrl(URL.createObjectURL(editedPdfBlob));
        } else {
            alert("Por favor, selecciona un archivo PDF válido.");
        }
    };

      const handleDeleteUser = async (userId) => {
        try {
            const data = await apiService.deleteUserById(userId);
            alert("Usuario eliminado con éxito.");
            window.location.reload();
            // Aquí podrías actualizar el estado o recargar la lista de usuarios
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Hubo un problema al eliminar el usuario.");
        }
    };
  
    
      
      const getButtonText = React.useMemo(() => {

        switch (actionKey) {
          case "edit":
            return "Editar";
          case "ScaleAlarm":
            return "Escalar Alarma";
          case "details":
            return "Detalles";
          case "ShowImage":
            return "Mostrar Imagen";
          case "generateReport":
            return "Generar Reporte";
          case "deleteUser":
            return "Eliminar un usuario"
          default:
            return "Cerrar";
        }

      },[actionKey]);

      const handleButtonPress = (actionKey) => {
        switch (actionKey) {
          case "edit":
            return handleUpdate;
          case "ScaleAlarm":
            return handleCreateIncidencia;
          case "generateReport":
            return onOpen;
          case "deleteUser":
            return (
              handleDeleteUser(meter.owner)
            );
          default:
            return null;
        }
      };

    return(
      <>
        <Modal
        backdrop="tranparent"
        shadow="lg"
        hideCloseButton={true}
        radius="xl"
        onOpenChange={onOpenChangeUpdate}
        isOpen={isOpenUpdate}
        className="items-center justify-center rounded-lg"
        scrollBehavior="outside"
        aria-hidden={false}
        aria-modal={true}
        size='xl'
      >
        <ModalContent
        
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col w-full gap-1 bg-custom-blue text-white border shadow shadow-lx text-center font-bold uppercase">{`${meter.user_name ? `Usuario seleccionado: ${meter.user_name}` : `Meter code Seleccionado: ${meter.meter_code}`}`}</ModalHeader>
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
                  className={`bg-custom-blue font-bold text-[15px] text-white ${actionKey === "details" || actionKey === "ShowImage" ? "hidden" : ""}`}
                  onClick={async () => {
                    const action = await handleButtonPress(actionKey);
                    if (action){
                      await action()
                    } else {
                      onClose()
                    };  // Solo ejecuta la función si existe
                  }}                  isDisabled={
                    actionKey === "edit" ? selectedModify.length === 0 : false
                  }
                >
                  {getButtonText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
      backdrop="tranparent"
      shadow="lg"
      hideCloseButton={true}
      radius="xl"
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      className="items-center justify-center place-items-center rounded-lg flex"
      scrollBehavior="outside"
      aria-hidden={false}
      aria-modal={true}
      size='2xl'
      placement="center"
      >
      <ModalContent

      >
        {(onCloseSecond) => (
          <>
            <ModalHeader className="flex flex-col w-full gap-1 bg-custom-blue text-white border shadow shadow-lx text-center font-bold uppercase">{`${meter.user_name ? `Usuario seleccionado: ${meter.user_name}` : `Meter code Seleccionado: ${meter.meter_code}`}`}</ModalHeader>
            <ModalBody className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx">
              <div className="w-full flex flex-col place-items-center justify-center">
              <label>
                  Cargar PDF:
                  <input type="file" accept="application/pdf" onChange={handleFileChange} />
                </label>
                <div className="flex w-full place-items-center justify-center">
                {editedPdfUrl && (
                  <div className="w-full py-3 rounded-lg">
                    <embed src={editedPdfUrl} className='rounded-lg' type="application/pdf" width="100%" height="500px" />
                    <div className="flex w-full justify-center place-items-center mt-2">
                      <Button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = editedPdfUrl;
                          link.download = 'pdf_modificado.pdf';
                          link.click();
                        }}
                        className="justify-center"
                      >
                        Descargar PDF
                      </Button>
                    </div>
                  </div>
                )}
                </div>
              </div>  
            </ModalBody>
            <ModalFooter className="flex flex-col w-full gap-1 bg-white border shadow shadow-lx py-2">
              <Button 
                color="danger" 
                variant="light"
                onPress={
                  ()=>{
                    onCloseSecond()
                    setLatitude('')
                    setLongitude('')
                }}>
                Cancelar
              </Button>
              <Button
                className={`bg-custom-blue font-bold text-[15px] text-white ${actionKey === "details" || actionKey === "ShowImage" ? "hidden" : ""}`}
                onPress={handleButtonPress(actionKey) === null ? onClose : handleButtonPress(actionKey)}
                isDisabled={
                  actionKey === "edit" ? selectedModify.length === 0 : false
                }
              >
                {getButtonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      </Modal>
    </>
    )};

  export default MainModal
  