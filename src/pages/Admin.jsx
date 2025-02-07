import React from 'react';
import { RiMenuSearchLine } from 'react-icons/ri';
import { BrowserRouter as Router, Route, Routes , useLocation, Navigate} from 'react-router-dom';
import Menu from '../components/MenuAdmin';
import MainContent from './admin/MainContent';
import IngestaAdmin from './admin/IngestaData';
import IngestaError from './admin/IngestError';
import GestionData from './admin/GestionData';
import ExcelReader from './admin/UploadExcel';
import FileUpload from './admin/ImportExcel';
import GatewayDashboard from './admin/dashboard/GatewaysDashboard';
import PowerView from './admin/PowerBI';
import DashboardMain from './admin/DashboardMain';
import AccounManagment from './admin/userManagment';
import apiService from '../services/apiService';

const Admin = () => {

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const [sidebar, setSidebar] = React.useState(false);
  const [isSuperUser, setIsUperUser] = React.useState(false);

  const handleSidebar = () => {
    setSidebar(!sidebar);
    window.innerWidth >= 1024 ? setSidebar(false) : true;
  }

  React.useEffect(() => {
    //Aquí se establece que el fetch o consulta es asincrónico para optimizar el batch
    const fetchData = async () => {
      try {
        //Una vez con los parametros ejecutamos la consulta y obtenemos el resultado
        const initialUser = await apiService.getAllDescriptions();

        const userPermissions = initialUser.results[0].owner_isSuperuser

        userPermissions ? setIsUperUser(true): setIsUperUser(false)
      } catch (error) {
        console.error('Error fetching initial meters:', error);
      } finally {
      }
    };
    fetchData();
  }, []);

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
      <Menu sidebar={sidebar} handleSidebar={handleSidebar} isSuperUser={isSuperUser}/>
      {/* Contenido principal */}
      <Routes>
        <Route path="/" element={<MainContent sidebar={sidebar} />} />
        <Route path="/dashboard" element={<MainContent sidebar={sidebar} />} />
        <Route path="/ingesta" element={<IngestaAdmin sidebar={sidebar} />} />
        <Route path="/error" element={<IngestaError sidebar={sidebar} />} />
        <Route path="/gestion" element={<GestionData sidebar={sidebar} />} />
        <Route path="/excel" element={<ExcelReader sidebar={sidebar} />} />
        <Route path="/upload" element={<FileUpload sidebar={sidebar} />} />
        <Route path="/gateways/*" element={<DashboardMain sidebar={sidebar} />} />
        <Route path="/power_view" element={<PowerView sidebar={sidebar} />} />
        <Route
          path="/accountManagment"
          element={isSuperUser ? <AccounManagment sidebar={sidebar} /> : isAuthenticated ? null : <Navigate to="/" replace />}
        />
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
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg">
        <svg
          className="w-16 h-16 text-red-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800">Acceso Denegado</h1>
        <p className="text-gray-600 mt-2">
          No tienes permiso para ver esta página.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
};

export default Admin;
