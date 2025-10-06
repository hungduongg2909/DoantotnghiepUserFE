import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import LogoutButton from "../LogoutButton/LogoutButton";
import logoImg from "../../assets/images/logo.png";

const cx = classNames.bind(styles);

const Header = () => {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();

   // Lấy user từ localStorage
   useEffect(() => {
      try {
         const storedUser = localStorage.getItem("username");
         if (storedUser) setUser(storedUser);
         else {
            setUser(null);
            navigate("/login");
         }
      } catch {
         setUser(null);
         navigate("/login");
      }
   }, [navigate]);

   // Navigation items
   const navItems = [
      // { name: "Home", path: "/", end: true },
      { name: "Return", path: "/return" },
      { name: "Manager", path: "/manager" },
      { name: "Preview", path: "/preview" },
      // { name: "Product", path: "/product" },
      // { name: "Assignment", path: "/assignment" },
      // { name: "Delivery", path: "/delivery" },
   ];

   return (
      <header className={cx("header")}>
         <div className={cx("container")}>
            <div className={cx("header-content")}>
               {/* Mobile logo (ẩn trên PC) */}
               <Link to="/return" className={cx("logoMobile")}>
                  <img src={logoImg} alt="Logo" />
               </Link>
               {/* Navigation */}
               <nav className={cx("nav")}>
                  {navItems.map((item) => (
                     <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                           cx("nav-link", { active: isActive })
                        }
                     >
                        {item.name}
                     </NavLink>
                  ))}
               </nav>

               {/* Navigation (Mobile chỉ Return + Preview) */}
               <nav className={cx("navMobile")}>
                  <NavLink
                     to="/return"
                     className={({ isActive }) =>
                        cx("nav-link", "navm", { active: isActive })
                     }
                  >
                     Return
                  </NavLink>
                  <NavLink
                     to="/preview"
                     className={({ isActive }) =>
                        cx("nav-link", "navm", { active: isActive })
                     }
                  >
                     Preview
                  </NavLink>
               </nav>

               {/* Auth Section */}
               <div className={cx("auth-section")}>
                  {user ? (
                     <>
                        <div className={cx("userDropdown")}>
                           <div className={cx("user-info")}>
                              <span className={cx("user-icon")}>👤</span>
                              <span className={cx("username")}>{user}</span>
                           </div>

                           <div className={cx("menu")}>
                              <div
                                 className={cx("menuItem")}
                                 onClick={() => {
                                    window.location.href = "/change-password";
                                 }}
                              >
                                 Change Password
                              </div>
                              
                              <LogoutButton
                                 className={cx("btn", "btn-logout")}
                                 onSuccess={() => setUser(null)}
                                 onError={(msg) => console.warn(msg)}
                              >
                                 <span className={cx("btn-icon")}>🚪</span>
                                 Logout
                              </LogoutButton>
                           </div>
                        </div>
                     </>
                  ) : (
                     <>
                        <Link to="/login" className={cx("btn", "btn-login")}>
                           Login
                        </Link>
                        <Link
                           to="/register"
                           className={cx("btn", "btn-register")}
                        >
                           Register
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
