import React from "react";
import { Box, Paper, IconButton, Tooltip, Fab, useTheme, useMediaQuery } from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";

const MiniSideBar = ({ onAddQuestion }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // <600px
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
      sx={{
        position: "fixed",
        top: "33%",
        right: { sm: 20, md: 30, lg: 120 },
        transform: "translateY(-50%)",
        zIndex: 1000,
      }}
    >
      <Paper
        sx={{
          width: { sm: 48, md: 56 },
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(60,64,67,.15), 0 1px 4px rgba(60,64,67,.3)",
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