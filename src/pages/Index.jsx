import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Button,
  InputBase,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  TextSnippet as TextSnippetIcon,
  StarOutline as StarOutlineIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from "@mui/icons-material";
import FormBuilder from "../components/FormBuilder";
import AdminPanel from "../components/AdminPanel";
import PreviewPage from "../components/PreviewPage";

export default function Index() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [questions, setQuestions] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [thankYouMessage, setThankYouMessage] = useState("Thank you for your submission!");
  const [showPreview, setShowPreview] = useState(false);

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const handleQuestionsChange = (newQuestions, newThankYouMessage = thankYouMessage) => {
    setUndoStack((prev) => [...prev, { questions: deepClone(questions), thankYouMessage: thankYouMessage }]);
    setRedoStack([]);
    setQuestions(deepClone(newQuestions));
    setThankYouMessage(newThankYouMessage);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [{ questions: deepClone(questions), thankYouMessage: thankYouMessage }, ...prev]);
    setQuestions(previous.questions);
    setThankYouMessage(previous.thankYouMessage);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setUndoStack((prev) => [{ questions: deepClone(questions), thankYouMessage: thankYouMessage }, ...prev]);
    setQuestions(next.questions);
    setThankYouMessage(next.thankYouMessage);
  };

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  const handleTitleChange = (newTitle) => setTitle(newTitle);
  const handleDescriptionChange = (newDescription) => setDescription(newDescription);
  const handleThankYouMessageChange = (newMessage) => setThankYouMessage(newMessage);

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
  };

  if (showPreview) {
    return (
      <Box sx={{ position: "relative" }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "white",
            borderBottom: "1px solid #dadce0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            px: isXs ? 1 : 2,
            py: isXs ? 0.5 : 1,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: isXs ? "48px !important" : "56px !important",
              flexDirection: isXs ? "column" : "row",
              alignItems: isXs ? "center" : "center",
              gap: isXs ? 1 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: isXs ? 1 : 2, flexWrap: isXs ? "wrap" : "nowrap" }}>
              <TextSnippetIcon sx={{ color: "#7049b4", fontSize: isXs ? 24 : 28 }} />
              <Box sx={{ fontSize: isXs ? "0.9rem" : "1rem", fontWeight: 500, color: "#202124" }}>
                {title} - Preview
              </Box>
            </Box>
            <Button
              variant="outlined"
              onClick={handlePreviewToggle}
              sx={{
                color: "#7049b4",
                borderColor: "#7049b4",
                textTransform: "none",
                fontSize: isXs ? "0.8rem" : "0.9rem",
                px: isXs ? 1 : 2,
                "&:hover": {
                  borderColor: "#5a36a1",
                  backgroundColor: "rgba(112, 73, 180, 0.04)",
                },
              }}
            >
              Back to Edit
            </Button>
          </Toolbar>
        </AppBar>
        <PreviewPage
          questions={questions}
          title={title}
          description={description}
          thankYouMessage={thankYouMessage}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#efebf9" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "white",
          borderTopLeftRadius: "19px",
          borderTopRightRadius: "19px",
          boxShadow: "none",
          px: isXs ? 1 : 2,
          pt: isXs ? 0.5 : 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: isXs ? "column" : "row",
            alignItems: isXs ? "center" : "center",
            gap: isXs ? 1 : 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: isXs ? 1 : 2, flexWrap: isXs ? "wrap" : "nowrap" }}>
            <TextSnippetIcon sx={{ color: "#7049b4", fontSize: isXs ? 32 : 40 }} />
            <InputBase
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled Form"
              sx={{ fontSize: isXs ? "1.2rem" : isSm ? "1.5rem" : "1.8rem", fontWeight: 600 }}
            />
            <IconButton aria-label="star" size="small" sx={{ ml: isXs ? "-32px" : "-44px" }}>
              <StarOutlineIcon sx={{ color: "#959698", fontSize: isXs ? 20 : 24 }} />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: isXs ? 0.5 : 1, flexWrap: "wrap" }}>
            <Tooltip title="Undo" arrow>
              <span>
                <IconButton onClick={handleUndo} disabled={undoStack.length === 0} size={isXs ? "small" : "medium"}>
                  <UndoIcon sx={{ color: undoStack.length === 0 ? "#ccc" : "#7049b4", fontSize: isXs ? 20 : 24 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo" arrow>
              <span>
                <IconButton onClick={handleRedo} disabled={redoStack.length === 0} size={isXs ? "small" : "medium"}>
                  <RedoIcon sx={{ color: redoStack.length === 0 ? "#ccc" : "#7049b4", fontSize: isXs ? 20 : 24 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Preview" arrow>
              <IconButton onClick={handlePreviewToggle} sx={{ ml: isXs ? 0 : 1 }} size={isXs ? "small" : "medium"}>
                <VisibilityIcon sx={{ color: "#959698", fontSize: isXs ? 20 : 24 }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              sx={{
                background: "#7049b4",
                color: "white",
                fontWeight: 500,
                px: isXs ? 1.5 : 2.5,
                minHeight: isXs ? 32 : 36,
                fontSize: isXs ? "0.8rem" : "0.9rem",
                textTransform: "none",
                boxShadow: "0 1px 4px rgba(60,64,67,.13)",
                ml: isXs ? 0 : 2,
                "&:hover": { background: "#5a36a1" },
              }}
            >
              Publish
            </Button>
            <IconButton sx={{ ml: isXs ? 0 : 1 }} size={isXs ? "small" : "medium"}>
              <MoreVertIcon sx={{ color: "#959698", fontSize: isXs ? 20 : 24 }} />
            </IconButton>
          </Box>
        </Toolbar>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ "& .MuiTab-root": { fontSize: isXs ? "0.8rem" : "0.9rem" } }}
        >
          <Tab label="Questions" />
          <Tab label="Responses" />
        </Tabs>
      </AppBar>
      {activeTab === 0 && (
        <FormBuilder
          questions={questions}
          onQuestionsChange={handleQuestionsChange}
          title={title}
          onTitleChange={handleTitleChange}
          description={description}
          onDescriptionChange={handleDescriptionChange}
          thankYouMessage={thankYouMessage}
          onThankYouMessageChange={handleThankYouMessageChange}
        />
      )}
      {activeTab === 1 && <AdminPanel />}
    </Box>
  );
}