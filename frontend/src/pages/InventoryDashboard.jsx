// src/pages/InventoryDashboard.jsx
import { useEffect, useState } from 'react';
import { API_BASE } from '../config';
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
      try {
        const res = await fetch(`${API_BASE}/stock`);
        if (!res.ok) {
          console.warn('Products fetch failed:', res.status);
          setProducts([]);
          return;
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
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

      </div>
    </main>
  );
}







