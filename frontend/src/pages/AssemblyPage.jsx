import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function AssemblyPage() {
  const [stock, setStock] = useState([]);
  const [boms, setBoms] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null: form closed; {}: add; object: edit
  const [form, setForm] = useState({
    product_barcode: "",
    description: "",
    components: [{ compBarcode: "", qty: 1 }],
  });

  // Load stock and BOMs
  const fetchStock = () =>
    fetch(`${API_BASE}/stock`)
      .then(r => r.json())
      .then(setStock);
  const fetchBoms = () =>
    fetch(`${API_BASE}/boms`)
      .then(r => r.json())
      .then(setBoms);

  useEffect(() => {
    fetchStock();
    fetchBoms();
  }, []);

  const startNewBom = () => {
    setEditing({ product_barcode: "" });
    setForm({
      product_barcode: "",
      description: "",
      components: [{ compBarcode: "", qty: 1 }],
    });
  };

  const handleSaveBom = async () => {
    const payload = {
      product_barcode: form.product_barcode,
      description: form.description,
      components: form.components
        .filter(c => c.compBarcode)
        .reduce((acc, { compBarcode, qty }) => {
          acc[compBarcode] = Number(qty);
          return acc;
        }, {}),
    };
    try {
      await fetch(
        editing?.product_barcode
          ? `${API_BASE}/boms/${editing.product_barcode}`
          : `${API_BASE}/boms`,
        {
          method: editing?.product_barcode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      fetchBoms();
      setEditing(null);
    } catch (err) {
      console.error("Error saving BOM:", err);
    }
  };

  const handleEdit = bom => {
    setEditing(bom);
    setForm({
      product_barcode: bom.product_barcode,
      description: bom.description,
      components: Object.entries(bom.components).map(([barcode, qty]) => ({
        compBarcode: barcode,
        qty,
      })),
    });
  };

  const handleDelete = async barcode => {
    if (confirm("Delete this BOM?")) {
      await fetch(`${API_BASE}/boms/${barcode}`, { method: "DELETE" });
      fetchBoms();
    }
  };

  const totalCost = bom => {
    return Object.entries(bom.components).reduce((sum, [cb, qty]) => {
      const item = stock.find(i => i.barcode === cb);
      return sum + (item?.cost || 0) * qty;
    }, 0).toFixed(2);
  };

  return (
    <div className="p-6 text-white">
      {/* --- Assembly Section (unchanged) --- */}

      {/* BOM Management */}
      <hr className="my-6 border-gray-700" />
      <h2 className="text-2xl font-bold mb-4">Manage BOMs</h2>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-black rounded-md flex-grow mr-2"
        />
        <button
          onClick={startNewBom}
          className="px-3 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + New BOM
        </button>
      </div>

      {(editing !== null) && (
        <div className="mb-6 bg-gray-800 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">
            {editing.product_barcode ? "Edit" : "New"} BOM
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.product_barcode}
              onChange={e =>
                setForm({ ...form, product_barcode: e.target.value })
              }
              className="border px-3 py-2 rounded text-black"
            >
              <option value="">-- Select Product --</option>
              {stock.map(i => (
                <option key={i.barcode} value={i.barcode}>
                  {i.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
              className="border px-3 py-2 rounded text-black"
            />
          </div>

          {form.components.map((c, idx) => (
            <div key={idx} className="flex gap-2 mt-3 items-center">
              <select
                value={c.compBarcode}
                onChange={e => {
                  const arr = [...form.components];
                  arr[idx].compBarcode = e.target.value;
                  setForm({ ...form, components: arr });
                }}
                className="border px-3 py-2 rounded text-black flex-1"
              >
                <option value="">-- Component --</option>
                {stock.map(i => (
                  <option key={i.barcode} value={i.barcode}>
                    {i.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={c.qty}
                onChange={e => {
                  const arr = [...form.components];
                  arr[idx].qty = e.target.value;
                  setForm({ ...form, components: arr });
                }}
                className="border px-3 py-2 rounded text-black w-20"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    components: form.components.filter((_, i) => i !== idx),
                  })
                }
                className="text-red-500"
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                components: [...form.components, { compBarcode: "", qty: 1 }],
              })
            }
            className="text-blue-300 mt-3"
          >
            + Component
          </button>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSaveBom}
              className="px-3 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-3 py-2 border rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white text-black rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Total Cost</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {boms
            .filter(
              b =>
                b.product_barcode.includes(search) ||
                (b.description || "")
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
            .map(bom => {
              const prod = stock.find(
                i => i.barcode === bom.product_barcode
              );
              return (
                <tr key={bom.product_barcode} className="border-t">
                  <td className="px-4 py-2">{prod?.name || bom.product_barcode}</td>
                  <td className="px-4 py-2">{bom.description}</td>
                  <td className="px-4 py-2">${totalCost(bom)}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(bom)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bom.product_barcode)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          {boms.length === 0 && (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-center text-gray-600">
                No BOMs defined.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


