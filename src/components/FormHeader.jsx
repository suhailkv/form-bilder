import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Alert,
  Link,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Icon } from "@iconify/react";

const FormHeader = ({ published = false, acceptingResponses = false }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs")); 
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [showAlert, setShowAlert] = useState(!acceptingResponses); 
  const popoverRef = useRef();

  const handleCopyLinkClick = () => {
    setAnchorEl(popoverRef.current);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
            px: isSm ? 1 : 3,
            py: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isSm ? 0.5 : 1,
            }}
          >
            <ArrowBackIcon fontSize={isSm ? "small" : "medium"} />
            {!isSm && (
              <Typography
                variant="body2"
                fontWeight={400}
                fontSize="1.35rem"
                sx={{ lineHeight: 0.9 }}
                noWrap
              >
                Preview mode
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isSm ? 1.5 : 2.5,
              flexWrap: "nowrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: isSm ? "0.75rem" : "1rem",
                whiteSpace: "nowrap",
              }}
              color={published ? "success.main" : "text.secondary"}
              noWrap
              title={published ? "Published" : "Not published"}
            >
              {published ? "✓ Published" : "⦸ Not published"}
            </Typography>

            <span ref={popoverRef}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Icon icon="mdi:link-variant" />}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  fontSize: isSm ? "0.7rem" : "0.95rem",
                  px: isSm ? 0.75 : 1.5,
                  py: 0.3,
                  height: isSm ? 32 : 38,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
                onClick={handleCopyLinkClick}
              >
                {!isXs && "Copy responder link"}
              </Button>
            </span>
          </Box>
        </Toolbar>

      
        {showAlert && !acceptingResponses && (
          <Alert
            severity="warning"
            sx={{
              borderRadius: 3,
              py: 1,
              mx: 2,
              mb: 2,
              height: 20,
              fontSize: isSm ? "0.7rem" : "0.9rem",
              "& .MuiAlert-message": {
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                overflow: "hidden",
              },
            }}
            icon={false}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              <Typography sx={{ fontSize: "inherit" }}>
                This form isn't accepting responses.
              </Typography>
            </Box>
            <Link
              href="#"
              underline="hover"
              sx={{
                fontSize: isSm ? "0.7rem" : "0.9rem",
                color: "#14131389",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Manage publish settings
            </Link>
          </Alert>
        )}
      </AppBar>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 220,
            width: 300,
            boxShadow: 3,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            The form is unpublished
          </Typography>
          <Typography variant="body2">
            Currently, nobody can respond. Do you want to copy the unpublished form
            link?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <Button onClick={handleClosePopover} sx={{ textTransform: "none" }}>
              Publish
            </Button>
            <Button
              onClick={handleClosePopover}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Copy
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FormHeader;



