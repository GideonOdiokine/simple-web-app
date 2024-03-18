import "../styles/globals.scss";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import store from "../app/store";
import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress
import "currency-flags/dist/currency-flags.css";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
NProgress.configure({ showSpinner: false });

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<ToastContainer />
			<Component {...pageProps} />
		</Provider>
	);
}
