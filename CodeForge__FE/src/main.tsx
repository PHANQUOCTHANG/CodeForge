import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/main.scss";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
