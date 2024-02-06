import "./CSS/index.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import store from "./store/store.tsx";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
