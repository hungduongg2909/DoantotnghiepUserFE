import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import { httpAuth } from "../../../services/httpAuth";

const cx = classNames.bind(styles);

// Validators
const reUsername = /^[A-Za-z0-9]+$/; // chỉ chữ & số
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email cơ bản
const reNoSpace = /^\S+$/; // không khoảng trắng
const rePhone = /^[0-9]+$/; // chỉ số

export default function Register() {
   const navigate = useNavigate();

   const [form, setForm] = useState({
      username: "",
      email: "",
      password: "",
      fullname: "",
      phone: "",
   });

   const [errors, setErrors] = useState({
      username: "",
      email: "",
      password: "",
      fullname: "",
      phone: "",
   });

   const [submitting, setSubmitting] = useState(false);
   const [serverMsg, setServerMsg] = useState("");
   const [successMsg, setSuccessMsg] = useState("");

   const setField = (key, val) => {
      setForm((f) => ({ ...f, [key]: val }));
      setErrors((e) => ({ ...e, [key]: "" }));
      setServerMsg("");
   };

   const validate = () => {
      const e = {
         username: "",
         email: "",
         password: "",
         fullname: "",
         phone: "",
      };
      const { username, email, password, fullname, phone } = form;

      if (!username.trim()) e.username = "Username cannot be blank";
      else if (!reUsername.test(username))
         e.username = "Username must contain only letters and numbers";

      if (!email.trim()) e.email = "Email cannot be blank";
      else if (!reEmail.test(email))
         e.email = "Email is not in correct format.";

      if (!password) e.password = "Password cannot be blank";
      else if (!reNoSpace.test(password))
         e.password = "Password cannot contain spaces";
      else if (password.length < 6)
         e.password = "Password must be at least 6 characters";

      if (!fullname.trim()) e.fullname = "Fullname cannot be blank";

      if (!phone.trim()) e.phone = "Phone cannot be blank";
      else if (!rePhone.test(phone)) e.phone = "Phone number only";

      setErrors(e);
      return Object.values(e).every((v) => !v);
   };

   const onSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;

      setServerMsg("");
      setSuccessMsg("");

      if (!validate()) return;

      try {
         setSubmitting(true);
         const payload = {
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password,
            fullname: form.fullname.trim(),
            phone: form.phone.trim(),
         };

         const res = await httpAuth.post("/auth/register", payload);
         const be = res?.data;

         if (be?.success) {
            setSuccessMsg(
               "Registration successful. Redirecting to login page..."
            );
            setTimeout(() => navigate("/login"), 1000);
         } else {
            const msg =
               be?.message ||
               (Array.isArray(be?.errors) && be.errors.length
                  ? be.errors[0]
                  : "Registration failed");
            setServerMsg(msg);
         }
      } catch (err) {
         const be = err?.response?.data;
         const msg =
            (Array.isArray(be?.errors) && be.errors[0]) ||
            be?.message ||
            err?.message ||
            "Registration failed";
         setServerMsg(msg);
      } finally {
         setSubmitting(false);
      }
   };

   return (
      // <div className={cx("wrap")}>
         <form className={cx("card")} onSubmit={onSubmit} noValidate>
            <h1 className={cx("title")}>Register</h1>

            {serverMsg && <div className={cx("alertError")}>{serverMsg}</div>}
            {successMsg && (
               <div className={cx("alertSuccess")}>{successMsg}</div>
            )}

            <div className={cx("field")}>
               <label>Username</label>
               <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setField("username", e.target.value)}
                  placeholder="yourname123"
                  disabled={submitting}
                  onBlur={validate}
               />
               {errors.username && (
                  <div className={cx("err")}>{errors.username}</div>
               )}
            </div>

            <div className={cx("field")}>
               <label>Email</label>
               <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                  disabled={submitting}
                  onBlur={validate}
               />
               {errors.email && <div className={cx("err")}>{errors.email}</div>}
            </div>

            <div className={cx("field")}>
               <label>Password</label>
               <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="••••••••"
                  disabled={submitting}
                  onBlur={validate}
               />
               {errors.password && (
                  <div className={cx("err")}>{errors.password}</div>
               )}
            </div>

            <div className={cx("field")}>
               <label>Fullname</label>
               <input
                  type="text"
                  value={form.fullname}
                  onChange={(e) => setField("fullname", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  disabled={submitting}
                  onBlur={validate}
               />
               {errors.fullname && (
                  <div className={cx("err")}>{errors.fullname}</div>
               )}
            </div>

            <div className={cx("field")}>
               <label>Phone</label>
               <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="0912345678"
                  disabled={submitting}
                  onBlur={validate}
               />
               {errors.phone && <div className={cx("err")}>{errors.phone}</div>}
            </div>

            <button
               type="submit"
               className={cx("btnPrimary")}
               disabled={submitting}
            >
               {submitting ? "Đang đăng ký..." : "Register"}
            </button>

            <div className={cx("foot")}>
               Already have an account ?{" "}
               <Link to="/login" className={cx("link")}>
                  Log in
               </Link>
            </div>
         </form>
      // </div>
   );
}
