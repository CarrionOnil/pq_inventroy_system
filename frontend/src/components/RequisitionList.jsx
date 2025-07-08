export default function RequisitionList() {
  const requisitions = [
    { item: 'Dinner Set', units: 10 },
    { item: 'Sports Bottles', units: 15 },
    { item: 'Coffee Mugs', units: 150 },
  ];

  return (
    <div className="bg-gray-800 rounded p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Requisition List</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Units</th>
            <th className="p-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {requisitions.map((req, i) => (
            <tr key={i} className="border-b border-gray-700">
              <td className="p-2">{req.item}</td>
              <td className="p-2">{req.units}</td>
              <td className="p-2 text-gray-500">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
