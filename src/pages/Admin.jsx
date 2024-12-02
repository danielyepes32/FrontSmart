import React from 'react';
import { RiMenuSearchLine } from 'react-icons/ri';
import { BrowserRouter as Router, Route, Routes , useLocation} from 'react-router-dom';
import Menu from '../components/MenuAdmin';
import MainContent from './admin/MainContent';
import IngestaAdmin from './admin/IngestaData';
import IngestaError from './admin/IngestError';
import GestionData from './admin/GestionData';
import ExcelReader from './admin/UploadExcel';
import FileUpload from './admin/ImportExcel';
import GatewayDashboard from './admin/GatewaysDashboard';
import PowerView from './admin/PowerBI';

const Admin = () => {

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  console.log(isAuthenticated)

  const [sidebar, setSidebar] = React.useState(false);

  const handleSidebar = () => {
    setSidebar(!sidebar);
    console.log(sidebar);
    window.innerWidth >= 1024 ? setSidebar(false) : true;
  }

  React.useEffect(() => {
    const handleResize = () => {
      // Si el ancho de la ventana es mayor o igual a 1024px (lg), setSidebar será false
      setSidebar(window.innerWidth >= 1024 ? false : true);
    };

    // Ejecuta handleResize cuando el componente se monta
    handleResize();

    // Agrega un listener para manejar el redimensionamiento de la ventana
    window.addEventListener('resize', handleResize);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return isAuthenticated ? (
    <div className="min-h-screen flex grid grid-cols-1 lg:grid-cols-7">
      {/* Sidebar */}
      <Menu sidebar={sidebar} handleSidebar={handleSidebar} />
      {/* Contenido principal */}
      <Routes>
        <Route path="/" element={<MainContent sidebar={sidebar} />} />
        <Route path="/dashboard" element={<MainContent sidebar={sidebar} />} />
        <Route path="/ingesta" element={<IngestaAdmin sidebar={sidebar} />} />
        <Route path="/error" element={<IngestaError sidebar={sidebar} />} />
        <Route path="/gestion" element={<GestionData sidebar={sidebar} />} />
        <Route path="/excel" element={<ExcelReader sidebar={sidebar} />} />
        <Route path="/upload" element={<FileUpload sidebar={sidebar} />} />
        <Route path="/gateways" element={<GatewayDashboard sidebar={sidebar} />} />
        <Route path="/power_view" element={<PowerView sidebar={sidebar} />} />
      </Routes>
      {/* Botón del menú móvil */}
      <button
        className="z-[200] block lg:hidden fixed bottom-4 right-4 bg-custom-blue text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl"
        onClick={handleSidebar}
      >
        <RiMenuSearchLine />
      </button>
    </div>
  ) : (
    <div className="h-full w-full">
      <h1>USTED NO TIENE ACCESO A ESTAS VISTAS</h1>
    </div>
  )
};

export default Admin;
