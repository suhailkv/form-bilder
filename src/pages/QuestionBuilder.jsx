import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, AppBar, Toolbar, IconButton, Button, InputBase, Tooltip,
  Paper, Typography, TextField, Select, MenuItem, Divider, Radio,
  Switch, Checkbox, FormControl, InputLabel, Modal, Backdrop, Fade,
  Menu, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  useTheme, useMediaQuery, CircularProgress, Alert,
} from "@mui/material";
import { Publish } from "../components/publish/Publish";
import {
  TextSnippet as TextSnippetIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  ContentCopyOutlined,
  DeleteOutlineOutlined,
  RuleOutlined,
  DragIndicator as DragIndicatorIcon,
  CloudUploadOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Icon } from "@iconify/react";
import { useParams, useNavigate } from "react-router-dom";
import MiniSideBar from "../components/MiniSideBar/MiniSideBar";
import ConditionalLogic from "../components/ConditionalLogic";
import FormPreview from "../components/FormPreview";
import { fieldTypes, createNewField } from "../utils/formSchema";
import {
  setSchema, setUndoStack, setRedoStack, setShowPreview,
  setFocusedQuestion, setMenuAnchor, setMenuQuestionId,
  setMobileMenuOpen, setConditionalLogicOpen, setDraggedId,
  fetchForm, createForm, updateForm, setEmailVerification,
  uploadBannerImage, deleteBannerImage, removeBannerImage,
  clearBannerError,
} from "../redux/features/formCreationSlice";

// Styles
const containerStyles = {
  minHeight: "80vh",
  width: "100%",
  bgcolor: "#efebf9",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  pt: { xs: 2, sm: 3, md: 4 },
};

const headerStyles = {
  width: { xs: "100%", sm: "90%", md: 780, lg: 900 },
  maxWidth: "95%",
  mb: { xs: 1, sm: 2 },
  borderRadius: 3,
  p: { xs: 2, sm: 3 },
  bgcolor: "white",
  position: "relative",
  boxShadow: "0 2px 8px rgba(112,73,180,0.08)",
};

const questionBoxStyles = {
  width: { xs: "100%", sm: "90%", md: 780, lg: 900 },
  maxWidth: "95%",
  mb: { xs: 1, sm: 2 },
  borderRadius: 3,
  bgcolor: "white",
  position: "relative",
  boxShadow: "0 2px 8px rgba(112,73,180,0.08)",
  borderLeft: { xs: "2px solid #4b34b4", sm: "4px solid #4b34b4" },
  transition: "opacity 0.2s, transform 0.2s",
};

const focusedQuestionStyles = {
  ...questionBoxStyles,
  borderLeft: { xs: "4px solid #4285f4", sm: "6px solid #4285f4" },
  boxShadow: "0 4px 12px rgba(112,73,180,0.15)",
};

const loaderStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "rgba(255, 255, 255, 0.8)",
  zIndex: 1500,
};

export default function QuestionBuilder() {
  const [formIdAfterSave, setFormIdAfterSave] = useState(null); // New state for formId after save
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isXsOrSm = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formId } = useParams();

  const {
    schema,
    undoStack,
    redoStack,
    showPreview,
    focusedQuestion,
    menuAnchor,
    menuQuestionId,
    mobileMenuOpen,
    conditionalLogicOpen,
    draggedId,
    loading,
    loadingBannerImage,
    bannerImageError,
    bannerImagePreviewUrl,
    error,
  } = useSelector((state) => state.formCreation);

  const [showLoader, setShowLoader] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  // Fetch form on mount
  useEffect(() => {
    if (formId) {
      setShowLoader(true);
      dispatch(fetchForm(formId)).finally(() => {
        setTimeout(() => setShowLoader(false), 500);
      });
    }
  }, [formId, dispatch]);

   
  // Clear success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Schema change handler
  const handleSchemaChange = (newFields, newThankYouMessage) => {
    dispatch(setUndoStack([...undoStack, deepClone(schema)]));
    dispatch(setRedoStack([]));
    dispatch(
      setSchema({
        ...schema,
        fields: deepClone(newFields),
        thankYouMessage: newThankYouMessage,
      })
    );
  };

  const handleUndo = () => {
    if (!undoStack.length) return;
    const previous = undoStack[undoStack.length - 1];
    dispatch(setUndoStack(undoStack.slice(0, undoStack.length - 1)));
    dispatch(setRedoStack([deepClone(schema), ...redoStack]));
    dispatch(setSchema(previous));
  };

  const handleRedo = () => {
    if (!redoStack.length) return;
    const next = redoStack[0];
    dispatch(setRedoStack(redoStack.slice(1)));
    dispatch(setUndoStack([...undoStack, deepClone(schema)]));
    dispatch(setSchema(next));
  };

  const handleTitleChange = (newTitle) =>
    dispatch(setSchema({ ...schema, title: newTitle }));
  
  const handleDescriptionChange = (newDescription) =>
    dispatch(setSchema({ ...schema, description: newDescription }));
  
  const handleThankYouMessageChange = (newMessage) =>
    dispatch(setSchema({ ...schema, thankYouMessage: newMessage }));

  const handleUpdateField = (id, updatedField) => {
    const newQuestions = schema.fields.map((q) =>
      q.id === id ? { ...q, ...updatedField } : q
    );
    handleSchemaChange(newQuestions, schema.thankYouMessage);
  };

  const handleAddQuestion = () => {
    const newQuestion = createNewField("multipleChoice");
    handleSchemaChange([...schema.fields, newQuestion], schema.thankYouMessage);
    dispatch(setFocusedQuestion(newQuestion.id));
  };

  const handleQuestionTypeChange = (id, newType) => {
    let newField = createNewField(newType, id);
    const existing = schema.fields.find((q) => q.id === id);
    if (existing) {
      newField = {
        ...newField,
        label: existing.label,
        required: existing.required,
        conditions: existing.conditions || [],
      };
    }
    handleUpdateField(id, newField);
  };

  const handleQuestionChange = (id, value) =>
    handleUpdateField(id, { label: value });

  const handleOptionChange = (questionId, optionIndex, value) => {
    const question = schema.fields.find((q) => q.id === questionId);
    if (!question) return;
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    handleUpdateField(questionId, { options: newOptions });
  };

  const handleAddOption = (questionId) => {
    const question = schema.fields.find((q) => q.id === questionId);
    if (!question) return;
    const newOptions = [
      ...(question.options || []),
      `Option ${(question.options?.length || 0) + 1}`,
    ];
    handleUpdateField(questionId, { options: newOptions });
  };

  const handleAddOtherOption = (questionId) => {
    const question = schema.fields.find((q) => q.id === questionId);
    if (!question) return;
    const currentOptions = question.options || [];
    if (currentOptions.includes("Other")) return;
    const newOptions = [...currentOptions, "Other"];
    handleUpdateField(questionId, { options: newOptions });
  };

  const handleRemoveOption = (questionId, optionIndex) => {
    const question = schema.fields.find((q) => q.id === questionId);
    if (!question || !question.options || question.options.length <= 1) return;
    const newOptions = question.options.filter((_, idx) => idx !== optionIndex);
    handleUpdateField(questionId, { options: newOptions });
  };

  const handleDuplicateField = (id) => {
    const q = schema.fields.find((q) => q.id === id);
    if (!q) return;
    const copy = { ...q, id: `field_${Date.now()}`, label: q.label };
    const index = schema.fields.findIndex((item) => item.id === id);
    const newQuestions = [...schema.fields];
    newQuestions.splice(index + 1, 0, copy);
    handleSchemaChange(newQuestions, schema.thankYouMessage);
    handleCloseMenu();
  };

  const handleDeleteField = (id) => {
    if (window.confirm("Delete this question?")) {
      const filtered = schema.fields.filter((q) => q.id !== id);
      handleSchemaChange(filtered, schema.thankYouMessage);
      if (focusedQuestion === id) dispatch(setFocusedQuestion(null));
      if (conditionalLogicOpen === id) dispatch(setConditionalLogicOpen(null));
    }
    handleCloseMenu();
  };

  const handleToggleRequired = (id) => {
    const question = schema.fields.find((q) => q.id === id);
    handleUpdateField(id, { required: !question?.required });
  };

  const handleQuestionFileUpload = (event, id) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleUpdateField(id, { fileName: file.name, fileData: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQuestionFile = (id) => {
    handleUpdateField(id, { fileName: null, fileData: null });
  };

  // Banner Image Upload Handler (Fixed)
  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Clear previous errors
    dispatch(clearBannerError());

    // Validate file type
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      dispatch({
        type: 'formCreation/uploadBannerImage/rejected',
        payload: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)."
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      dispatch({
        type: 'formCreation/uploadBannerImage/rejected',
        payload: "Image size exceeds 5MB limit. Please compress the image."
      });
      return;
    }

    // Dispatch upload (now stores filename only, not base64)
    dispatch(uploadBannerImage(file));
  };

  // Remove Banner Handler (Fixed)
  const handleRemoveBanner = () => {
    const filename = schema.bannerImageFilename;
    
    if (filename) {
      // Delete from server
      dispatch(deleteBannerImage(filename));
    } else {
      // Just clear local state
      dispatch(removeBannerImage());
    }
  };

  const handleDragStart = (e, id) => {
    dispatch(setDraggedId(id));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => dispatch(setDraggedId(null));

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const newQuestions = [...schema.fields];
      const draggedIndex = schema.fields.findIndex((q) => q.id === draggedId);
      const targetIndex = schema.fields.findIndex((q) => q.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return;
      const [draggedQuestion] = newQuestions.splice(draggedIndex, 1);
      newQuestions.splice(targetIndex, 0, draggedQuestion);
      handleSchemaChange(newQuestions, schema.thankYouMessage);
    }
    dispatch(setDraggedId(null));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleToggleConditionalLogic = () => {
    dispatch(
      setConditionalLogicOpen(
        conditionalLogicOpen === menuQuestionId ? null : menuQuestionId
      )
    );
    handleCloseMenu();
  };

  const handleConditionalLogicChange = (questionId, updatedField) => {
    handleUpdateField(questionId, updatedField);
  };

  const handleOpenMenu = (event, questionId) => {
    event.stopPropagation();
    dispatch(setMenuQuestionId(questionId));
    if (isXs) dispatch(setMobileMenuOpen(true));
    else dispatch(setMenuAnchor(event.currentTarget));
  };

  const handleCloseMenu = () => {
    dispatch(setMenuAnchor(null));
    dispatch(setMenuQuestionId(null));
    dispatch(setMobileMenuOpen(false));
  };

  const handlePreviewToggle = () => dispatch(setShowPreview(!showPreview));

  // Save Form Handler - UPDATED WITH NAVIGATION
  const handleSaveForm = async () => {
    if (!schema.title || schema.title.trim() === "") {
      alert("Please enter a form title");
      return;
    }

    setShowLoader(true);
    setSaveSuccess(false);

    try {
      if (formId) {
        await dispatch(updateForm({ formId, payload: schema })).unwrap();
      } else {
        const result = await dispatch(createForm(schema)).unwrap();
        setFormIdAfterSave(result.id);
        
        // Navigate to the new form's URL after creation
        // if (result._id || result.id) {
        //   const newFormId = result._id || result.id;
        //   navigate(`/`, { replace: true });
        // }
      }
      setSaveSuccess(true);
    } catch (err) {
      console.error("Save failed:", err);
      alert(`Failed to save form: ${err}`);
    } finally {
      setTimeout(() => setShowLoader(false), 500);
    }
  };

  const renderOptionControl = (type) => {
    switch (type) {
      case "radio":
        return <Radio disabled size={isXs ? "small" : "medium"} sx={{ p: isXs ? 0.25 : 0.5 }} />;
      case "checkbox":
        return <Checkbox disabled size={isXs ? "small" : "medium"} sx={{ p: isXs ? 0.25 : 0.5 }} />;
      case "multipleChoice":
        return (
          <FormControl sx={{ minWidth: isXs ? "100%" : 260, mt: 1 }}>
            <InputLabel shrink>Multiple Choice</InputLabel>
            <Select
              multiple
              disabled
              displayEmpty
              value={[]}
              renderValue={() => "Select multiple options"}
              size={isXs ? "small" : "medium"}
              sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}
            >
              <MenuItem disabled value="">
                Select options
              </MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const MobileMenu = () => (
    <Modal
      open={mobileMenuOpen}
      onClose={handleCloseMenu}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300, sx: { backgroundColor: "rgba(0, 0, 0, 0.3)" } }}
    >
      <Fade in={mobileMenuOpen}>
        <Box sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          p: 0,
          outline: "none",
          maxHeight: "60vh",
          overflow: "hidden",
        }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}>
            <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 500 }}>
              Question options
            </Typography>
            <IconButton onClick={handleCloseMenu} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ py: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleToggleConditionalLogic}
                sx={{ py: 2, px: 3, "&:hover": { bgcolor: "#f5f5f5" } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <RuleOutlined sx={{ color: "#5f6368" }} />
                </ListItemIcon>
                <ListItemText
                  primary={conditionalLogicOpen === menuQuestionId ? "Hide conditions" : "Add condition"}
                  sx={{ "& .MuiListItemText-primary": { fontSize: "1rem", color: "#3c4043" } }}
                />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ mx: 3 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleDuplicateField(menuQuestionId)}
                sx={{ py: 2, px: 3, "&:hover": { bgcolor: "#f5f5f5" } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ContentCopyOutlined sx={{ color: "#5f6368" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Duplicate"
                  sx={{ "& .MuiListItemText-primary": { fontSize: "1rem", color: "#3c4043" } }}
                />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ mx: 3 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleDeleteField(menuQuestionId)}
                sx={{ py: 2, px: 3, "&:hover": { bgcolor: "#fce8e6" } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DeleteOutlineOutlined sx={{ color: "#d93025" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Delete"
                  sx={{ "& .MuiListItemText-primary": { fontSize: "1rem", color: "#d93025" } }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Fade>
    </Modal>
  );

  if (showPreview) {
    return (
      <Box sx={{ position: "relative" }}>
        {showLoader && (
          <Box sx={loaderStyle}>
            <CircularProgress size={60} />
          </Box>
        )}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "white",
            borderBottom: "1px solid #dadce0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            px: { xs: 1, sm: 1.5, md: 2 },
            py: { xs: 0.5, sm: 0.75, md: 1 },
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: { xs: "48px !important", sm: "52px !important", md: "56px !important" },
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
              <TextSnippetIcon sx={{ color: "#7049b4", fontSize: { xs: 24, sm: 26, md: 28 } }} />
              <Typography sx={{ fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" }, fontWeight: 500, color: "#202124" }}>
                {schema.title || "Untitled Form"} - Preview
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handlePreviewToggle}
              sx={{
                color: "#7049b4",
                borderColor: "#7049b4",
                textTransform: "none",
                fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                px: { xs: 1, sm: 1.5, md: 2 },
              }}
            >
              Back to Edit
            </Button>
          </Toolbar>
        </AppBar>
        <FormPreview previewData={schema} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#efebf9" }}>
      {showLoader && (
        <Box sx={loaderStyle}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Success Alert */}
      {saveSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            position: "fixed", 
            top: 20, 
            right: 20, 
            zIndex: 2000,
            boxShadow: 3 
          }}
          onClose={() => setSaveSuccess(false)}
        >
          Form saved successfully!
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: "fixed", 
            top: 20, 
            right: 20, 
            zIndex: 2000,
            boxShadow: 3 
          }}
          onClose={() => dispatch({ type: 'formCreation/clearError' })}
        >
          {error}
        </Alert>
      )}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "white",
          borderTopLeftRadius: "19px",
          borderTopRightRadius: "19px",
          boxShadow: "none",
          px: { xs: 1, sm: 1.5, md: 2 },
          pt: { xs: 0.5, sm: 0.75, md: 1 },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: { xs: "48px !important", sm: "52px !important", md: "56px !important" },
            gap: { xs: 0.5, sm: 1, md: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
            <TextSnippetIcon sx={{ color: "#7049b4", fontSize: { xs: 24, sm: 28, md: 32 } }} />
            {!isXsOrSm && (
              <InputBase
                value={schema.title || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled Form"
                sx={{ fontSize: { md: "1.8rem" }, fontWeight: 600 }}
              />
            )}
            <Tooltip title="Save Form" arrow>
              <IconButton
                aria-label="save"
                size="small"
                sx={{ ml: { xs: 0, sm: 0, md: "-44px" } }}
                onClick={handleSaveForm}
                disabled={loading}
              >
                <Icon icon="mdi:content-save-check-outline" style={{ color: loading ? "#ccc" : "#4e6ca7ff", fontSize: 30 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1, md: 1.5 } }}>
            <Tooltip title="Undo" arrow>
              <span>
                <IconButton onClick={handleUndo} disabled={undoStack.length === 0} size="small">
                  <UndoIcon sx={{ color: undoStack.length === 0 ? "#ccc" : "#7049b4", fontSize: { xs: 18, sm: 20, md: 24 } }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo" arrow>
              <span>
                <IconButton onClick={handleRedo} disabled={redoStack.length === 0} size="small">
                  <RedoIcon sx={{ color: redoStack.length === 0 ? "#ccc" : "#7049b4", fontSize: { xs: 18, sm: 20, md: 24 } }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Preview" arrow>
              <IconButton onClick={handlePreviewToggle} size="small">
                <VisibilityIcon sx={{ color: "#959698", fontSize: { xs: 18, sm: 20, md: 24 } }} />
              </IconButton>
            </Tooltip>
            <Publish  formId={formIdAfterSave}/>
            <IconButton size="small">
              <MoreVertIcon sx={{ color: "#959698", fontSize: { xs: 18, sm: 20, md: 24 } }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={containerStyles}>
        <MiniSideBar onAddQuestion={handleAddQuestion} />
        
        {/* Header with Banner Upload */}
        <Paper sx={headerStyles}>
          <Box sx={{ mb: isXs ? 2 : 3, position: "relative" }}>
            {bannerImagePreviewUrl || schema.bannerImageFilename ? (
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 70, sm: 100, md: 200 },
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 2,
                  position: "relative",
                  bgcolor: "#f5f5f5",
                }}
              >
                <img
                  src={bannerImagePreviewUrl}
                  alt="Banner"
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    display: loadingBannerImage ? "none" : "block"
                  }}
                  onError={(e) => {
                    console.error("Image failed to load");
                    e.target.style.display = "none";
                  }}
                />
                {loadingBannerImage && (
                  <Box sx={{ 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)" 
                  }}>
                    <CircularProgress size={40} />
                  </Box>
                )}
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
                  }}
                  onClick={handleRemoveBanner}
                  disabled={loadingBannerImage}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 100, sm: 150, md: 200 },
                  borderRadius: 2,
                  border: "2px dashed #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#fafafa",
                  mb: 2,
                  position: "relative",
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadOutlined />}
                  sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}
                  disabled={loadingBannerImage}
                >
                  {loadingBannerImage ? "Uploading..." : "Upload Banner Image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    hidden
                    onChange={handleBannerImageUpload}
                  />
                </Button>
                {loadingBannerImage && (
                  <CircularProgress
                    size={24}
                    sx={{ position: "absolute", top: 10, right: 10 }}
                  />
                )}
              </Box>
            )}
            {bannerImageError && (
              <Alert 
                severity="error" 
                sx={{ mt: 1 }}
                onClose={() => dispatch(clearBannerError())}
              >
                {bannerImageError}
              </Alert>
            )}
          </Box>

          <TextField
            variant="standard"
            fullWidth
            value={schema.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled form"
            InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "1.5rem" : isXsOrSm ? "1.8rem" : "2rem" } }}
          />
          <Divider sx={{ my: isXs ? 1 : 2 }} />
          <TextField
            variant="standard"
            fullWidth
            value={schema.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Form description"
            InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "0.9rem" : "1rem", color: "#666" } }}
          />
        </Paper>

        {/* Email Verification Section */}
        <Paper sx={headerStyles}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: isXs ? "1rem" : "1.1rem" }}>
              Require Email Address
            </Typography>
            <Switch 
              checked={schema.emailVerification ?? true} 
              onChange={(e) => dispatch(setEmailVerification(e.target.checked))} 
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#666", mt: 0.5, fontSize: isXs ? "0.8rem" : "0.9rem" }}>
            Collect respondent email addresses
          </Typography>
        </Paper>

        {/* Thank You Message Section */}
        <Paper sx={headerStyles}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: isXs ? 1 : 2, fontSize: isXs ? "1rem" : "1.1rem" }}>
            Submission Message
          </Typography>
          <Divider sx={{ my: isXs ? 1 : 2 }} />
          <TextField
            variant="standard"
            fullWidth
            value={schema.thankYouMessage}
            onChange={(e) => handleThankYouMessageChange(e.target.value)}
            placeholder="Thank you for submitting the form!"
            InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "0.9rem" : "1rem", color: "#666" } }}
          />
        </Paper>

        {/* Questions Rendering */}
        {schema.fields.map((q) => {
          const isFocused = focusedQuestion === q.id;
          const isConditionalOpen = conditionalLogicOpen === q.id;
          const isDragging = draggedId === q.id;

          return (
            <Paper
              key={q.id}
              sx={{
                ...(isFocused ? focusedQuestionStyles : questionBoxStyles),
                ...(isDragging && { opacity: 0.5, transform: "rotate(2deg)" }),
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, q.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, q.id)}
              onClick={() => dispatch(setFocusedQuestion(q.id))}
            >
              <Box sx={{ display: "flex", alignItems: "center", p: isXs ? 1 : 1.5, flexDirection: isXs ? "column" : "row" }}>
                <Tooltip title="Drag to reorder">
                  <DragIndicatorIcon
                    className="drag-handle"
                    sx={{
                      color: "#959698",
                      fontSize: isXs ? 20 : 24,
                      mr: isXs ? 0 : 1,
                      cursor: "grab",
                      "&:active": { cursor: "grabbing" },
                    }}
                  />
                </Tooltip>
                <TextField
                  variant="standard"
                  fullWidth
                  value={q.label}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  onFocus={() => dispatch(setFocusedQuestion(q.id))}
                  placeholder="Question"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: isXs ? "0.9rem" : "1rem", fontWeight: 500 },
                  }}
                  sx={{ mb: isXs ? 1 : 0, mr: isXs ? 0 : 2 }}
                />
                <Box sx={{ width: isXs ? "100%" : "auto" }}>
                  <Select
                    value={q.type}
                    onChange={(e) => handleQuestionTypeChange(q.id, e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: isXs ? "100%" : 140, bgcolor: "#faf8ff", fontSize: isXs ? "0.9rem" : "1rem" }}
                  >
                    {Object.entries(fieldTypes || {}).map(([type, config]) => (
                      <MenuItem key={type} value={type} sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}>
                        <span>{config.label}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>

              <Divider />

              {(q.type === "radio" || q.type === "select" || q.type === "multipleChoice") && (
                <Box>
                  {(q.options || []).map((opt, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", p: isXs ? 0.5 : 1 }}>
                      {q.type === "multipleChoice" ? (
                        <Checkbox disabled size={isXs ? "small" : "medium"} sx={{ p: isXs ? 0.25 : 0.5 }} />
                      ) : (
                        renderOptionControl(q.type)
                      )}
                      <TextField
                        variant="standard"
                        value={opt}
                        onChange={(e) => handleOptionChange(q.id, i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "0.8rem" : "0.9rem" } }}
                        sx={{ width: isXs ? "100%" : 260, mr: 1, ml: 1, bgcolor: "#efebf9" }}
                      />
                      {q.options && q.options.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOption(q.id, i);
                          }}
                        >
                          <DeleteOutlineOutlined fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Box sx={{ p: isXs ? 1 : 2, pl: isXs ? 2 : 4 }}>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: "#7049b4", fontSize: isXs ? "0.8rem" : "0.9rem" }}
                      onClick={() => handleAddOption(q.id)}
                    >
                      Add option
                    </Button>
                    <Typography component="span" sx={{ mx: 1, color: "#5c646d", fontSize: isXs ? "0.8rem" : "0.9rem" }}>
                      or
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: "#7049b4", fontSize: isXs ? "0.8rem" : "0.9rem" }}
                      onClick={() => handleAddOtherOption(q.id)}
                    >
                      Add "Other"
                    </Button>
                  </Box>
                </Box>
              )}

              {(q.type === "text" || q.type === "number") && (
                <Box sx={{ p: isXs ? 1 : 2, pl: isXs ? 2 : 4 }}>
                  <TextField
                    disabled
                    variant="standard"
                    placeholder={q.placeholder || "Your answer"}
                    InputProps={{ disableUnderline: true }}
                    sx={{ width: isXs ? "100%" : "50%", fontSize: isXs ? "0.8rem" : "0.9rem" }}
                  />
                </Box>
              )}

              {q.type === "checkbox" && <Box sx={{ p: isXs ? 1 : 2, pl: isXs ? 2 : 4 }}></Box>}

              {q.type === "uploadFile" && (
                <Box sx={{ p: isXs ? 1 : 2, pl: isXs ? 2 : 4 }}>
                  {q.fileData ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
                      <CloudUploadOutlined color="action" />
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>{q.fileName}</Typography>
                      <Button onClick={() => handleRemoveQuestionFile(q.id)} color="error" size="small">
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadOutlined />}
                      sx={{ width: isXs ? "100%" : "50%", fontSize: isXs ? "0.8rem" : "0.9rem" }}
                    >
                      Upload File
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleQuestionFileUpload(e, q.id)}
                      />
                    </Button>
                  )}
                </Box>
              )}

              {isConditionalOpen && (
                <Box sx={{ px: isXs ? 1 : 3, pb: isXs ? 1 : 2 }}>
                  <Paper sx={{ p: isXs ? 1 : 2 }}>
                    <ConditionalLogic
                      field={q}
                      allFields={schema.fields}
                      onChange={(updatedField) => handleConditionalLogicChange(q.id, updatedField)}
                    />
                  </Paper>
                </Box>
              )}

              {isFocused && (
                <>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", p: isXs ? 1 : 1.5, gap: isXs ? 0.25 : 0.5 }}>
                    <Tooltip title="Duplicate">
                      <IconButton size="small" onClick={() => handleDuplicateField(q.id)}>
                        <ContentCopyOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteField(q.id)}
                        sx={{ "&:hover": { color: "error.main" } }}
                      >
                        <DeleteOutlineOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem sx={{ mx: isXs ? 0.5 : 1 }} />
                    <Typography variant="body2" sx={{ fontSize: isXs ? "0.75rem" : "0.875rem", mr: 1, display: "flex", alignItems: "center" }}>
                      Required
                    </Typography>
                    <Switch
                      size="small"
                      checked={q.required || false}
                      onChange={() => handleToggleRequired(q.id)}
                    />
                    <Tooltip title="More options">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, q.id)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              )}

              {!isXs && (
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor && menuQuestionId === q.id)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={handleToggleConditionalLogic}>
                    <ListItemIcon>
                      <RuleOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText sx={{ fontSize: "0.9rem" }}>
                      {conditionalLogicOpen === q.id ? "Hide conditions" : "Add condition"}
                    </ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleDuplicateField(q.id)}>
                    <ListItemIcon>
                      <ContentCopyOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText sx={{ fontSize: "0.9rem" }}>Duplicate</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleDeleteField(q.id)} sx={{ color: "error.main" }}>
                    <ListItemIcon>
                      <DeleteOutlineOutlined fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ fontSize: "0.9rem" }}>Delete</ListItemText>
                  </MenuItem>
                </Menu>
              )}
            </Paper>
          );
        })}

        <MobileMenu />

        {schema.fields.length === 0 && (
          <Box sx={{ mt: isXs ? 3 : 6, textAlign: "center", color: "#666" }}>
            <Typography variant="h6" sx={{ fontSize: isXs ? "1rem" : "1.25rem" }}>
              Click "+" to add your first question
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}