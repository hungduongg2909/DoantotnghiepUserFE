// Manager.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Manager.module.scss";
import HoverPreview from "../../components/HoverPreview/HoverPreview";
import Pager from "../../components/Pager/Pager";
import { useReturnProds } from "../../hooks/useReturnProds";

const cx = classNames.bind(styles);

export default function Manager() {
   const navigate = useNavigate();
   const {
      data,
      loading,
      error,
      pagination,
      getReturnProdUnconfirm,
      editReturnProdUnconfirm,
      deleteReturnProd,
   } = useReturnProds();

   // Load first page
   useEffect(() => {
      getReturnProdUnconfirm(1, pagination.limit || 10);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Local UI messages
   const [message, setMessage] = useState("");
   const [localError, setLocalError] = useState("");

   // persistent selection across pages: { [returnId]: { returnId, qty } }
   const [selectedMap, setSelectedMap] = useState({});

   const rows = Array.isArray(data) ? data : [];
   const { page = 1, limit = 10, total = 0 } = pagination || {};

   const isSelected = useCallback((id) => !!selectedMap[id], [selectedMap]);

   const toggleSelect = useCallback((row) => {
      setSelectedMap((prev) => {
         const id = row._id;
         if (prev[id]) {
            const copy = { ...prev };
            delete copy[id];
            return copy;
         }
         const currentQty = prev[id]?.qty ?? row.qty ?? 1;
         return {
            ...prev,
            [id]: { returnId: id, qty: toIntSafe(currentQty) || 1 },
         };
      });
   }, []);

   const setQtyFor = useCallback((id, qty) => {
      setSelectedMap((prev) => {
         const base = prev[id] || { returnId: id };
         return { ...prev, [id]: { ...base, qty: toIntSafe(qty) } };
      });
   }, []);

   const removeFromSelection = useCallback((id) => {
      setSelectedMap((prev) => {
         const copy = { ...prev };
         delete copy[id];
         return copy;
      });
   }, []);

   const selectedList = useMemo(
      () => Object.values(selectedMap),
      [selectedMap]
   );
   const selectedCount = selectedList.length;
   const submitDisabled =
      selectedCount === 0 ||
      loading ||
      selectedList.some((x) => !isValidQty(x.qty));

   // Save edited qtys
   const handleSave = async () => {
      if (submitDisabled) return;
      setMessage("");
      setLocalError("");
      try {
         const payload = selectedList.map(({ returnId, qty }) => ({
            returnId,
            qty,
         }));
         const res = await editReturnProdUnconfirm(payload);
         if (res?.success) {
            setMessage("Update successful");
            setSelectedMap({});
            // hook already refreshed
         } else {
            setLocalError(res?.message || "Update failed");
         }
      } catch (e) {
         setLocalError(e?.message || "Something went wrong");
      }
   };

   // Delete single item
   const handleDelete = async (id) => {
      setMessage("");
      setLocalError("");
      try {
         const res = await deleteReturnProd(id);
         if (res?.success) {
            setMessage("Deleted successfully");
            removeFromSelection(id);
            // hook already refreshed
         } else {
            setLocalError(res?.message || "Delete failed");
         }
      } catch (e) {
         setLocalError(e?.message || "Delete failed");
      }
   };

   // Page change via Pager
   const handlePageChange = (nextPage, nextLimit) => {
      const newLimit = nextLimit ?? limit;
      const newPage = nextPage ?? page;
      getReturnProdUnconfirm(newPage, newLimit);
   };

   return (
      <div className={cx("wrap")}>
         <div className={cx("headerRow")}>
            <h2 className={cx("title")}>Return Manager</h2>
            <div className={cx("controls")}>
               <div className="text-sm">
                  Selected <b>{selectedCount}</b> item
                  {selectedCount !== 1 ? "s" : ""}
               </div>
               <button
                  className="px-4 py-2 border rounded disabled:opacity-40"
                  onClick={handleSave}
                  disabled={submitDisabled}
               >
                  {loading ? "Saving..." : "Save Changes"}
               </button>
            </div>
         </div>

         {(message || localError || error) && (
            <div className={cx("msgArea")}>
               {message && <div className={cx("msgSuccess")}>{message}</div>}
               {(localError || error) && (
                  <div className={cx("msgError")}>{localError || error}</div>
               )}
            </div>
         )}

         <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="border-b px-3 py-2 text-left">Product</th>
                     <th className="border-b px-3 py-2 text-left">Size</th>
                     <th className="border-b px-3 py-2 text-left">Image</th>
                     <th className="border-b px-3 py-2 text-left">
                        Updated At
                     </th>
                     <th className="border-b px-3 py-2 text-right">Qty</th>
                     <th className="border-b px-3 py-2 text-right">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {rows.length === 0 && (
                     <tr>
                        <td
                           colSpan={6}
                           className="px-3 py-6 text-center text-gray-500"
                        >
                           {loading ? "Loading..." : "No data"}
                        </td>
                     </tr>
                  )}
                  {rows.map((row) => {
                     const id = row._id;
                     const selected = isSelected(id);
                     const ext = getExt(row.image);
                     const type = ext === "pdf" ? "pdf" : "image";
                     const selectedQty = selectedMap[id]?.qty ?? row.qty ?? 1;
                     const qtyInvalid = !isValidQty(selectedQty);

                     return (
                        <tr
                           key={id}
                           className={
                              cx("tr", { selected }) +
                              ` hover:bg-gray-50 cursor-pointer${
                                 selected
                                    ? " bg-blue-200 ring-1 ring-blue-400"
                                    : ""
                              }`
                           }
                           onClick={(e) => {
                              const tag = e.target.tagName?.toLowerCase();
                              if (
                                 [
                                    "input",
                                    "a",
                                    "iframe",
                                    "img",
                                    "button",
                                 ].includes(tag)
                              )
                                 return;
                              toggleSelect(row);
                           }}
                        >
                           <td className="border-b px-3 py-2 align-top">
                              <div className="font-medium leading-5">
                                 {row.productName}
                              </div>
                           </td>
                           <td className="border-b px-3 py-2 align-top">
                              {row.sizeName || "—"}
                           </td>
                           <td className="border-b px-3 py-2 align-top">
                              {row.image && (
                                 <HoverPreview
                                    type={type}
                                    src={row.image}
                                    thumbSize={{ w: 30, h: 30 }}
                                    previewSize={{ w: 600, h: 200 }}
                                 />
                              )}
                           </td>
                           <td className="border-b px-3 py-2 align-top">
                              {formatDate(row.updatedAt)}
                           </td>
                           <td className="border-b px-3 py-2 align-top text-right">
                              <input
                                 type="number"
                                 inputMode="numeric"
                                 min={1}
                                 className={
                                    "w-24 border rounded px-2 py-1 text-right " +
                                    (qtyInvalid ? "border-red-500" : "")
                                 }
                                 value={selectedQty}
                                 onChange={(e) => {
                                    const v = e.target.value;
                                    if (!isSelected(id)) toggleSelect(row);
                                    setQtyFor(id, v);
                                 }}
                                 onClick={(e) => e.stopPropagation()}
                              />
                              {qtyInvalid && (
                                 <div className="text-[11px] text-red-600 mt-1">
                                    Qty must be an integer &gt; 0
                                 </div>
                              )}
                           </td>
                           <td className="border-b px-3 py-2 align-top text-right">
                              <button
                                 className="px-2 py-1 border rounded"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(id);
                                 }}
                              >
                                 Delete
                              </button>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>

         <div className={cx("footer")}>
            <Pager
               page={page}
               limit={limit}
               total={total}
               onChange={(nextPage, nextLimit) =>
                  handlePageChange(nextPage, nextLimit)
               }
            />
         </div>
      </div>
   );
}

// ------- utils -------
function getExt(p) {
   if (!p) return "";
   const i = p.lastIndexOf(".");
   return i >= 0 ? p.slice(i + 1).toLowerCase() : "";
}
function toIntSafe(v) {
   if (typeof v === "number") return Math.floor(v);
   if (typeof v === "string") {
      if (v.trim() === "") return NaN;
      const n = Number(v);
      return Number.isFinite(n) ? Math.floor(n) : NaN;
   }
   return NaN;
}
function isValidQty(v) {
   const n = toIntSafe(v);
   return Number.isInteger(n) && n > 0;
}
function formatDate(iso) {
   if (!iso) return "—";
   try {
      const d = new Date(iso);
      const pad = (x) => String(x).padStart(2, "0");
      const dd = pad(d.getDate());
      const mm = pad(d.getMonth() + 1);
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
   } catch {
      return iso;
   }
}
