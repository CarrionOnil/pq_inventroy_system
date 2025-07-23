import { useEffect, useState } from 'react';
import { API_BASE } from '../config';

export default function StockLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/stock_logs`);
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        setLogs([]);
      }
    };
    fetchLogs();
  }, []);

  function formatLogDetails(action, details) {
    if (!details || typeof details !== 'object') return '-';

    if (action === 'consume' && details.used_for) {
      return `Used to assemble ${details.used_for}`;
    }

    if (action === 'assemble' && details.components) {
      const parts = Object.entries(details.components).map(
        ([code, qty]) => `${qty} × ${code}`
      );
      return `Assembled from: ${parts.join(', ')}`;
    }

    if (action === 'bom_create' || action === 'bom_update') {
      const parts = Object.entries(details.components || {}).map(
        ([code, qty]) => `${qty} × ${code}`
      );
      return `BOM: ${parts.join(', ')}`;
    }

    // Default: print field-level diffs
    const diffs = Object.entries(details).map(([key, val]) => {
      if (Array.isArray(val) && val.length === 2 && typeof val[0] !== 'object') {
        return `${key}: ${val[0]} → ${val[1]}`;
      }
      if (typeof val === 'object') {
        return `${key}: ${Object.entries(val).map(([k, v]) => `${k} × ${v}`).join(', ')}`;
      }
      return `${key}: ${String(val)}`;
    });

    return diffs.length ? diffs.join(' | ') : '-';
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Stock Activity Log</h1>
      <div className="overflow-auto bg-white shadow rounded-lg text-black">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Barcode</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Result Qty</th>
              <th className="px-4 py-2 text-left">Changes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 capitalize">{log.action}</td>
                <td className="px-4 py-2">{log.barcode || '-'}</td>
                <td className="px-4 py-2">{log.amount ?? '-'}</td>
                <td className="px-4 py-2">{log.resulting_qty ?? '-'}</td>
                <td className="px-4 py-2">{formatLogDetails(log.action, log.details)}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-400" colSpan="7">
                  No logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
