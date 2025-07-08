export default function StatWidgets() {
  const stats = [
    { label: 'No. of Sales', value: '2,225' },
    { label: 'Last Month Profit', value: '57.43%' },
    { label: 'Net Profit', value: '61.37%' },
    { label: 'Items in Stock', value: '96' },
  ];

  return stats.map((stat, i) => (
    <div key={i} className="bg-gray-800 rounded p-4 shadow">
      <div className="text-sm opacity-70">{stat.label}</div>
      <div className="text-xl font-bold">{stat.value}</div>
    </div>
  ));
}
