import React from "react";
import classNames from "classnames/bind";
import styles from "./AuthLayoutCpn.module.scss";
import logoImg from "../../assets/images/logo.png"; // chỉnh lại path nếu khác

const cx = classNames.bind(styles);

export default function AuthLayoutCpn({
   children,
   brand = "Admin",
   headline = "Welcome back 👋",
   tagline = (
      <>
         A fast, lightweight dashboard to manage <strong>products</strong>,
         <strong> orders</strong>, <strong>assignments</strong> &{" "}
         <strong>returns</strong>.
         <br />
         The website helps you manage your goods and processes in an intuitive way.
      </>
   ),
   benefits = [
      "Track POs & sizes in real time",
      "Assign work in one click",
      "Faster deliveries & returns",
   ],
   footer = `© ${new Date().getFullYear()} Dann — All rights reserved`,
}) {
   return (
      <div className={cx("frame")}>
         {/* Header */}
         <header className={cx("header")}>
            <div className={cx("brand")}>
               <img
                  src={logoImg}
                  alt={`${brand} logo`}
                  className={cx("logoImg")}
               />
               <span className={cx("brandName")}>{brand}</span>
            </div>

            {/* Ẩn trên mobile/iPad, hiện ở desktop */}
            <h2 className={cx("headline")}>{headline}</h2>
            <p className={cx("tagline")}>{tagline}</p>
            <ul className={cx("benefits")}>
               {benefits.map((b, i) => (
                  <li key={i}>
                     <span className={cx("tick")} aria-hidden>
                        ✓
                     </span>
                     {b}
                  </li>
               ))}
            </ul>
         </header>

         {/* Children area luôn giữa, bạn điều chỉnh kích thước/đặt form vào .childWrap */}
         <main className={cx("main")}>
            <div className={cx("childWrap")}>{children}</div>
         </main>

         {/* Footer — luôn cuối màn hình; ở mobile/iPad đè lên khu vực children */}
         <footer className={cx("footer")}>{footer}</footer>
      </div>
   );
}
