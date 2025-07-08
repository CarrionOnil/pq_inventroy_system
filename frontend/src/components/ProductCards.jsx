export default function ProductCards({ products }) {
  return (
    <div className="bg-gray-800 rounded p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Products</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.slice(0, 3).map((product) => (
          <div key={product.id} className="bg-gray-700 p-4 rounded text-center">
            <div className="text-sm">{product.name}</div>
            <div className="text-lg font-bold">{product.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
