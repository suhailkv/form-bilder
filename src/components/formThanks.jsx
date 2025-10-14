import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Typography, Button } from "@mui/material";
import { BACKEND_URL } from "../utils/const";

function FormThanks() {
  const handleCloseDialog = () => {
    // Try to close the tab (works only if opened by JS)
    window.close();

    // Fallback: redirect to backend home if close fails
    setTimeout(() => {
      if (!window.closed) {
        window.location.href = BACKEND_URL;
      }
    }, 100);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: 4,
          maxWidth: 480,
          width: "100%",
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 70, color: "#34A853", mb: 2 }}
        />
        <Typography variant="h5" fontWeight={500} gutterBottom>
          Your response has been recorded.
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Thank you for filling out the form.
        </Typography>

        <Button
          variant="contained"
          onClick={handleCloseDialog}
          sx={{
            textTransform: "none",
            backgroundColor: "#1a73e8",
            "&:hover": { backgroundColor: "#155ab6" },
            borderRadius: "8px",
            px: 3,
          }}
        >
          Close / Go Home
        </Button>
      </Box>
    </Box>
  );
}

export default FormThanks;
