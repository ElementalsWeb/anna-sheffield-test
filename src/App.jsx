import React from "react";
import "./App.scss";
import { StartPage } from "./page/StartPage/StartPage";
import { useLocation } from "react-router-dom";
import { Configuration } from "./page/Configuration/Configuration";
// import Client from "shopify-buy";

export const recalculateVh = () => {
   
  let vh = window.innerHeight * 0.01;
   console.log()
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  window.onresize = function () {
    setTimeout(function () {
      const height =
        document.documentElement.clientHeight > window.innerHeight
          ? document.documentElement.clientHeight
          : window.innerHeight;
      vh = height * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }, 500);
  };
};

function App() {
  recalculateVh();
  const search = useLocation().search;
  const type = new URLSearchParams(search).get("type");
  return !!type ? <Configuration /> : <StartPage />;
}

export default App;
