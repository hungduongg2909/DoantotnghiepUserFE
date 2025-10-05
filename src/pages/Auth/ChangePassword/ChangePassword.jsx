import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ChangePassword.module.scss";
import { httpAuth } from "../../../services/httpAuth";

const cx = classNames.bind(styles);

const reNoSpace = /^\S+$/; // không khoảng trắng
const reNoSpaceMin6 = /^\S{6,}$/; // không khoảng trắng, tối thiểu 6 ký tự

export default function ChangePassword() {
   const navigate = useNavigate();

   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmNewPassword, setConfirmNewPassword] = useState("");

   const [submitting, setSubmitting] = useState(false);
   const [errors, setErrors] = useState({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
   });
   const [serverMsg, setServerMsg] = useState("");
   const [successMsg, setSuccessMsg] = useState("");

   // Guard: yêu cầu đăng nhập (kiểm tra username trong localStorage)
   useEffect(() => {
      try {
         const username = localStorage.getItem("username");
         if (!username) {
            navigate("/login", { replace: true });
         }
      } catch {
         navigate("/login", { replace: true });
      }
   }, [navigate]);

   const validate = () => {
      const e = { oldPassword: "", newPassword: "", confirmNewPassword: "" };

      if (!oldPassword) e.oldPassword = "Old password is required";
      else if (!reNoSpace.test(oldPassword))
         e.oldPassword = "Old password must have no spaces";

      if (!newPassword) e.newPassword = "New password is required";
      else if (!reNoSpaceMin6.test(newPassword))
         e.newPassword =
            "New password must be at least 6 characters and contain no spaces";

      if (!confirmNewPassword)
         e.confirmNewPassword = "Please confirm the new password";
      else if (!reNoSpaceMin6.test(confirmNewPassword))
         e.confirmNewPassword =
            "Confirm password must be at least 6 characters and contain no spaces";
      else if (newPassword !== confirmNewPassword)
         e.confirmNewPassword = "Passwords do not match";

      setErrors(e);
      return !e.oldPassword && !e.newPassword && !e.confirmNewPassword;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;

      setServerMsg("");
      setSuccessMsg("");

      if (!validate()) return;

      try {
         setSubmitting(true);
         const res = await httpAuth.post("/auth/change-password", {
            oldPassword,
            newPassword,
         });
         const be = res?.data;

         if (be?.success) {
            setSuccessMsg("Password changed successfully.");
            // tuỳ ý: có thể điều hướng về trang chủ sau 1-2s
            // setTimeout(() => navigate("/", { replace: true }), 1200);
            // clear form
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
         } else {
            const msg =
               (Array.isArray(be?.errors) && be.errors[0]) ||
               be?.message ||
               "Failed to change password";
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

   const onKeyDown = (e) => {
      if (e.key === "Enter") handleSubmit(e);
   };

   return (
      // <div className={cx("wrap")}>
         <form className={cx("card")} onSubmit={handleSubmit} noValidate>
            <h1 className={cx("title")}>Change password</h1>

            {serverMsg && <div className={cx("alertError")}>{serverMsg}</div>}
            {successMsg && (
               <div className={cx("alertSuccess")}>{successMsg}</div>
            )}

            <div className={cx("field")}>
               <label htmlFor="oldPassword">Old password</label>
               <input
                  id="oldPassword"
                  type="password"
                  className={cx("input", { invalid: !!errors.oldPassword })}
                  value={oldPassword}
                  onChange={(e) => {
                     setOldPassword(e.target.value);
                     setErrors((x) => ({ ...x, oldPassword: "" }));
                     setServerMsg("");
                  }}
                  onBlur={validate}
                  onKeyDown={onKeyDown}
                  placeholder="••••••"
                  autoComplete="current-password"
                  disabled={submitting}
               />
               {errors.oldPassword && (
                  <div className={cx("hintError")}>{errors.oldPassword}</div>
               )}
            </div>

            <div className={cx("field")}>
               <label htmlFor="newPassword">New password</label>
               <input
                  id="newPassword"
                  type="password"
                  className={cx("input", { invalid: !!errors.newPassword })}
                  value={newPassword}
                  onChange={(e) => {
                     setNewPassword(e.target.value);
                     setErrors((x) => ({ ...x, newPassword: "" }));
                     setServerMsg("");
                  }}
                  onBlur={validate}
                  onKeyDown={onKeyDown}
                  placeholder="••••••"
                  autoComplete="new-password"
                  disabled={submitting}
               />
               {errors.newPassword && (
                  <div className={cx("hintError")}>{errors.newPassword}</div>
               )}
            </div>

            <div className={cx("field")}>
               <label htmlFor="confirmNewPassword">Confirm new password</label>
               <input
                  id="confirmNewPassword"
                  type="password"
                  className={cx("input", {
                     invalid: !!errors.confirmNewPassword,
                  })}
                  value={confirmNewPassword}
                  onChange={(e) => {
                     setConfirmNewPassword(e.target.value);
                     setErrors((x) => ({ ...x, confirmNewPassword: "" }));
                     setServerMsg("");
                  }}
                  onBlur={validate}
                  onKeyDown={onKeyDown}
                  placeholder="••••••"
                  autoComplete="new-password"
                  disabled={submitting}
               />
               {errors.confirmNewPassword && (
                  <div className={cx("hintError")}>
                     {errors.confirmNewPassword}
                  </div>
               )}
            </div>

            <button
               type="submit"
               className={cx("btnPrimary")}
               disabled={submitting}
            >
               {submitting ? "Updating..." : "Change password"}
            </button>

            <div className={cx("foot")}>
               <Link to="/" className={cx("link")}>
                  ← Back to home
               </Link>
            </div>
         </form>
      // </div>
   );
}
