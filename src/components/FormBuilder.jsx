import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  Radio,
  Button,
  Switch,
  Checkbox,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ContentCopyOutlined,
  DeleteOutlineOutlined,
  MoreVert,
  RuleOutlined,
} from "@mui/icons-material";
import MiniSideBar from "./MiniSideBar/MiniSideBar";
import ConditionalLogic from "./ConditionalLogic";
import { fieldTypes, createNewField } from "../utils/formSchema";

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
};

const focusedQuestionStyles = {
  ...questionBoxStyles,
  borderLeft: { xs: "4px solid #4285f4", sm: "6px solid #4285f4" },
  boxShadow: "0 4px 12px rgba(112,73,180,0.15)",
};

export default function FormBuilder({
  questions,
  onQuestionsChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  thankYouMessage,
  onThankYouMessageChange,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [focusedQuestion, setFocusedQuestion] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuQuestionId, setMenuQuestionId] = useState(null);
  const [conditionalLogicOpen, setConditionalLogicOpen] = useState(null);

  // === HELPERS ===
  const handleUpdateField = (id, updatedField) => {
    onQuestionsChange(
      questions.map((q) => (q.id === id ? { ...q, ...updatedField } : q)),
      thankYouMessage
    );
  };

  const handleAddQuestion = () => {
    const newQuestion = createNewField("multipleChoice");
    onQuestionsChange([...questions, newQuestion], thankYouMessage);
    setFocusedQuestion(newQuestion.id);
  };

  const handleQuestionTypeChange = (id, newType) => {
    let newField = createNewField(newType, id);
    const existing = questions.find((q) => q.id === id);
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
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    handleUpdateField(questionId, { options: newOptions });
  };

  const handleAddOption = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    const newOptions = [
      ...(question.options || []),
      `Option ${(question.options?.length || 0) + 1}`,
    ];
    handleUpdateField(questionId, { options: newOptions });
  };

  const handleAddOtherOption = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    const currentOptions = question.options || [];
    if (currentOptions.includes("Other")) {
      console.log(`"Other" option already exists for question ${questionId}`);
      return;
    }
    const newOptions = [...currentOptions, "Other"];
    handleUpdateField(questionId, { options: newOptions });
    console.log(`Added "Other" option to question ${questionId}:`, newOptions);
  };

  const handleRemoveOption = (questionId, optionIndex) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question || !question.options || question.options.length <= 1) return;
    const newOptions = question.options.filter((_, idx) => idx !== optionIndex);
    handleUpdateField(questionId, { options: newOptions });
  };

  const handleDuplicateField = (id) => {
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    const copy = {
      ...q,
      id: `field_${Date.now()}`,
      label: q.label + " (copy)",
    };
    onQuestionsChange([...questions, copy], thankYouMessage);
    handleCloseMenu();
  };

  const handleDeleteField = (id) => {
    if (window.confirm("Delete question?")) {
      onQuestionsChange(questions.filter((q) => q.id !== id), thankYouMessage);
      if (focusedQuestion === id) setFocusedQuestion(null);
      if (conditionalLogicOpen === id) setConditionalLogicOpen(null);
    }
    handleCloseMenu();
  };

  const handleToggleRequired = (id) => {
    const question = questions.find((q) => q.id === id);
    handleUpdateField(id, { required: !question?.required });
  };

  const handleOpenMenu = (event, questionId) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuQuestionId(questionId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuQuestionId(null);
  };

  const handleToggleConditionalLogic = () => {
    if (conditionalLogicOpen === menuQuestionId) {
      setConditionalLogicOpen(null);
    } else {
      setConditionalLogicOpen(menuQuestionId);
    }
    handleCloseMenu();
  };

  const handleConditionalLogicChange = (questionId, updatedField) => {
    handleUpdateField(questionId, updatedField);
  };

  const renderOptionControl = (type) => {
    switch (type) {
      case "radio":
      case "multipleChoice":
        return <Radio disabled size={isXs ? "small" : "medium"} sx={{ p: isXs ? 0.25 : 0.5 }} />;
      case "checkbox":
        return <Checkbox disabled size={isXs ? "small" : "medium"} sx={{ p: isXs ? 0.25 : 0.5 }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={containerStyles}>
      <MiniSideBar onAddQuestion={handleAddQuestion} />

      {/* Header */}
      <Paper sx={headerStyles}>
        <TextField
          variant="standard"
          fullWidth
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled form"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: isXs ? "1.5rem" : isSm ? "1.8rem" : "2rem" },
          }}
        />
        <Divider sx={{ my: isXs ? 1 : 2 }} />
        <TextField
          variant="standard"
          fullWidth
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Form description"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: isXs ? "0.9rem" : "1rem", color: "#666" },
          }}
        />
        <Divider sx={{ my: isXs ? 1 : 2 }} />
        <TextField
          variant="standard"
          fullWidth
          value={thankYouMessage}
          onChange={(e) => onThankYouMessageChange(e.target.value)}
          placeholder="Enter thank you message (shown after form submission)"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: isXs ? "0.9rem" : "1rem", color: "#666" },
          }}
        />
      </Paper>

      {/* Questions */}
      {questions.map((q) => {
        const isFocused = focusedQuestion === q.id;
        const isConditionalOpen = conditionalLogicOpen === q.id;

        return (
          <Paper
            key={q.id}
            sx={isFocused ? focusedQuestionStyles : questionBoxStyles}
            onClick={() => setFocusedQuestion(q.id)}
          >
            {/* Question Header */}
            <Box sx={{ display: "flex", alignItems: "center", p: isXs ? 1 : 1.5, flexDirection: isXs ? "column" : "row" }}>
              <TextField
                variant="standard"
                fullWidth
                value={q.label}
                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                onFocus={() => setFocusedQuestion(q.id)}
                placeholder="Question"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: isXs ? "0.9rem" : "1rem", fontWeight: 500 },
                }}
                sx={{ mb: isXs ? 1 : 0 }}
              />
              <Box sx={{ ml: isXs ? 0 : 2, width: isXs ? "100%" : "auto" }}>
                <Select
                  value={q.type}
                  onChange={(e) => handleQuestionTypeChange(q.id, e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: isXs ? "100%" : 140,
                    bgcolor: "#faf8ff",
                    fontSize: isXs ? "0.9rem" : "1rem",
                  }}
                >
                  {Object.entries(fieldTypes || {}).map(([type, config]) => (
                    <MenuItem key={type} value={type} sx={{ fontSize: isXs ? "0.9rem" : "1rem" }}>
                      <span>{config.label}</span>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            <Divider />

            {/* Options */}
            {(q.type === "multipleChoice" ||
              q.type === "radio" ||
              q.type === "checkbox" ||
              q.type === "select") && (
              <Box>
                {(q.options || []).map((opt, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", p: isXs ? 0.5 : 1 }}>
                    {renderOptionControl(q.type)}
                    <TextField
                      variant="standard"
                      value={opt}
                      onChange={(e) => handleOptionChange(q.id, i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: isXs ? "0.8rem" : "0.9rem" },
                      }}
                      sx={{ width: isXs ? "100%" : 260, mr: 1, ml: 1 }}
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

            {/* Text Preview */}
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

            {/* Conditional Logic */}
            {isConditionalOpen && (
              <Box sx={{ px: isXs ? 1 : 3, pb: isXs ? 1 : 2 }}>
                <Paper sx={{ p: isXs ? 1 : 2 }}>
                  <ConditionalLogic
                    field={q}
                    allFields={questions}
                    onChange={(updatedField) =>
                      handleConditionalLogicChange(q.id, updatedField)
                    }
                  />
                </Paper>
              </Box>
            )}

            {/* Footer */}
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

                  <Typography variant="body2" sx={{ fontSize: isXs ? "0.75rem" : "0.875rem", mr: 1 }}>
                    Required
                  </Typography>
                  <Switch
                    size="small"
                    checked={q.required || false}
                    onChange={() => handleToggleRequired(q.id)}
                  />

                  <Tooltip title="More options">
                    <IconButton size="small" onClick={(e) => handleOpenMenu(e, q.id)}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            )}

            {/* Menu */}
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor && menuQuestionId === q.id)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleToggleConditionalLogic}>
                <ListItemIcon>
                  <RuleOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}>
                  {conditionalLogicOpen === q.id ? "Hide conditions" : "Add condition"}
                </ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleDuplicateField(q.id)}>
                <ListItemIcon>
                  <ContentCopyOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}>Duplicate</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleDeleteField(q.id)} sx={{ color: "error.main" }}>
                <ListItemIcon>
                  <DeleteOutlineOutlined fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Paper>
        );
      })}

      {questions.length === 0 && (
        <Box sx={{ mt: isXs ? 3 : 6, textAlign: "center", color: "#666" }}>
          <Typography variant="h6" sx={{ fontSize: isXs ? "1rem" : "1.25rem" }}>
            Click "+" to add your first question
          </Typography>
        </Box>
      )}
    </Box>
  );
}