import React, { useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./HoverPreview.module.scss";

const cx = classNames.bind(styles);

export default function HoverPreview({
   type = "image",
   src,
   thumbSize = { w: 40, h: 40 },
   previewSize = { w: 600, h: 900 },
   className,
}) {
   const realSrc = `${import.meta.env.VITE_BASE_URL_BE}${src}`;

   const wrapRef = useRef(null);
   const timer = useRef(null);
   const [open, setOpen] = useState(false);
   const [pos, setPos] = useState({ top: 0, left: 0 });

   const placePopover = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Đặt popover sang phải ô hiện tại, căn giữa theo chiều dọc
      const padding = 8;
      const desiredLeft = rect.left - padding - (previewSize?.w ?? 560);
      let left = Math.round(desiredLeft);
      const top = Math.round(rect.top + rect.height / 2);

      // nếu bên trái không đủ chỗ, fallback sang phải
      if (left < 8) {
         left = Math.round(rect.right + padding);
      }

      // chặn chạm mép màn hình phải (nếu fallback)
      const maxLeft =
         (window.innerWidth || document.documentElement.clientWidth) - 8;
      if (left > maxLeft) left = maxLeft;

      setPos({ top, left });
   };

   const show = () => {
      clearTimeout(timer.current);
      placePopover();
      setOpen(true);
   };

   const hide = () => {
      timer.current = setTimeout(() => setOpen(false), 120);
   };

   if (!src) return null;

   const previewContent =
      type === "pdf" ? (
         <iframe
            title="pdf-preview"
            src={`${realSrc}#view=FitH&pagemode=none&toolbar=0&navpanes=0`}
            width={previewSize.w}
            height={previewSize.h}
            className={cx("previewFrame")}
         />
      ) : (
         <img
            src={realSrc}
            alt=""
            width={previewSize.w}
            height={previewSize.h}
            className={cx("previewImage")}
         />
      );

   const thumb =
      type === "pdf" ? (
         <div
            className={cx("pdfThumb")}
            style={{ width: thumbSize.w, height: thumbSize.h }}
            aria-label="PDF"
         >
            PDF
         </div>
      ) : (
         <img
            src={realSrc}
            alt=""
            width={thumbSize.w}
            height={thumbSize.h}
            className={cx("thumbImage")}
         />
      );

   return (
      <>
         <span
            ref={wrapRef}
            className={cx("hoverWrap", className)}
            onMouseEnter={show}
            onMouseLeave={hide}
         >
            <a
               href={realSrc}
               target="_blank"
               rel="noreferrer noopener"
               className={cx("thumbLink")}
               onMouseEnter={show}
            >
               {thumb}
            </a>
         </span>

         {open && (
            <div
               className={cx("popoverFixed")}
               style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
               onMouseEnter={show}
               onMouseLeave={hide}
            >
               {previewContent}
            </div>
         )}
      </>
   );
}
