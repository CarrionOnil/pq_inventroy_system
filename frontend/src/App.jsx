import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import InventoryDashboard from './pages/InventoryDashboard';
import StockPage from './pages/StockPage';
import LocationsPage from './pages/Locations';
import BarcodeScannerPage from './pages/BarcodeScannerPage'; 
import StockLogs from './pages/StockLogs';
// import SettingsPage from './pages/SettingsPage';


function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<InventoryDashboard />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/logs" element={<StockLogs />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/barcode" element={<BarcodeScannerPage />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;




