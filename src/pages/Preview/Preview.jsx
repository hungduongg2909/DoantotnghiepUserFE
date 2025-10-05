// // Preview.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import classNames from "classnames/bind";
// import styles from "./Preview.module.scss";
// import { usePayments } from "../../hooks/usePayments";
// import Pager from "../../components/Pager/Pager";

// const cx = classNames.bind(styles);

// export default function Preview() {
//    const { getPreviewPayment, loading, error, data, pagination } =
//       usePayments();

//    const [message, setMessage] = useState("");

//    // local snapshot state from response
//    const [preview, setPreview] = useState([]);
//    const [grandTotal, setGrandTotal] = useState(0);

//    const [page, setPage] = useState(1);
//    const [rowsPerPage, setRowsPerPage] = useState(10);

//    const fetchPreview = async (p, limit) => {
//       setMessage("");
//       const res = await getPreviewPayment({ page: p, limit });
//       if (res?.success) {
//          setPreview(res.preview || []);
//          setGrandTotal(res.grandTotal || 0);
//       }
//    };

//    // fetch when page/size or user changes
//    useEffect(() => {
//       fetchPreview(page, rowsPerPage);
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//    }, [page, rowsPerPage]);

//    const rows = Array.isArray(data) ? data : [];
//    const totalPages = useMemo(() => {
//       const total = pagination?.total ?? 0;
//       return Math.max(1, Math.ceil(total / rowsPerPage));
//    }, [pagination, rowsPerPage]);

//    const formatDate = (iso) => {
//       if (!iso) return "";
//       const d = new Date(iso);
//       return d.toLocaleDateString("vi-VN", {
//          day: "2-digit",
//          month: "2-digit",
//          year: "numeric",
//       });
//    };

//    const formatCurrency = (v) =>
//       new Intl.NumberFormat("vi-VN", {
//          style: "currency",
//          currency: "VND",
//       }).format(Number(v || 0));

//    return (
//       <div className={cx("wrapper")}>
//          <div className={cx("headerRow")}>
//             <h1 className={cx("title")}>Payment Preview</h1>
//          </div>

//          {error && <div className={cx("error")}>{error}</div>}
//          {message && <div className={cx("message")}>{message}</div>}

//          {/* Snapshot */}
//          {true && (
//             <div className={cx("card")}>
//                <div className={cx("cardHeader")}>
//                   <div className={cx("cardTitle")}>Snapshot</div>
//                   <div className={cx("grandTotal")}>
//                      Tổng: <strong>{formatCurrency(grandTotal)}</strong>
//                   </div>
//                </div>

//                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
//                   <table className="min-w-full divide-y divide-gray-200">
//                      <thead className="bg-gray-100">
//                         <tr>
//                            <th className="pl-6 pr-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Category
//                            </th>
//                            <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Size
//                            </th>
//                            <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Qty
//                            </th>
//                            <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Unit price
//                            </th>
//                            <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Total
//                            </th>
//                         </tr>
//                      </thead>
//                      <tbody className="divide-y divide-gray-200">
//                         {preview.length === 0 ? (
//                            <tr>
//                               <td
//                                  colSpan={5}
//                                  className="px-4 py-6 text-center text-gray-500"
//                               >
//                                  No snapshot data
//                               </td>
//                            </tr>
//                         ) : (
//                            preview.map((p, idx) => (
//                               <tr
//                                  key={idx}
//                                  className="bg-white hover:bg-gray-50"
//                               >
//                                  <td className="pl-6 pr-4 py-3 text-sm text-gray-800">
//                                     {p.category}
//                                  </td>
//                                  <td className="px-4 py-3 text-sm text-gray-800">
//                                     {p.size || "-"}
//                                  </td>
//                                  <td className="px-4 py-3 text-sm text-right text-gray-800">
//                                     {p.qty}
//                                  </td>
//                                  <td className="px-4 py-3 text-sm text-right text-gray-800">
//                                     {formatCurrency(p.unitPrice)}
//                                  </td>
//                                  <td className="px-4 py-3 text-sm text-right text-gray-800">
//                                     {formatCurrency(p.total)}
//                                  </td>
//                               </tr>
//                            ))
//                         )}
//                      </tbody>
//                   </table>
//                </div>
//             </div>
//          )}

//          {/* Products list */}
//          {true && (
//             <>
//                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
//                   <table className="min-w-full divide-y divide-gray-200">
//                      <thead className="bg-gray-100">
//                         <tr>
//                            <th className="pl-6 pr-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Product
//                            </th>
//                            <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Size
//                            </th>
//                            <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Qty
//                            </th>
//                            <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-gray-700">
//                               Updated at
//                            </th>
//                         </tr>
//                      </thead>
//                      <tbody className="divide-y divide-gray-200">
//                         {loading ? (
//                            <tr>
//                               <td
//                                  colSpan={4}
//                                  className="px-4 py-6 text-center text-gray-500"
//                               >
//                                  Loading data...
//                               </td>
//                            </tr>
//                         ) : rows.length === 0 ? (
//                            <tr>
//                               <td
//                                  colSpan={4}
//                                  className="px-4 py-6 text-center text-gray-500"
//                               >
//                                  No data available.
//                               </td>
//                            </tr>
//                         ) : (
//                            rows.map((r) => (
//                               <tr
//                                  key={r.id}
//                                  className="bg-white hover:bg-gray-50"
//                               >
//                                  <td className="pl-6 pr-4 py-3 text-sm text-gray-800">
//                                     {r.productName}
//                                  </td>
//                                  <td className="px-4 py-3 text-sm text-gray-800">
//                                     {r.sizeName || "-"}
//                                  </td>
//                                  <td className="px-4 py-3 text-sm text-right text-gray-800">
//                                     {r.qty}
//                                  </td>
//                                  <td className="px-4 py-3 text-sm text-center text-gray-800">
//                                     {formatDate(r.updatedAt)}
//                                  </td>
//                               </tr>
//                            ))
//                         )}
//                      </tbody>
//                   </table>
//                </div>

//                <Pager
//                   page={pagination?.page || page}
//                   totalPages={totalPages}
//                   rowsPerPage={rowsPerPage}
//                   rowsPerPageOptions={[5, 10, 20]}
//                   disabled={loading}
//                   onPageChange={(newPage) => setPage(newPage)}
//                   onRowsPerPageChange={(newSize) => {
//                      setRowsPerPage(newSize);
//                      setPage(1);
//                   }}
//                />
//             </>
//          )}
//       </div>
//    );
// }

import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Preview.module.scss";
import { usePayments } from "../../hooks/usePayments";
import Pager from "../../components/Pager/Pager";

const cx = classNames.bind(styles);

// ===== Helpers cho snapshot mới =====
const normalize = (s = "") =>
   s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

const isBasicDifficulty = (name) => normalize(name) === "co ban";

/** Từ preview raw -> products (đã có total) + grandTotal */
const buildProductsFromPreview = (previewRaw = []) => {
   const products = previewRaw.map((cat) => {
      const qty = Number(cat?.qty || 0);
      const basePrice = Number(cat?.basePrice || 0);
      const baseTotal = qty * basePrice;

      const size = (cat?.size || []).map((s) => ({
         name: s?.name || "",
         qty: Number(s?.qty || 0),
         total: Number(s?.qty || 0) * Number(s?.bonusAmount || 0),
      }));

      const difficult = (cat?.difficult || [])
         .filter((d) => !isBasicDifficulty(d?.name || "")) // bỏ “Cơ bản”
         .map((d) => ({
            name: d?.name || "",
            qty: Number(d?.qty || 0),
            total: Number(d?.qty || 0) * Number(d?.bonusAmount || 0),
         }));

      const addOnTotal =
         size.reduce((sum, it) => sum + it.total, 0) +
         difficult.reduce((sum, it) => sum + it.total, 0);

      return {
         category: cat?.category || "",
         qty,
         total: baseTotal + addOnTotal,
         size,
         difficult,
      };
   });

   const grandTotal = products.reduce((sum, p) => sum + p.total, 0);
   return { products, grandTotal };
};
// ====================================

export default function Preview() {
   const { getPreviewPayment, loading, error, data, pagination } =
      usePayments();

   const [message, setMessage] = useState("");

   // local snapshot state từ response (raw để render)
   const [preview, setPreview] = useState([]);
   const [grandTotal, setGrandTotal] = useState(0);

   const [page, setPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const fetchPreview = async (p, limit) => {
      setMessage("");
      const res = await getPreviewPayment({ page: p, limit });
      if (res?.success) {
         const raw = Array.isArray(res.preview) ? res.preview : [];
         setPreview(raw);

         // Tính grandTotal theo format mới
         const { grandTotal } = buildProductsFromPreview(raw);
         setGrandTotal(grandTotal);
      }
   };

   useEffect(() => {
      fetchPreview(page, rowsPerPage);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [page, rowsPerPage]);

   const rows = Array.isArray(data) ? data : [];
   const totalPages = useMemo(() => {
      const total = pagination?.total ?? 0;
      return Math.max(1, Math.ceil(total / rowsPerPage));
   }, [pagination, rowsPerPage]);

   const formatDate = (iso) => {
      if (!iso) return "";
      const d = new Date(iso);
      return d.toLocaleDateString("vi-VN", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      });
   };

   const formatCurrency = (v) =>
      new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(Number(v || 0));

   return (
      <div className={cx("wrapper")}>
         <div className={cx("headerRow")}>
            <h1 className={cx("title")}>Payment Preview</h1>
         </div>

         {error && <div className={cx("error")}>{error}</div>}
         {message && <div className={cx("message")}>{message}</div>}

         {/* Snapshot */}
         <div className={cx("card")}>
            <div className={cx("cardHeader")}>
               <div className={cx("cardTitle")}>Snapshot</div>
               <div className={cx("grandTotal")}>
                  Tổng: <strong>{formatCurrency(grandTotal)}</strong>
               </div>
            </div>

            {/* render từng Category */}
            {(() => {
               const { products } = buildProductsFromPreview(preview);

               if (!products.length) {
                  return (
                     <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-100">
                              <tr>
                                 <th className="pl-6 pr-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Value
                                 </th>
                                 <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Qty
                                 </th>
                                 <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Unit Price
                                 </th>
                                 <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Total Amount
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-200">
                              <tr>
                                 <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-gray-500"
                                 >
                                    No snapshot data
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  );
               }

               return products.map((cat, idx) => {
                  // cần unit price để hiển thị — lấy lại từ raw tại cùng index
                  const raw = preview[idx] || {};
                  const basePrice = Number(raw?.basePrice || 0);

                  const baseRow = {
                     label: "Total",
                     qty: cat.qty,
                     unitPrice: basePrice,
                     amount: cat.qty * basePrice,
                  };

                  const sizeRows = (cat.size || []).map((s) => ({
                     label: `Size ${s.name}`,
                     qty: s.qty,
                     unitPrice:
                        (raw?.size || []).find((x) => x?.name === s.name)
                           ?.bonusAmount || 0,
                     amount: s.total,
                  }));

                  const diffRows = (cat.difficult || []).map((d) => ({
                     label: d.name,
                     qty: d.qty,
                     unitPrice:
                        (raw?.difficult || []).find((x) => x?.name === d.name)
                           ?.bonusAmount || 0,
                     amount: d.total,
                  }));

                  const categorySum =
                     baseRow.amount +
                     sizeRows.reduce((a, r) => a + r.amount, 0) +
                     diffRows.reduce((a, r) => a + r.amount, 0);

                  return (
                     <div
                        key={`${cat.category}-${idx}`}
                        className="overflow-x-auto rounded-xl border border-gray-200 bg-white mb-4"
                     >
                        <div className="px-4 pt-3 pb-1 text-sm text-gray-700 font-semibold">
                           {cat.category}{" "}
                           <span className="text-gray-500">(VND)</span>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-100">
                              <tr>
                                 <th className="pl-6 pr-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Value
                                 </th>
                                 <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Qty
                                 </th>
                                 <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Unit Price
                                 </th>
                                 <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Total Amount
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-200">
                              {/* Base row */}
                              <tr className="bg-white">
                                 <td className="pl-6 pr-4 py-3 text-sm text-gray-800">
                                    {baseRow.label}
                                 </td>
                                 <td className="px-4 py-3 text-sm text-right text-gray-800">
                                    {baseRow.qty}
                                 </td>
                                 <td className="px-4 py-3 text-sm text-right text-gray-800">
                                    {formatCurrency(baseRow.unitPrice)}
                                 </td>
                                 <td className="px-4 py-3 text-sm text-right text-gray-800">
                                    {formatCurrency(baseRow.amount)}
                                 </td>
                              </tr>

                              {/* Size rows */}
                              {sizeRows.map((r, i) => (
                                 <tr key={`size-${i}`} className="bg-white">
                                    <td className="pl-6 pr-4 py-3 text-sm text-gray-800">
                                       {r.label}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-800">
                                       {r.qty}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-800">
                                       {formatCurrency(r.unitPrice)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-800">
                                       {formatCurrency(r.amount)}
                                    </td>
                                 </tr>
                              ))}

                              {/* Difficulty rows (đã loại “Cơ bản”) */}
                              {diffRows.map((r, i) => (
                                 <tr key={`diff-${i}`} className="bg-white">
                                    <td className="pl-6 pr-4 py-3 text-sm text-gray-800">
                                       {r.label}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-800">
                                       {r.qty}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-800">
                                       {formatCurrency(r.unitPrice)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-800">
                                       {formatCurrency(r.amount)}
                                    </td>
                                 </tr>
                              ))}

                              {/* Category total */}
                              <tr className="bg-gray-50">
                                 <td
                                    className="pl-6 pr-4 py-3 text-sm font-semibold text-gray-900 text-right"
                                    colSpan={3}
                                 >
                                    Tổng cộng
                                 </td>
                                 <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                                    {formatCurrency(categorySum)}
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  );
               });
            })()}
         </div>

         {/* Products list */}
         <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-100">
                  <tr>
                     <th className="pl-6 pr-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-700">
                        Product
                     </th>
                     <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-700">
                        Size
                     </th>
                     <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide text-gray-700">
                        Qty
                     </th>
                     <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-gray-700">
                        Updated at
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {loading ? (
                     <tr>
                        <td
                           colSpan={4}
                           className="px-4 py-6 text-center text-gray-500"
                        >
                           Loading data...
                        </td>
                     </tr>
                  ) : rows.length === 0 ? (
                     <tr>
                        <td
                           colSpan={4}
                           className="px-4 py-6 text-center text-gray-500"
                        >
                           No data available.
                        </td>
                     </tr>
                  ) : (
                     rows.map((r) => (
                        <tr key={r.id} className="bg-white hover:bg-gray-50">
                           <td className="pl-6 pr-4 py-3 text-sm text-gray-800">
                              {r.productName}
                           </td>
                           <td className="px-4 py-3 text-sm text-gray-800">
                              {r.sizeName || "-"}
                           </td>
                           <td className="px-4 py-3 text-sm text-right text-gray-800">
                              {r.qty}
                           </td>
                           <td className="px-4 py-3 text-sm text-center text-gray-800">
                              {formatDate(r.updatedAt)}
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>

         <Pager
            page={pagination?.page || page}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            disabled={loading}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newSize) => {
               setRowsPerPage(newSize);
               setPage(1);
            }}
         />
      </div>
   );
}
