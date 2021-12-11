import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  position: toast.POSITION.TOP_RIGHT,
  pauseOnHover: true,
  newestOnTop: true,
  autoClose: 3000,
});

ReactDOM.render(
  <Provider store={store}>
    <ToastContainer />

    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
