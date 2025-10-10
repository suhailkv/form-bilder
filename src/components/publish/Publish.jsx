import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Fade,
  Backdrop,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, ContentCopy as CopyIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router-dom"; // Add this import
import { useNavigate } from "react-router-dom";
import { publishForm } from "../../redux/features/formCreationSlice";


export const Publish = ({formId}) => {
   const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { formIds } = useParams(); // Get formId from URL params
  const { loading, error, schema } = useSelector((state) => state.formCreation);
// console.log("formId in publish",formId);

  const [open, setOpen] = useState(false);
  const [publishedLink, setPublishedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  // Use schema._id if formId from params is not available
  const currentFormId = formId|| schema._id || schema.id;

  const handlePublish = async () => {
    // Validate form exists
    if (!currentFormId) {
      alert("Please save the form first before publishing");
      return;
    }

    if (!schema.title || schema.title.trim() === "") {
      alert("Please add a form title before publishing");
      return;
    }

    try {
      const resultAction = await dispatch(publishForm(formId));

      if (publishForm.fulfilled.match(resultAction)) {
        // Extract the encoded token from backend response if available
        const formToken = resultAction.payload?.formToken ;
        // const link = `${BACKEND_URL}/api/forms/${formToken}`;
         const fullUrl = `${window.location.origin}/form/${formToken}`;
        setPublishedLink(fullUrl);
      }
    } catch (err) {
      console.error("Publish error:", err);
    }
  };

  const handleCopy = () => {
    if (publishedLink) {
      navigator.clipboard.writeText(publishedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPublishedLink(null);
    navigate("/")                                                  
    setCopied(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        disabled={!formId && !formId} // Disable if no formId
        sx={{
          background: "#7049b4",
          color: "white",
          fontWeight: 500,
          px: { xs: 1, sm: 1.5, md: 2.5 },
          minHeight: { sm: 32, md: 36 },
          height: { xs: "25px" },
          fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
          textTransform: "none",
          boxShadow: "0 1px 4px rgba(60,64,67,.13)",
          "&:hover": { background: "#5a36a1" },
        }}
      >
        Publish
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 300 }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: 320, sm: 420 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 3,
            }}
          >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Publish Form
              </Typography>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Modal Content */}
            {!publishedLink ? (
              <>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Once published, your form will be available to users via a shareable link.
                </Typography>

                {error && (
                  <Typography color="error" mb={1} sx={{ fontSize: "0.875rem" }}>
                    {error}
                  </Typography>
                )}

                <Button
                  variant="contained"
                  onClick={handlePublish}
                  disabled={loading}
                  fullWidth
                  sx={{
                    background: "#7049b4",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { background: "#5a36a1" },
                  }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Publish"}
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Your form is now live! Share this link:
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TextField
                    fullWidth
                    value={publishedLink}
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                  <IconButton onClick={handleCopy} size="small" color={copied ? "success" : "primary"}>
                    <CopyIcon />
                  </IconButton>
                </Box>

                {copied && (
                  <Typography
                    variant="caption"
                    sx={{ color: "green", display: "block", mb: 2 }}
                  >
                    Link copied to clipboard!
                  </Typography>
                )}

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button onClick={handleClose} variant="contained" sx={{ 
                    background: "#7049b4",
                    "&:hover": { background: "#5a36a1" }
                  }}>
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};