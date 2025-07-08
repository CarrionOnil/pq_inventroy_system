export default function RecentActivities() {
  const activities = [
    'New order placed',
    'Product restocked',
    'Updated product quantity',
    'Checked stock levels',
  ];

  return (
    <div className="bg-gray-800 rounded p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
      <ul className="text-sm space-y-2 text-gray-400">
        {activities.map((act, i) => (
          <li key={i}>• {act}</li>
        ))}
      </ul>
    </div>
  );
}
