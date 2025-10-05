// pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import Pager from "../../components/Pager/Pager";

const cx = classNames.bind(styles);

const Home = () => {
   return (
      <div className={cx("wrapper")}>
        <h1>Home page</h1>
      </div>
   );
};

export default Home;
