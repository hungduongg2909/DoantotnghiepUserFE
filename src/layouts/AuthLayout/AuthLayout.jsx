import { Outlet } from "react-router-dom";
import AuthLayoutCpn from "../../components/AuthLayoutCpn/AuthLayoutCpn";
import classNames from "classnames/bind";
import styles from "./AuthLayout.module.scss";

const cx = classNames.bind(styles);

export default function AuthLayout(props) {
   return (
      <AuthLayoutCpn {...props}>
         <Outlet />
      </AuthLayoutCpn>
   );
}
