import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import REPORTE from '../../../../../utils/REPORTE_.pdf';

const PdfView = () => {
    const pdfRef = useRef();

    const downloadPdf = () => {
        // Capturar el contenido del PDF y los elementos HTML visibles
        html2canvas(pdfRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            // Crear un nuevo PDF y agregar la imagen capturada
            const doc = new jsPDF();
            doc.addImage(imgData, 'PNG', 0, 0, 210, 297); // Tamaño de carta (A4)

            // Guardar el archivo PDF
            doc.save('VistaCompleta.pdf');
        });
    };

    return (
        <div ref={pdfRef} className="relative w-full h-full flex items-center justify-center">
            <object
                data={REPORTE} // Ruta del archivo PDF
                type="application/pdf"
                className="w-full h-full"
                aria-label="PDF Viewer"
            >
                <p className="text-center">Tu navegador no soporta el formato PDF. Por favor, descarga el archivo para verlo.</p>
            </object>
            <div className="absolute top-12 left-12 p-4 bg-white bg-opacity-70 rounded-md shadow-lg">
                <h1 className="text-xl font-bold">Encima del PDF</h1>
                <p>Texto o elementos que desees agregar encima del PDF.</p>
            </div>
            <button
                onClick={downloadPdf}
                className="absolute bottom-4 right-4 p-2 bg-blue-500 text-white rounded-md"
            >
                Descargar Vista Completa
            </button>
        </div>
    );
};

export default PdfView;
