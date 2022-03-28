import { queryClient } from "@/lib/queryClient";
import "@/styles/main.scss";
import axios from "axios";
import Router from "next/router";
import NProgress from "nprogress";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "antd/dist/antd.css";
import { wrapper } from "../redux/store";
import { setSportName } from "../redux/action/main";
dayjs.extend(utc);
dayjs.extend(timezone);

axios.defaults.baseURL = "https://eapi.enetpulse.com";
//axios.defaults.baseURL = "https://api.sportradar.us";

import "nprogress/nprogress.css";
import { connect } from "react-redux";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps, setSportName, lastSportName }) {
  Router.events.on("routeChangeStart", (route) => {
    let possibleRoute = [
      "futebol",
      "basquete",
      "tennis",
      "futebol-americano",
      "hoquei",
      "beisebol",
      "esportes",
      "mma",
    ];
    if (route != "" && route != undefined && route != null) {
      route = route.slice(1);
      if (route != lastSportName) {
        let isValidroute = possibleRoute.filter(
          (d) => d.toLowerCase() == route.toLowerCase()
        );
        if (isValidroute.length > 0) {
          localStorage.setItem("sportName", route);
          setSportName(route);
        }
      }
    }
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
const mapStateToProps = ({ main }) => {
  return { lastSportName: main.sportName };
};
const mapDispatchToProps = {
  setSportName,
};
export default wrapper.withRedux(
  connect(mapStateToProps, mapDispatchToProps)(MyApp)
);
