import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ForgotPassword.module.scss";
import { httpAuth } from "../../../services/httpAuth";

const cx = classNames.bind(styles);

// regex email cơ bản
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
   const [email, setEmail] = useState("");
   const [err, setErr] = useState("");
   const [serverMsg, setServerMsg] = useState("");
   const [successMsg, setSuccessMsg] = useState("");

   const [submitting, setSubmitting] = useState(false);

   // cooldown 120s
   const COOLDOWN = 120;
   const [cooldown, setCooldown] = useState(0); // giây còn lại
   const intervalRef = useRef(null);

   const validate = () => {
      if (!email.trim()) return "Email cannot be blank";
      if (!reEmail.test(email.trim())) return "Email is not in correct format";
      return "";
   };

   const startCooldown = () => {
      setCooldown(COOLDOWN);
      // clear nếu đang chạy
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
         setCooldown((s) => {
            if (s <= 1) {
               clearInterval(intervalRef.current);
               intervalRef.current = null;
               return 0;
            }
            return s - 1;
         });
      }, 1000);
   };

   // clear interval khi unmount
   useEffect(() => {
      return () => {
         if (intervalRef.current) clearInterval(intervalRef.current);
      };
   }, []);

   const onSubmit = async (e) => {
      e.preventDefault();
      if (submitting || cooldown > 0) return;

      setErr("");
      setServerMsg("");
      setSuccessMsg("");

      const v = validate();
      if (v) {
         setErr(v);
         return;
      }

      try {
         setSubmitting(true);
         const res = await httpAuth.post("/auth/forgot-password", {
            email: email.trim(),
         });
         const be = res?.data;

         if (be?.success) {
            setSuccessMsg("Password reset link has been sent to your email.");
            startCooldown();
         } else {
            const msg =
               be?.message ||
               (Array.isArray(be?.errors) && be.errors.length
                  ? be.errors[0]
                  : "Request sent failed");
            setServerMsg(msg);
         }
      } catch (error) {
         const be = error?.response?.data;
         const msg =
            (Array.isArray(be?.errors) && be.errors[0]) ||
            be?.message ||
            error?.message ||
            "Unable to connect to server";
         setServerMsg(msg);
      } finally {
         setSubmitting(false);
      }
   };

   const disabled = submitting || cooldown > 0;

   return (
      // <div className={cx("wrap")}>
         <form className={cx("card")} onSubmit={onSubmit} noValidate>
            <h1 className={cx("title")}>Forgot password</h1>

            {serverMsg && <div className={cx("alertError")}>{serverMsg}</div>}
            {successMsg && (
               <div className={cx("alertSuccess")}>
                  {successMsg}{" "}
                  <a
                     className={cx("inboxLink")}
                     href="https://mail.google.com/mail/u/0/#inbox"
                     target="_blank"
                     rel="noreferrer"
                  >
                     Open Gmail Inbox
                  </a>
               </div>
            )}

            <div className={cx("field")}>
               <label>Email</label>
               <input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => {
                     setEmail(e.target.value);
                     setErr("");
                     setServerMsg("");
                     setSuccessMsg("");
                  }}
                  onBlur={() => setErr(validate())}
                  disabled={submitting}
               />
               {err && <div className={cx("err")}>{err}</div>}
            </div>

            <button
               type="submit"
               className={cx("btnPrimary")}
               disabled={disabled}
            >
               {submitting
                  ? "Sending..."
                  : cooldown > 0
                  ? `Send back later ${cooldown}s`
                  : "Send password reset link"}
            </button>

            <div className={cx("foot")}>
               <Link to="/login" className={cx("link")}>
                  ← Back to login
               </Link>
            </div>
         </form>
      // </div>
   );
}
