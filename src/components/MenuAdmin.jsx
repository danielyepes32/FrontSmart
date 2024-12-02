import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiLogoutBoxLine } from 'react-icons/ri';
import React, { useState, useEffect } from 'react';
import { PiWarningOctagonBold } from "react-icons/pi";
import { MdOutlineDataSaverOn } from "react-icons/md";

const Menu = ({ sidebar, handleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("/admin/dashboard");
  const [showSubmenu, setShowSubmenu] = useState(false); // Estado para mostrar/ocultar submenú
  const [showSubmenuGateway, setShowSubmenuGateway] = useState(false); // Estado para mostrar/ocultar submenú

  // Redirigir si la URL actual es /admin
  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/dashboard');
      setActiveLink('/admin/dashboard');
    }
  }, [location, navigate]);

  // Función para manejar el click en los enlaces del menú
  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  // Función para generar la clase CSS según si el enlace está activo
  const generateLinkClasses = (isActive) => {
    return `tracking-custom font-poppins font-regular flex items-center justify-left gap-2 p-3 px-6 transition-all duration-500 ease-in-out transform ${
      isActive
        ? "font-bold border-l-4 border-blue-admin text-blue-admin translate-x-2"
        : "border-transparent text-black-menu hover:font-bold hover:border-blue-400 hover:text-blue-400 hover:translate-x-2"
    }`;
  };

  // Función para manejar el click en Gestión de Data y alternar el submenú
  const handleGestionClick = () => {
    setShowSubmenu(!showSubmenu) // Alterna el estado del submenú
    !showSubmenu === true ? setShowSubmenuGateway(false) : null
  };

  // Función para manejar el click en Gestión de Data y alternar el submenú
  const handleGestionClickGateway = () => {
    setShowSubmenuGateway(!showSubmenuGateway); // Alterna el estado del submenú
    !showSubmenuGateway === true ? setShowSubmenu(false) : null
  };

  return (
    <>
      <aside className="h-screen fixed lg:sticky top-0 z-[100] shadow-medium">
        <div className={`fixed lg:static w-full h-full bg-white col-span-1 transform transition-all duration-300 ease-in-out lg:opacity-100 lg:translate-x-0 lg:visible ${
          sidebar ? 'opacity-100 translate-x-0 visible' : 'opacity-0 -translate-x-full invisible'
        }`}>
          <div className="flex justify-center p-8">
            <h1 className="text-blue-admin font-poppins font-medium text-24 px-3">Administrador</h1>
          </div>
          <div className="flex flex-col w-full">
            {/* Menú Admin */}
            <nav className="w-full">
              <ul className="items-center">
                {/* Elementos del menú con NavLink */}
                <li>
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => generateLinkClasses(isActive)}
                    onClick={() => handleLinkClick("/admin/dashboard")}
                  >
                    <RiDashboardLine />
                    Dashboard
                  </NavLink>
                </li>

                {/* Gestión de Data con submenú animado */}
                <li>
                  <div
                    className='tracking-custom font-poppins font-regular flex items-center justify-left gap-2 p-3 px-6 transition-all duration-500 ease-in-out transform border-transparent text-black-menu hover:font-bold hover:border-blue-400 hover:text-blue-400 hover:translate-x-2'
                    onClick={handleGestionClick}
                  >
                    <MdOutlineDataSaverOn />
                    Gestión de datos
                  </div>

                  {/* Submenú con animación */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      showSubmenu ? 'max-h-40' : 'max-h-0'
                    }`}
                  >
                    <ul className="pl-8">
                      <li className="py-2">
                        <NavLink
                          to="/admin/ingesta"
                          className={({ isActive }) => generateLinkClasses(isActive)}
                          onClick={() => handleLinkClick("/admin/ingesta")}
                        >
                          Datos medidores
                        </NavLink>
                      </li>
                      <li className="py-2">
                        <NavLink
                          to="/admin/upload"
                          className={({ isActive }) => generateLinkClasses(isActive)}
                          onClick={() => handleLinkClick("/admin/upload")}
                        >
                          Subir incidencias
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>

                <li>
                  <NavLink
                    to="/admin/error"
                    className={({ isActive }) => generateLinkClasses(isActive)}
                    onClick={() => handleLinkClick("/admin/error")}
                  >
                    <PiWarningOctagonBold />
                    Errores
                  </NavLink>
                </li>

                {/* Gestión de Data con submenú animado */}
                <li>
                  <div
                    className='tracking-custom font-poppins font-regular flex items-center justify-left gap-2 p-3 px-6 transition-all duration-500 ease-in-out transform border-transparent text-black-menu hover:font-bold hover:border-blue-400 hover:text-blue-400 hover:translate-x-2'
                    onClick={handleGestionClickGateway}
                  >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="justify-center"
                      >
                        <path d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25C15.59 1.25 15.25 1.59 15.25 2V3.5H8.74999V2C8.74999 1.59 8.40999 1.25 7.99999 1.25C7.58999 1.25 7.24999 1.59 7.24999 2V3.56C4.54999 3.81 3.23999 5.42 3.03999 7.81C3.01999 8.1 3.25999 8.34 3.53999 8.34H20.46C20.75 8.34 20.99 8.09 20.96 7.81C20.76 5.42 19.45 3.81 16.75 3.56Z" stroke="currentColor"/>
                        <path d="M19 15C16.79 15 15 16.79 15 19C15 19.75 15.21 20.46 15.58 21.06C16.27 22.22 17.54 23 19 23C20.46 23 21.73 22.22 22.42 21.06C22.79 20.46 23 19.75 23 19C23 16.79 21.21 15 19 15ZM21.07 18.57L18.94 20.54C18.8 20.67 18.61 20.74 18.43 20.74C18.24 20.74 18.05 20.67 17.9 20.52L16.91 19.53C16.62 19.24 16.62 18.76 16.91 18.47C17.2 18.18 17.68 18.18 17.97 18.47L18.45 18.95L20.05 17.47C20.35 17.19 20.83 17.21 21.11 17.51C21.39 17.81 21.37 18.28 21.07 18.57Z" stroke="currentColor"/>
                        <path d="M20 9.84H4C3.45 9.84 3 10.29 3 10.84V17C3 20 4.5 22 8 22H12.93C13.62 22 14.1 21.33 13.88 20.68C13.68 20.1 13.51 19.46 13.51 19C13.51 15.97 15.98 13.5 19.01 13.5C19.3 13.5 19.59 13.52 19.87 13.57C20.47 13.66 21.01 13.19 21.01 12.59V10.85C21 10.29 20.55 9.84 20 9.84ZM9.21 18.21C9.02 18.39 8.76 18.5 8.5 18.5C8.24 18.5 7.98 18.39 7.79 18.21C7.61 18.02 7.5 17.76 7.5 17.5C7.5 17.24 7.61 16.98 7.79 16.79C7.89 16.7 7.99 16.63 8.12 16.58C8.49 16.42 8.93 16.51 9.21 16.79C9.39 16.98 9.5 17.24 9.5 17.5C9.5 17.76 9.39 18.02 9.21 18.21ZM9.21 14.71C9.16 14.75 9.11 14.79 9.06 14.83C9 14.87 8.94 14.9 8.88 14.92C8.82 14.95 8.76 14.97 8.7 14.98C8.63 14.99 8.56 15 8.5 15C8.24 15 7.98 14.89 7.79 14.71C7.61 14.52 7.5 14.26 7.5 14C7.5 13.74 7.61 13.48 7.79 13.29C8.02 13.06 8.37 12.95 8.7 13.02C8.76 13.03 8.82 13.05 8.88 13.08C8.94 13.1 9 13.13 9.06 13.17C9.11 13.21 9.16 13.25 9.21 13.29C9.39 13.48 9.5 13.74 9.5 14C9.5 14.26 9.39 14.52 9.21 14.71ZM13.21 18.21C13.02 18.39 12.76 18.5 12.5 18.5C12.24 18.5 11.98 18.39 11.79 18.21C11.61 18.02 11.5 17.76 11.5 17.5C11.5 17.24 11.61 16.98 11.79 16.79C12.07 16.51 12.51 16.42 12.88 16.58C13.01 16.63 13.11 16.7 13.21 16.79C13.39 16.98 13.5 17.24 13.5 17.5C13.5 17.76 13.39 18.02 13.21 18.21Z" stroke="currentColor"/>
                      </svg>
                    Gestión de datos
                  </div>

                  {/* Submenú con animación */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      showSubmenuGateway ? 'max-h-60' : 'max-h-0'
                    }`}
                  >
                    <ul className="pl-8">
                      <li className="py-2">
                        <NavLink
                          to="/admin/gestion"
                          className={({ isActive }) => generateLinkClasses(isActive)}
                          onClick={() => handleLinkClick("/admin/gestion")}
                        >
                          Gestión gateways
                        </NavLink>
                      </li>
                      <li className="py-2">
                        <NavLink
                          to="/admin/gateways"
                          className={({ isActive }) => generateLinkClasses(isActive)}
                          onClick={() => handleLinkClick("/admin/gateways")}
                        >
                          Datos gateways
                        </NavLink>
                      </li>
                      <li className="py-2">
                        <NavLink
                          to="/admin/power_view"
                          className={({ isActive }) => generateLinkClasses(isActive)}
                          onClick={() => handleLinkClick("/admin/power_view")}
                        >
                          Vista PowerBi
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Opciones adicionales y cierre de sesión */}
                <div className='flex flex-col mt-auto absolute bottom-0 py-6'>
                  {/* Opción de cerrar sesión */}
                  <NavLink
                    to="/"
                    className={({ isActive }) => generateLinkClasses(isActive)}
                    onClick={() => handleLinkClick("/admin/usuario")}
                  >
                    <RiLogoutBoxLine />
                    Cerrar sesión
                  </NavLink>
                </div>
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Menu;
