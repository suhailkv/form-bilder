import React from "react";
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Fab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";

const MiniSideBar = ({ onAddQuestion }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md")); // <600px
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px–900px

  if (isXs) {
    return (
      <Fab
        color="primary"
        onClick={onAddQuestion}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          bgcolor: "#7049b4",
          "&:hover": { bgcolor: "#5a36a1" },
          width: 48,
          height: 48,
        }}
      >
        <AddCircleOutlineOutlined sx={{ fontSize: 24 }} />
      </Fab>
    );
  }

  return (
    <Box
      // sx={{
      //   position: "fixed",
      //   top: "30%",
      //   right: { sm: 20, md: 30, lg: 330 },
      //   transform: "translateY(-50%)",
      //   zIndex: 1000,
      // }}
      sx={{
        position: "fixed",
        top: 150,
        // right: { xs: 16, sm: 32, md: 'calc((100vw - 960px) / 2)' },
        left: {
          xs: "80%", // mobile (<600px)
          sm: "95%", // small screens (600–900px)
          md: "92%", // medium screens (900–1200px)
          lg: "88%", // large screens (1200–1536px)
          xl: "79%", // extra-large screens (≥1536px)
        },
        zIndex: 1500,
        padding: 1,
      }}

    >
      <Paper
        sx={{
          width: { sm: 48, md: 56 },
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow:
            "0 2px 8px rgba(60,64,67,.15), 0 1px 4px rgba(60,64,67,.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { sm: 0.5, md: 1 },
          border: "1px solid #dadce0",
        }}
        elevation={0}
      >
        <Tooltip title="Add question" placement="left">
          <IconButton
            onClick={onAddQuestion}
            sx={{
              my: 0.5,
              "&:hover": {
                backgroundColor: "#f1f3f4",
                color: "#1976d2",
              },
              p: isSm ? 0.5 : 1,
            }}
          >
            <AddCircleOutlineOutlined sx={{ fontSize: isSm ? 20 : 24 }} />
          </IconButton>
        </Tooltip>
      </Paper>
    </Box>
  );
};

export default MiniSideBar;
