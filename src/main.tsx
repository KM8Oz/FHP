import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import 'unfonts.css'
import { Pocketbase } from "pocketbase-react";
import toast, { Toaster } from "react-hot-toast";
import { open } from '@tauri-apps/api/shell';
import { VITE_POCKET_BASE_REDIRECT_URL, VITE_POCKET_BASE_URL } from "./utils";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Pocketbase
      serverURL={VITE_POCKET_BASE_URL}
      initialCollections={["users"]}
      webRedirectUrl={VITE_POCKET_BASE_REDIRECT_URL}
      openURL={async (url: string | URL | undefined) => {
        // for example expo WebBrowser
        if (url && !String(url)?.includes("undefined")) {
          await open(String(url));
        } else {
          toast.dismiss()
          toast.error(`Error loading github auth URL!`,
            {
              duration: 2000,
              position: "bottom-center",
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                padding: '4px 5px',
                fontSize: '10px',
              },
            }
          );
        }
      }}
      mobileRedirectUrl={import.meta.env.POCKET_BASE_REDIRECT_URL || ""}>
      <Toaster />
      <App />
    </Pocketbase>
  </React.StrictMode>
);
