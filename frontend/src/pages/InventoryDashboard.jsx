// src/pages/InventoryDashboard.jsx
import { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import StockActions from '../components/StockActions';
import ScanBarcode from '../components/ScanBarcode';

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      <ScanBarcode setRefresh={setRefresh} />
      <StockActions setRefresh={setRefresh} />
      <ProductList products={products} />
    </div>
  );
}