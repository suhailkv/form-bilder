import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Alert,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Icon } from "@iconify/react";

const FormHeader = ({ published = false, acceptingResponses = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "text.primary",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 48, 
            px: 1.5,
            py: 0,
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ArrowBackIcon fontSize="medium" />
            <Typography
              variant="body2"
              fontWeight={400}
              fontSize="1.35rem"
              sx={{ lineHeight: 0.5 }}
            >
              Preview mode
            </Typography>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              flexWrap: "nowrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
              }}
              color={published ? "success.main" : "text.secondary"}
            >
              {published ? "✓ Published" : "⦸ Not published"}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Icon icon="mdi:link-variant" />}
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                fontSize: "0.95rem",
                px: 1.5,
                py: 0.3,
                height: 38, 
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              Copy responder link
            </Button>
          </Box>
        </Toolbar>

        {/* Alert Section */}
        {!acceptingResponses && (
<Alert
  severity="warning"
  sx={{
    borderRadius: 3,
    bgcolor: "#fff8e1",
    color: "#5d4037",
    px: 2,
    py: 0.8,
    mx: 2,
    mb: 2,
    "& .MuiAlert-message": {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 1,
    },
  }}
  icon={false} // disable default alert icon
>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {/* Your custom SVG */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
    >
      <g fill="#df5600">
        <path d="M6.5 6a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 4a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 4a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"></path>
        <path
          fillRule="evenodd"
          d="M7.5 6a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1"
          clipRule="evenodd"
        ></path>
        <path d="M1.293 2.707a1 1 0 0 1 1.414-1.414l16 16a1 1 0 0 1-1.414 1.414z"></path>
      </g>
    </svg>

    {/* Text */}
    <Typography sx={{ fontSize: "0.95rem" }}>
      This form isn't accepting responses.
    </Typography>
  </Box>

  {/* Right side link */}
  <Link
    href="#"
    underline="hover"
    sx={{
      fontSize: "0.9rem",
      color: "#141313d5",
      fontWeight: 500,
      whiteSpace: "nowrap",
    }}
  >
    Manage publish settings
  </Link>
</Alert>

        )}
      </AppBar>
    </Box>
  );
};

export default FormHeader;
