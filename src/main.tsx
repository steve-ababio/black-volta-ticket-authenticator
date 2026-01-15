import { createRoot } from "react-dom/client";
import '@fontsource/poppins/400.css'; // Regular weight
import '@fontsource/poppins/700.css'; // Bold weight
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
