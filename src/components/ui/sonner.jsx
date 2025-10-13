import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const Toaster = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 9999,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background:
                toast.type === "success"
                  ? "#4caf50"
                  : toast.type === "error"
                  ? "#f44336"
                  : "#333",
              color: "white",
              padding: "10px 14px",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              fontSize: "14px",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const toast = {
  success: (msg) => window.dispatchEvent(new CustomEvent("toast", { detail: { msg, type: "success" } })),
  error: (msg) => window.dispatchEvent(new CustomEvent("toast", { detail: { msg, type: "error" } })),
  info: (msg) => window.dispatchEvent(new CustomEvent("toast", { detail: { msg, type: "info" } })),
};

// Automatically hook window event to Toaster
export const ToastListener = () => {
  const { showToast } = useContext(ToastContext);
  React.useEffect(() => {
    const handler = (e) => showToast(e.detail.msg, e.detail.type);
    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, [showToast]);
  return null;
};
