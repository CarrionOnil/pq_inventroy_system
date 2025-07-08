// src/components/ProductList.jsx

export default function ProductList({ products }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border bg-white shadow-sm rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td className="p-4" colSpan={3}>No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.quantity}</td>
                <td className="p-3">{new Date(product.updated_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
