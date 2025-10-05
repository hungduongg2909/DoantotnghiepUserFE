import React from "react";
import classNames from "classnames/bind";
import styles from "./Pager.module.scss";

const cx = classNames.bind(styles);

/**
 * Reusable pager
 * @param {number} page                - current page (1-based)
 * @param {number} totalPages          - total pages (>=1)
 * @param {number} rowsPerPage         - current page size
 * @param {number[]} rowsPerPageOptions- options for page size
 * @param {function} onPageChange      - (newPage:number) => void
 * @param {function} onRowsPerPageChange - (newSize:number) => void
 * @param {boolean} disabled           - disable all controls
 * @param {React.ReactNode} prefix     - optional left-side content
 */
export default function Pager({
   page = 1,
   totalPages = 1,
   rowsPerPage = 10,
   rowsPerPageOptions = [5, 10, 20],
   onPageChange,
   onRowsPerPageChange,
   disabled = false,
   prefix = null,
}) {
   const prevDisabled = disabled || page <= 1;
   const nextDisabled = disabled || page >= totalPages;

   const handleRowsChange = (e) => {
      const val = Number(e.target.value);
      onRowsPerPageChange?.(val);
   };

   return (
      <div className={cx("pager")}>
         {prefix ? <div className={cx("prefix")}>{prefix}</div> : null}

         <div className={cx("rowsCtl")}>
            Rows/page:
            <select
               className={cx("rowsSelect")}
               value={rowsPerPage}
               onChange={handleRowsChange}
               disabled={disabled}
               aria-label="Rows per page"
            >
               {rowsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                     {opt}
                  </option>
               ))}
            </select>
         </div>

         <button
            type="button"
            className={cx("pgBtn")}
            disabled={prevDisabled}
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            aria-label="Previous page"
            title={prevDisabled ? "No previous page" : "Previous"}
         >
            Prev
         </button>

         <div className={cx("pgInfo")}>
            Page {page} / {Math.max(1, totalPages)}
         </div>

         <button
            type="button"
            className={cx("pgBtn")}
            disabled={nextDisabled}
            onClick={() =>
               onPageChange?.(Math.min(Math.max(1, totalPages), page + 1))
            }
            aria-label="Next page"
            title={nextDisabled ? "No next page" : "Next"}
         >
            Next
         </button>
      </div>
   );
}
