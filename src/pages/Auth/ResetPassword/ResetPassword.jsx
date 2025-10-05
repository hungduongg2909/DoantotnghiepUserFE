import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ResetPassword.module.scss";
import { httpAuth } from "../../../services/httpAuth";

const cx = classNames.bind(styles);

const reNoSpaceMin6 = /^\S{6,}$/; // >=6 ký tự, không khoảng trắng

export default function ResetPassword() {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();

   const [token, setToken] = useState("");
   const [password, setPassword] = useState("");
   const [repassword, setRepassword] = useState("");

   const [errors, setErrors] = useState({
      password: "",
      repassword: "",
      token: "",
   });
   const [serverMsg, setServerMsg] = useState("");
   const [successMsg, setSuccessMsg] = useState("");
   const [submitting, setSubmitting] = useState(false);

   // lấy token từ query ?token=...
   useEffect(() => {
      const t = searchParams.get("token") || "";
      setToken(t);
      setErrors((e) => ({
         ...e,
         token: t ? "" : "Token is invalid or missing",
      }));
   }, [searchParams]);

   const validate = () => {
      const e = { password: "", repassword: "", token: "" };

      if (!token) e.token = "Token is invalid or missing";
      if (!password) e.password = "Password cannot be blank";
      else if (!reNoSpaceMin6.test(password))
         e.password = "Password must be ≥ 6 characters and no spaces";

      if (!repassword) e.repassword = "Please re-enter password";
      else if (password !== repassword)
         e.repassword = "The two passwords do not match";

      setErrors(e);
      return !e.password && !e.repassword && !e.token;
   };

   const onSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;

      setServerMsg("");
      setSuccessMsg("");

      if (!validate()) return;

      try {
         setSubmitting(true);
         const res = await httpAuth.post("/auth/reset-password", {
            token,
            password,
         });
         const be = res?.data;

         if (be?.success) {
            setSuccessMsg(
               "Password has been reset successfully. Redirecting to login page..."
            );
            setTimeout(() => navigate("/login", { replace: true }), 1200);
         } else {
            const msg =
               be?.message ||
               (Array.isArray(be?.errors) && be.errors.length
                  ? be.errors[0]
                  : "Password reset failed");
            setServerMsg(msg);
         }
      } catch (err) {
         const be = err?.response?.data;
         const msg =
            (Array.isArray(be?.errors) && be.errors[0]) ||
            be?.message ||
            err?.message ||
            "Unable to connect to server";
         setServerMsg(msg);
      } finally {
         setSubmitting(false);
      }
   };

   return (
      // <div className={cx("wrap")}>
         <form className={cx("card")} onSubmit={onSubmit} noValidate>
            <h1 className={cx("title")}>Reset password</h1>

            {errors.token && (
               <div className={cx("alertError")}>{errors.token}</div>
            )}
            {serverMsg && <div className={cx("alertError")}>{serverMsg}</div>}
            {successMsg && (
               <div className={cx("alertSuccess")}>{successMsg}</div>
            )}

            <div className={cx("field")}>
               <label>New password</label>
               <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                     setPassword(e.target.value);
                     setErrors((x) => ({ ...x, password: "" }));
                     setServerMsg("");
                  }}
                  onBlur={validate}
                  placeholder="••••••"
                  disabled={submitting}
               />
               {errors.password && (
                  <div className={cx("err")}>{errors.password}</div>
               )}
            </div>

            <div className={cx("field")}>
               <label>Confirm new password</label>
               <input
                  type="password"
                  value={repassword}
                  onChange={(e) => {
                     setRepassword(e.target.value);
                     setErrors((x) => ({ ...x, repassword: "" }));
                     setServerMsg("");
                  }}
                  onBlur={validate}
                  placeholder="••••••"
                  disabled={submitting}
               />
               {errors.repassword && (
                  <div className={cx("err")}>{errors.repassword}</div>
               )}
            </div>

            <button
               type="submit"
               className={cx("btnPrimary")}
               disabled={submitting || !token}
            >
               {submitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
            </button>

            <div className={cx("foot")}>
               <Link to="/login" className={cx("link")}>
                  ← Quay về đăng nhập
               </Link>
            </div>
         </form>
      // </div>
   );
}
