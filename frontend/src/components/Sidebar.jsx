import { FaChartBar, FaBoxes, FaUsers, FaTruck, FaSignOutAlt, FaHeadset } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col space-y-8">
      <div className="text-white text-2xl font-bold mb-6">B-Inventory</div>
      <nav className="flex flex-col space-y-4 text-sm">
        <a href="#" className="flex items-center gap-3 text-purple-400 font-semibold">
          <FaChartBar /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white">
          <FaTruck /> Requisitions
        </a>
        <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white">
          <FaBoxes /> Stock
        </a>
        <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white">
          <FaUsers /> Employees
        </a>
        <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white">
          <FaChartBar /> Orders
        </a>
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
