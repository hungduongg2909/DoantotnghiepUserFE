// Return.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./Return.module.scss";
import HoverPreview from "../../components/HoverPreview/HoverPreview";
import { useReturnProds } from "../../hooks/useReturnProds";

const cx = classNames.bind(styles);

export default function Return({ pageSizeOptions = [5, 10, 50] }) {
   const { getProdAssignShortageByUserId, createReturnProd, loading, error } =
      useReturnProds();

   // server data + pagination
   const [rows, setRows] = useState([]);
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(pageSizeOptions?.[0] ?? 5);
   const [total, setTotal] = useState(0);
   const totalPages = Math.max(1, Math.ceil(total / limit));

   // selection + qty
   const [selectedMap, setSelectedMap] = useState({});

   // tên Product toggle open
   const [openNames, setOpenNames] = useState(() => new Set());

   // detect mobile (<=768px) để đổi behavior
   const [isMobile, setIsMobile] = useState(false);
   useEffect(() => {
      const mq = window.matchMedia("(max-width: 768px)");
      const update = () => setIsMobile(mq.matches);
      update();
      // add/remove listener (兼容 cũ)
      if (mq.addEventListener) mq.addEventListener("change", update);
      else mq.addListener(update);
      return () => {
         if (mq.removeEventListener) mq.removeEventListener("change", update);
         else mq.removeListener(update);
      };
   }, []);

   useEffect(() => {
      let alive = true;
      (async () => {
         try {
            const res = await getProdAssignShortageByUserId(page, limit);
            if (alive && res?.success) {
               setRows(res.data || []);
               setTotal(res.pagination?.total || 0);
            }
         } catch {}
      })();
      return () => {
         alive = false;
      };
   }, [page, limit, getProdAssignShortageByUserId]);

   const isSelected = useCallback(
      (assignId) => !!selectedMap[assignId],
      [selectedMap]
   );

   const toggleSelect = useCallback((row) => {
      setSelectedMap((prev) => {
         const exists = !!prev[row.assignId];
         if (exists) {
            const copy = { ...prev };
            delete copy[row.assignId];
            return copy;
         }
         const currentQty = prev[row.assignId]?.qty ?? row.qtyShortage ?? 1;
         return {
            ...prev,
            [row.assignId]: {
               assignId: row.assignId,
               qty: toIntSafe(currentQty) || 1,
            },
         };
      });
   }, []);

   const setQtyFor = useCallback((assignId, qty) => {
      setSelectedMap((prev) => {
         const nextQty = toIntSafe(qty);
         const base = prev[assignId] || { assignId };
         const next = { ...base, qty: nextQty };
         return { ...prev, [assignId]: next };
      });
   }, []);

   const toggleNameOpen = useCallback((assignId) => {
      setOpenNames((prev) => {
         const next = new Set(prev);
         if (next.has(assignId)) next.delete(assignId);
         else next.add(assignId);
         return next;
      });
   }, []);

   const selectedList = useMemo(
      () => Object.values(selectedMap),
      [selectedMap]
   );
   const selectedCount = selectedList.length;

   const submitDisabled =
      isMobile || // mobile không cho submit
      selectedCount === 0 ||
      loading ||
      selectedList.some((x) => !isValidQty(x.qty));

   const handleSubmit = async () => {
      if (submitDisabled) return;
      try {
         const payload = selectedList.map(({ assignId, qty, note }) => ({
            assignId,
            qty,
            ...(note ? { note } : {}),
         }));
         const res = await createReturnProd(payload);
         if (res?.success) {
            setSelectedMap({});
            alert("Saved return list successfully.");
            const fresh = await getProdAssignShortageByUserId(page, limit);
            if (fresh?.success) {
               setRows(fresh.data || []);
               setTotal(fresh.pagination?.total || 0);
            }
         } else {
            alert(res?.message || "Failed to save return list");
         }
      } catch (e) {
         alert(e?.message || "Error while saving");
      }
   };

   return (
      <div className={cx("wrap")}>
         <div className={cx("headerRow")}>
            <h2 className={cx("title")}>Return List</h2>

            <div className={cx("controls")}>
               <div className="flex items-center gap-3">
                  <div className="text-sm">
                     {!isMobile && (
                        <>
                           Selected <b>{selectedCount}</b> item
                           {selectedCount !== 1 ? "s" : ""}
                        </>
                     )}
                  </div>
                  {/* Ẩn nút Return trên mobile */}
                  <button
                     className={cx("btnReturn", { hiddenOnMobile: isMobile })}
                     onClick={handleSubmit}
                     disabled={submitDisabled}
                     title={isMobile ? "View only on mobile" : ""}
                  >
                     {loading ? "Saving..." : "Return"}
                  </button>
               </div>
            </div>
         </div>

         {error && <div className={cx("errorBox")}>{error}</div>}

         <div className={cx("tableWrap")}>
            <table
               className={
                  "w-full table-fixed border border-gray-200 text-sm " +
                  "[&_th]:py-1.5 [&_td]:py-1.5 [&_th]:leading-[18px] [&_td]:leading-[18px]"
               }
            >
               <thead className="bg-gray-50">
                  <tr className="[&_*]:uppercase">
                     <th
                        className={
                           cx("colProduct", "thLeft") + " border-b px-3"
                        }
                     >
                        Product
                     </th>
                     <th className={cx("colSize", "thLeft") + " border-b px-3"}>
                        Size
                     </th>
                     <th className={cx("colImg", "thLeft") + " border-b px-3"}>
                        Image
                     </th>
                     <th
                        className={cx("colAssign", "thLeft") + " border-b px-3"}
                     >
                        Assign At
                     </th>
                     <th className="border-b px-3 text-right hidden md:table-cell">
                        Qty Assigned
                     </th>
                     <th className="border-b px-3 text-right hidden md:table-cell">
                        Qty Returned
                     </th>
                     <th
                        className={cx("colShort", "thRight") + " border-b px-3"}
                     >
                        Qty Shortage
                     </th>
                  </tr>
               </thead>

               <tbody>
                  {rows.length === 0 && (
                     <tr>
                        <td
                           colSpan={7}
                           className="px-3 py-6 text-center text-gray-500"
                        >
                           {loading ? "Loading..." : "No data"}
                        </td>
                     </tr>
                  )}

                  {rows.map((row) => {
                     const selected = !isMobile && isSelected(row.assignId);
                     const ext = getExt(row.image);
                     const type = ext === "pdf" ? "pdf" : "image";
                     const selectedQty =
                        selectedMap[row.assignId]?.qty ?? row.qtyShortage ?? 1;
                     const qtyInvalid = !isValidQty(selectedQty);
                     const nameOpen = openNames.has(row.assignId);

                     const rowClass =
                        cx("tr", { selected }) +
                        ` hover:bg-gray-50 cursor-${
                           isMobile ? "default" : "pointer"
                        }${
                           selected ? " bg-blue-200 ring-1 ring-blue-400" : ""
                        }`;

                     return (
                        <tr
                           key={row.assignId}
                           className={rowClass}
                           onClick={
                              isMobile
                                 ? undefined
                                 : (e) => {
                                      const tag =
                                         e.target.tagName?.toLowerCase();
                                      if (
                                         tag === "input" ||
                                         tag === "a" ||
                                         tag === "iframe" ||
                                         tag === "img"
                                      )
                                         return;
                                      toggleSelect(row);
                                   }
                           }
                        >
                           {/* Product: 1 dòng + ellipsis; click để mở/thu */}
                           <td
                              className={
                                 cx("colProduct", "tdLeft") +
                                 " border-b px-3 align-top"
                              }
                           >
                              <button
                                 type="button"
                                 className={cx("nameBtn")}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNameOpen(row.assignId);
                                 }}
                                 title={nameOpen ? "Collapse" : row.productName}
                              >
                                 <span
                                    className={cx("nameText", {
                                       open: nameOpen,
                                    })}
                                 >
                                    {row.productName}
                                 </span>
                              </button>
                           </td>

                           <td
                              className={
                                 cx("colSize", "tdLeft") +
                                 " border-b px-3 align-top"
                              }
                           >
                              {row.sizeName || "—"}
                           </td>
                           <td
                              className={
                                 cx("colImg", "tdLeft") +
                                 " border-b px-3 align-top"
                              }
                           >
                              {row.image && (
                                 <HoverPreview
                                    type={type}
                                    src={row.image}
                                    thumbSize={{ w: 25, h: 25 }}
                                    previewSize={{ w: 600, h: 200 }}
                                 />
                              )}
                           </td>

                           <td
                              className={
                                 cx("colAssign", "tdLeft") +
                                 " border-b px-3 align-top"
                              }
                           >
                              {isMobile
                                 ? formatDateShort(row.updatedAt)
                                 : formatDate(row.updatedAt)}
                           </td>

                           {/* Hidden on mobile */}
                           <td className="border-b px-3 align-top text-right hidden md:table-cell">
                              {row.qty}
                           </td>
                           <td className="border-b px-3 align-top text-right hidden md:table-cell">
                              {row.qtyReturnTotal}
                           </td>

                           {/* Qty Shortage: desktop editable, mobile read-only */}
                           <td
                              className={
                                 cx("colShort", "tdRight") +
                                 " border-b px-3 align-top text-right"
                              }
                           >
                              {isMobile ? (
                                 <span>{row.qtyShortage}</span>
                              ) : (
                                 <div className="flex items-center justify-end gap-2">
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
                                          if (!isSelected(row.assignId))
                                             toggleSelect(row);
                                          setQtyFor(row.assignId, v);
                                       }}
                                       onClick={(e) => e.stopPropagation()}
                                    />
                                 </div>
                              )}
                              {!isMobile && qtyInvalid && (
                                 <div className="text-[11px] text-red-600 mt-1">
                                    Qty must be an integer &gt; 0
                                 </div>
                              )}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>

         {/* Pagination*/}
         <div className={cx("footer")}>
            <div className="flex items-center gap-2">
               <label className="text-sm">Page size</label>
               <select
                  value={limit}
                  onChange={(e) => {
                     setPage(1);
                     setLimit(parseInt(e.target.value, 10));
                  }}
                  className="border rounded px-2 py-1"
               >
                  {pageSizeOptions.map((opt) => (
                     <option key={opt} value={opt}>
                        {opt}
                     </option>
                  ))}
               </select>
               <button
                  className="border rounded px-2 py-1 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
               >
                  Prev
               </button>
               <span className="text-sm">
                  Page {page} / {totalPages}
               </span>
               <button
                  className="border rounded px-2 py-1 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
               >
                  Next
               </button>
            </div>
         </div>
      </div>
   );
}

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

function formatDateShort(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const pad = (x) => String(x).padStart(2, "0");
    const dd = pad(d.getDate());
    const mm = pad(d.getMonth() + 1);
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  } catch {
    return "—";
  }
}
