import { Link, useLocation } from 'react-router-dom';
import {
  FaChartBar,
  FaBoxes,
  FaExchangeAlt,
  FaWarehouse,
  FaCogs,
  FaSignOutAlt,
  FaBarcode,
} from 'react-icons/fa';

export default function Sidebar() {
  const location = useLocation();

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-2 py-2 rounded-md transition ${
      location.pathname === path
        ? 'bg-gray-700 text-purple-400 font-semibold'
        : 'text-gray-300 hover:text-white hover:bg-gray-700'
    }`;

  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col h-screen">
      {/* Brand */}
      <div className="text-white text-2xl font-bold mb-6">PQ-Inventory</div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-sm">
        <Link to="/" className={navLinkClass('/')}>
          <FaChartBar /> Dashboard
        </Link>
        <Link to="/stock" className={navLinkClass('/stock')}>
          <FaBoxes /> Stock
        </Link>
        <Link to="/logs" className={navLinkClass('/logs')}>
          <FaExchangeAlt /> Stock Logs
        </Link>
        <Link to="/locations" className={navLinkClass('/locations')}>
          <FaWarehouse /> Locations
        </Link>
        <Link to="/barcode" className={navLinkClass('/barcode')}>
          <FaBarcode /> Scan
        </Link>
        <Link to="/settings" className={navLinkClass('/settings')}>
          <FaCogs /> Settings
        </Link>
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <a
          href="#"
          className="flex items-center gap-3 text-red-400 hover:text-white transition"
        >
          <FaSignOutAlt /> Logout
        </a>
      </div>
    </aside>
  );
}


