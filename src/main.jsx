import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { Provider } from "react-redux";
import store from "./store/store";
import router from "./Routes.jsx";
import { RouterProvider } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
        <RouterProvider router={router} />
  </Provider>
);
