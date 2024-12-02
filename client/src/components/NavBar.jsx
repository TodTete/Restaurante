import { Link, useNavigate } from "react-router-dom";
import {  FaHome,FaList, FaHistory, FaUserCog,  FaClipboardList,  FaShoppingCart,  FaSignOutAlt, FaUserCircle }from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/sales"
          className="text-white font-bold text-2xl tracking-wide"
        >
          Tete Dev
        </Link>

        <div className="flex space-x-6">
          {token ? (
            <>
              <Link
                to="/sales"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaHome className="mr-2" />
                Dashboard
              </Link>
              <Link
                to="/articles"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaList className="mr-2" />
                Inventario
              </Link>
              <Link
                to="/history"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaHistory className="mr-2" />
                Historial
              </Link>
              <Link
                to="/manager"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaUserCog className="mr-2" />
                Usuarios
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaUserCircle className="mr-2" />
                Iniciar Sesión
              </Link>
              <Link
                to="/orders"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaClipboardList className="mr-2" />
                Órdenes
              </Link>
              <Link
                to="/request"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <FaShoppingCart className="mr-2" />
                Pedidos
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;