import React from "react";
import classNames from "classnames/bind";
import styles from "./Footer.module.scss";

const cx = classNames.bind(styles);

export default function Footer() {
   return (
      <footer className={cx("footer")}>
         <div className={cx("container")}>
            {/* Left */}
            <div className={cx("col", "left")}>
               <div className={cx("brand")}>© 2025 Dann</div>
               <div className={cx("sub")}>All rights reserved.</div>
            </div>

            {/* Middle */}
            <div className={cx("col", "middle")}>
               <a href="#" className={cx("link")}>
                  About
               </a>
               <a href="#" className={cx("link")}>
                  Contact
               </a>
               <a href="#" className={cx("link")}>
                  Terms
               </a>
            </div>

            {/* Right */}
            <div className={cx("col", "right")}>
               <a
                  href="https://www.facebook.com/dannn0212"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx("iconLink")}
                  title="Facebook"
               >
                  🌐
               </a>
               <a
                  href="https://github.com/hungduongg2909"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx("iconLink")}
                  title="GitHub"
               >
                  💻
               </a>
            </div>
         </div>
      </footer>
   );
}
