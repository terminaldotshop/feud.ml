import { hydrateRoot } from "react-dom/client";
import App from "./generated/src/App.js";

if (import.meta.hot) {
  import.meta.hot.accept();
}

hydrateRoot(document.getElementById('root'), <App state={window.state}/>);
