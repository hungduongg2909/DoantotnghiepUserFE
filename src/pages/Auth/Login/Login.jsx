// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { httpAuth } from "../../../services/httpAuth";

const cx = classNames.bind(styles);

export default function Login() {
   const navigate = useNavigate();

   const [identity, setIdentity] = useState(""); // username or email
   const [password, setPassword] = useState("");
   const [submitting, setSubmitting] = useState(false);

   const [errors, setErrors] = useState({ identity: "", password: "" });
   const [serverMsg, setServerMsg] = useState("");

   // validators
   const isEmail = (val) =>
      /^(?:[a-zA-Z0-9_'^&+%!-]+(?:\.[a-zA-Z0-9_'^&+%!-]+)*)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(
         val
      );
   const isUsername = (val) => /^[A-Za-z0-9]+$/.test(val);
   const isValidPassword = (val) => /^\S{6,}$/.test(val); // no spaces, >= 6

   const validate = () => {
      const next = { identity: "", password: "" };

      if (!identity.trim()) next.identity = "Username/Email is required";
      else if (!(isEmail(identity) || isUsername(identity)))
         next.identity =
            "Enter a valid email or username (letters & digits only)";

      if (!password) next.password = "Password is required";
      else if (!isValidPassword(password))
         next.password =
            "Password must be at least 6 characters and contain no spaces";

      setErrors(next);
      return !next.identity && !next.password;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;
      setServerMsg("");
      if (!validate()) return;

      // Build payload per your BE:
      const body = { loginIdentifier: identity.trim(), password };

      try {
         setSubmitting(true);
         const res = await httpAuth.post("/auth/login", body);
         const be = res?.data;

         if (be?.success) {
            // save username to localStorage as requested
            try {
               localStorage.setItem("username", be?.data?.username || "");
            } catch {}
            navigate("/", { replace: true });
         } else {
            // handle known BE error shapes
            if (Array.isArray(be?.errors) && be.errors.length)
               setServerMsg(be.errors.join("\n"));
            else setServerMsg(be?.message || "Login failed");
         }
      } catch (err) {
         const be = err?.response?.data;
         if (Array.isArray(be?.errors) && be.errors.length)
            setServerMsg(be.errors.join("\n"));
         else
            setServerMsg(
               be?.message || err?.message || "Unable to connect to server"
            );
      } finally {
         setSubmitting(false);
      }
   };

   const onKeyDown = (e) => {
      if (e.key === "Enter") handleSubmit(e);
   };

   return (
      // <div className={cx("wrap")}>
         <form className={cx("card")} onSubmit={handleSubmit}>
            <h1 className={cx("title")}>Log in</h1>

            {serverMsg && <div className={cx("serverMsg")}>{serverMsg}</div>}

            <div className={cx("field")}>
               <label className={cx("label")} htmlFor="identity">
                  Username / Email
               </label>
               <input
                  id="identity"
                  type="text"
                  autoComplete="username"
                  className={cx("input", { invalid: !!errors.identity })}
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  onBlur={validate}
                  onKeyDown={onKeyDown}
                  placeholder="johndoe or john@mail.com"
               />
               {errors.identity && (
                  <div className={cx("hintError")}>{errors.identity}</div>
               )}
            </div>

            <div className={cx("field")}>
               <label className={cx("label")} htmlFor="password">
                  Password
               </label>
               <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cx("input", { invalid: !!errors.password })}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validate}
                  onKeyDown={onKeyDown}
                  placeholder="••••••"
               />
               {errors.password && (
                  <div className={cx("hintError")}>{errors.password}</div>
               )}
            </div>

            <button
               type="submit"
               className={cx("btnPrimary")}
               disabled={submitting}
            >
               {submitting ? "Logging in..." : "Login"}
            </button>

            <div className={cx("foot")}>
               Don't have an account ?{" "}
               <Link to="/register" className={cx("link")}>
                  Register
               </Link>
            </div>
            <div className={cx("foot")}>
               <Link to="/forgot-password" className={cx("link")}>
                  Forgot password ?
               </Link>
            </div>
         </form>
      // </div>
   );
}
