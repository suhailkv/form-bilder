import React, { createContext, useContext, useState } from "react";
import { useTheme } from "@mui/material/styles";

// Context for managing tooltip visibility globally
const TooltipContext = createContext();

export const TooltipProvider = ({ children }) => {
  const [tooltip, setTooltip] = useState(null);
  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>
      {children}
      <TooltipContent />
    </TooltipContext.Provider>
  );
};

// Tooltip wrapper (for structure)
export const Tooltip = ({ children }) => <>{children}</>;

// Tooltip Trigger – listens for hover events
export const TooltipTrigger = ({ children, message }) => {
  const { setTooltip } = useContext(TooltipContext);

  return (
    <span
      onMouseEnter={(e) =>
        setTooltip({
          message,
          target: e.target.getBoundingClientRect(),
        })
      }
      onMouseLeave={() => setTooltip(null)}
      style={{ cursor: "help", display: "inline-flex" }}
    >
      {children}
    </span>
  );
};

// Tooltip Content – the actual bubble
export const TooltipContent = () => {
  const { tooltip } = useContext(TooltipContext);
  const theme = useTheme();

  if (!tooltip) return null;

  const styles = {
    position: "fixed",
    top: tooltip.target?.bottom + 6,
    left: tooltip.target?.left,
    background:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.9)"
        : "rgba(33,33,33,0.9)",
    color: theme.palette.mode === "dark" ? "#000" : "#fff",
    padding: "6px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    pointerEvents: "none",
    zIndex: 9999,
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    animation: "fadeIn 0.2s ease-in-out",
  };

  return <div style={styles}>{tooltip.message}</div>;
};
