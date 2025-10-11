import React from "react";
import { Button as MUIButton } from "@mui/material";

/**
 * Custom Button — Radix-free, CVA-free replacement
 * 
 * Props:
 * - variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
 * - size: "default" | "sm" | "lg" | "icon"
 * - asChild: optional (renders <a> or <div> instead of <button>)
 * - className: optional extra styles
 */
const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const commonStyles = {
      borderRadius: "6px",
      textTransform: "none",
      fontWeight: 500,
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    };

    // ✅ Variants (same as original)
    const variantStyles = {
      default: { backgroundColor: "#1976d2", color: "#fff", "&:hover": { backgroundColor: "#1565c0" } },
      destructive: { backgroundColor: "#d32f2f", color: "#fff", "&:hover": { backgroundColor: "#b71c1c" } },
      outline: { border: "1px solid #ccc", backgroundColor: "#fff", color: "#333", "&:hover": { backgroundColor: "#f9f9f9" } },
      secondary: { backgroundColor: "#9c27b0", color: "#fff", "&:hover": { backgroundColor: "#7b1fa2" } },
      ghost: { backgroundColor: "transparent", color: "#333", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } },
      link: { backgroundColor: "transparent", color: "#1976d2", textDecoration: "underline", "&:hover": { color: "#004ba0" } },
    };

    // ✅ Sizes
    const sizeStyles = {
      default: { padding: "8px 16px", fontSize: "0.9rem", height: "40px" },
      sm: { padding: "6px 12px", fontSize: "0.8rem", height: "36px" },
      lg: { padding: "10px 20px", fontSize: "1rem", height: "44px" },
      icon: { padding: "0", width: "40px", height: "40px", fontSize: "1.1rem" },
    };

    const Comp = asChild ? "span" : MUIButton;

    return (
      <Comp
        ref={ref}
        disableElevation
        disableRipple
        sx={{
          ...commonStyles,
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...props.sx, // allow sx override
        }}
        className={className}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
