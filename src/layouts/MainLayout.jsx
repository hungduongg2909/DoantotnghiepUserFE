import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import classNames from "classnames";
import styles from "./MainLayout.module.scss";

const cx = classNames.bind(styles);

export default function MainLayout() {
   return (
      <div className={cx("layout", "min-h-screen bg-gray-50")}>
         <Header />

         <main className={cx("main", "flex-1")}>
            <Outlet />
         </main>

         <Footer />
      </div>
   );
}
