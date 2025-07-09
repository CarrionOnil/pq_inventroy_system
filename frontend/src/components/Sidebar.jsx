import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaBoxes, FaUsers, FaTruck, FaSignOutAlt, FaHeadset } from 'react-icons/fa';

export default function Sidebar() {
  const location = useLocation();

  const navLinkClass = (path) =>
    `flex items-center gap-3 ${
      location.pathname === path ? 'text-purple-400 font-semibold' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col space-y-8">
      <div className="text-white text-2xl font-bold mb-6">B-Inventory</div>
      <nav className="flex flex-col space-y-4 text-sm">
        <Link to="/" className={navLinkClass('/')}>
          <FaChartBar /> Dashboard
        </Link>
        <Link to="/requisitions" className={navLinkClass('/requisitions')}>
          <FaTruck /> Requisitions
        </Link>
        <Link to="/stock" className={navLinkClass('/stock')}>
          <FaBoxes /> Stock
        </Link>
        <Link to="/employees" className={navLinkClass('/employees')}>
          <FaUsers /> Employees
        </Link>
        <Link to="/orders" className={navLinkClass('/orders')}>
          <FaChartBar /> Orders
        </Link>
      </nav>
      <div className="mt-auto">
        <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white">
          <FaHeadset /> Support
        </a>
        <a href="#" className="flex items-center gap-3 mt-4 text-red-400 hover:text-white">
          <FaSignOutAlt /> Logout
        </a>
      </div>
    </aside>
  );
}

