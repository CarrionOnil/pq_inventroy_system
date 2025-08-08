// src/components/stockPage/ItemDetailsModal.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  Pencil,
  FileText,
  Tag,
  Barcode,
  DollarSign,
  MapPin,
  Trash2,
  ArrowLeftRight,
} from "lucide-react";
import { API_BASE as CONFIG_API_BASE } from "../../config";
import TransferItemModal from "./TransferItemModal";
import ScrapItemModal from "./ScrapItemModal";

/* ----------------------------- URL Utilities ----------------------------- */
const joinUrl = (base, path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  const b = (base || "").replace(/\/+$/, "");
  const p = String(path).replace(/^\/+/, "");
  return `${b}/${p}`;
};

// Always have a base, no trailing slash
const SAFE_API_BASE =
  (CONFIG_API_BASE || import.meta.env.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");

/* ----------------------------- Error Boundary ----------------------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 text-red-700 rounded-lg">
          Error: {this.state.error?.message || "Something went wrong."}
        </div>
      );
    }
    return this.props.children;
  }
}

/* --------------------------------- Pieces -------------------------------- */
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 py-2">
    {Icon ? <Icon className="h-4 w-4 mt-0.5 text-gray-400" /> : null}
    <dt className="min-w-[110px] text-xs font-medium text-gray-500">{label}</dt>
    <dd className="text-sm text-gray-800">{value ?? "N/A"}</dd>
  </div>
);

const Badge = ({ children, color = "slate" }) => {
  const styles = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-green-100 text-green-700 ring-green-200",
    blue: "bg-blue-100 text-blue-700 ring-blue-200",
    amber: "bg-amber-100 text-amber-800 ring-amber-200",
  }[color];
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles}`}>
      {children}
    </span>
  );
};

/* ------------------------------ Main Component ---------------------------- */
const ItemDetailsModal = ({ isOpen, onClose, item, onEdit }) => {
  // ---- Hooks must always be declared in the same order (no early returns above here) ----
  const [showTransfer, setShowTransfer] = useState(false);
  const [showScrap, setShowScrap] = useState(false);
  const [locationsList, setLocationsList] = useState([]);
  const [imgError, setImgError] = useState(false);

  // Debug: log open/close
  useEffect(() => {
    console.debug("[ItemDetailsModal] isOpen:", isOpen);
  }, [isOpen]);

  // Reset image error when image url changes
  useEffect(() => {
    setImgError(false);
  }, [item?.image_url]);

  // Fetch locations (declared unconditionally; guarded inside)
  useEffect(() => {
    if (!isOpen) return;
    const url = joinUrl(SAFE_API_BASE, "/locations");
    console.debug("[ItemDetailsModal] Fetching locations from:", url);
    fetch(url)
      .then((res) => {
        console.debug("[ItemDetailsModal] Locations response status:", res.status);
        if (!res.ok) throw new Error(`Failed to fetch locations (${res.status})`);
        return res.json();
      })
      .then((data) => {
        console.debug("[ItemDetailsModal] Locations fetched:", Array.isArray(data) ? data.length : data);
        setLocationsList(data || []);
      })
      .catch((err) => console.error("[ItemDetailsModal] Failed to fetch locations:", err));
  }, [isOpen]);

  // Compute debug info (don’t rely on item existing yet)
  const imageSrc = item?.image_url ? joinUrl(SAFE_API_BASE, item.image_url) : "";
  useEffect(() => {
    console.debug("[ItemDetailsModal] SAFE_API_BASE:", SAFE_API_BASE);
    console.debug("[ItemDetailsModal] item?.image_url:", item?.image_url);
    console.debug("[ItemDetailsModal] computed imageSrc:", imageSrc);
    if (item) console.debug("[ItemDetailsModal] Item payload:", item);
  }, [item, imageSrc]);

  // ---- Guard AFTER hooks are declared to avoid hook-order mismatches ----
  if (!isOpen || !item) {
    // Silent no-op render while data settles
    return null;
  }

  const totalQty = Array.isArray(item.locations)
    ? item.locations.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0)
    : 0;

  return (
    <ErrorBoundary>
      <Transition.Root show={!!isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-2 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-2 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 px-6 py-5 border-b">
                    <div className="space-y-1">
                      <Dialog.Title className="text-xl font-semibold text-gray-900">
                        {item.name}
                      </Dialog.Title>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge color="blue">Part ID: {item.partId}</Badge>
                        <Badge color="green">Total: {totalQty}</Badge>
                        {item.category ? <Badge>{item.category}</Badge> : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-5">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Image / Media */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        {item.image_url && !imgError ? (
                          <img
                            src={imageSrc}
                            alt={item.name}
                            className="h-64 w-full object-contain bg-slate-50"
                            onLoad={() => {
                              console.debug("[ItemDetailsModal] Image loaded ok:", imageSrc);
                            }}
                            onError={(e) => {
                              console.error("[ItemDetailsModal] Image failed to load:", {
                                imageSrc,
                                item_image_url: item.image_url,
                                SAFE_API_BASE,
                              });
                              setImgError(true);
                              e.currentTarget.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="h-64 w-full bg-slate-50 grid place-items-center text-slate-400">
                            No Image
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 p-4 border-t">
                          <div className="rounded-lg bg-slate-50 p-3">
                            <div className="text-xs text-slate-500">Scrapped</div>
                            <div className="text-base font-semibold">
                              {item.scrap_count || 0}
                            </div>
                          </div>
                          <div className="rounded-lg bg-slate-50 p-3">
                            <div className="text-xs text-slate-500">Barcode</div>
                            <div className="flex items-center gap-2">
                              <Barcode className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-medium">
                                {item.barcode || "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Locations */}
                      <div className="rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 px-4 py-3 border-b">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <h3 className="text-sm font-semibold text-slate-800">
                            Locations & Quantities
                          </h3>
                        </div>
                        <div className="p-3">
                          {item.locations?.length ? (
                            <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
                              <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">
                                      Location
                                    </th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">
                                      Qty
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                  {item.locations.map((loc, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/60">
                                      <td className="px-3 py-2 text-sm text-slate-800">
                                        {loc.location_name || `ID ${loc.location_id}`}
                                      </td>
                                      <td className="px-3 py-2 text-right text-sm font-medium text-slate-900">
                                        {loc.quantity}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 px-1">
                              No location data.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="rounded-xl border border-slate-200">
                        <div className="px-4 py-3 border-b">
                          <h3 className="text-sm font-semibold text-slate-800">
                            Description
                          </h3>
                        </div>
                        <p className="px-4 py-3 text-sm text-slate-700">
                          {item.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-3 space-y-6">
                      {/* Quick facts */}
                      <div className="rounded-xl border border-slate-200 p-4">
                        <h3 className="mb-2 text-sm font-semibold text-slate-800">
                          Quick Facts
                        </h3>
                        <dl className="divide-y divide-slate-200">
                          <InfoRow label="Category" value={item.category || "—"} icon={Tag} />
                          <InfoRow
                            label="Cost to Make"
                            value={
                              item.cost !== undefined && item.cost !== null
                                ? `$${Number(item.cost).toFixed(2)}`
                                : "—"
                            }
                            icon={DollarSign}
                          />
                          <InfoRow label="Barcode" value={item.barcode || "—"} icon={Barcode} />
                        </dl>
                      </div>

                      {/* Other Info */}
                      <div className="rounded-xl border border-slate-200 p-4">
                        <h3 className="mb-2 text-sm font-semibold text-slate-800">Other Info</h3>
                        <dl className="divide-y divide-slate-200">
                          <InfoRow label="Aisle #" value={item.bin_numbers || "N/A"} />
                          <InfoRow label="Supplier" value={item.supplier || "N/A"} />
                          <InfoRow label="Production Stage" value={item.production_stage || "N/A"} />
                          <InfoRow label="Lot #" value={item.lot_number || "N/A"} />
                          <InfoRow label="Notes" value={item.notes || "N/A"} />
                        </dl>
                      </div>

                      {/* Attachments */}
                      <div className="rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 px-4 py-3 border-b">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <h3 className="text-sm font-semibold text-slate-800">Attachments</h3>
                        </div>
                        <div className="p-4">
                          {item.file_url ? (
                            <a
                              href={joinUrl(SAFE_API_BASE, item.file_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                            >
                              <FileText className="h-4 w-4" />
                              View Document
                            </a>
                          ) : (
                            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                              No attachments
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          onClick={() => setShowScrap(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Scrap
                        </button>
                        <button
                          onClick={() => setShowTransfer(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                          Transfer
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Standalone modals outside the Dialog hierarchy */}
      {showTransfer && (
        <TransferItemModal
          item={item}
          allLocations={locationsList}
          onClose={() => setShowTransfer(false)}
          onSuccess={() => setShowTransfer(false)}
        />
      )}

      {showScrap && (
        <ScrapItemModal
          item={item}
          onClose={() => setShowScrap(false)}
          onSuccess={() => setShowScrap(false)}
        />
      )}
    </ErrorBoundary>
  );
};

export default ItemDetailsModal;
