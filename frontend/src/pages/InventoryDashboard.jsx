// src/pages/InventoryDashboard.jsx
import { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import StockActions from '../components/StockActions';
import ScanBarcode from '../components/ScanBarcode';
import StatWidgets from '../components/StatWidgets';
import SalesChart from '../components/SalesChart';
import RequisitionList from '../components/RequisitionList';
import ProductCards from '../components/ProductCards';
import RecentActivities from '../components/RecentActivities';

export default function InventoryDashboard() {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('http://localhost:8000/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, [refresh]);

  return (
    <main className="flex-1 p-6 overflow-y-auto text-white">
      <div className="w-full px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatWidgets />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <ProductCards products={products} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RequisitionList />
          </div>
          <RecentActivities />
        </div>

        <div className="space-y-4">
          <ScanBarcode setRefresh={setRefresh} />
          <StockActions setRefresh={setRefresh} />
          <ProductList products={products} />
        </div>
      </div>
    </main>
  );
}





