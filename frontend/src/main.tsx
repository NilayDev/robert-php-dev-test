import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "./store/index.ts";
import "./index.css";
import App from "./App.tsx";
import Loader from "./components/loader/Loader.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Loader />
      <App />
      <ToastContainer />
    </PersistGate>
  </Provider>
);
