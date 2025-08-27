import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router";
import App from "./App";
import { store, persistor } from "./redux/store"; // import persistor too
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // import PersistGate
import "./index.css";

const root = document.getElementById("root");

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <ScrollToTop />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
