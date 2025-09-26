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
import { Icon } from "@iconify/react";
import FormBuilder from "../components/FormBuilder";
import AdminPanel from "../components/AdminPanel";


export default function Index() {
  const theme = useTheme();
  const isXsOrSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [schema, setSchema] = useState({
    title: "",
    description: "",
    fields: [],
    thankYouMessage: "",
  });

  // const [schema ,setSchema] = useState({})

  //  ADD A NEW STATE FOR THE BANNER IMAGE
  const [bannerImage, setBannerImage] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const handleSchemaChange = (newFields, newThankYouMessage) => {
    setUndoStack((prev) => [
      ...prev,
      { schema: deepClone(schema), thankYouMessage: schema.thankYouMessage, bannerImage: bannerImage },
    ]);
    setRedoStack([]);
    setSchema({
      ...schema,
      fields: deepClone(newFields),
      thankYouMessage: newThankYouMessage,
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [{ schema: deepClone(schema), thankYouMessage: schema.thankYouMessage, bannerImage: bannerImage }, ...prev]);
    setSchema(previous.schema);
    setBannerImage(previous.bannerImage); // Restore banner image state
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setUndoStack((prev) => [{ schema: deepClone(schema), thankYouMessage: schema.thankYouMessage, bannerImage: bannerImage }, ...prev]);
    setSchema(next.schema);
    setBannerImage(next.bannerImage); // Restore banner image state
  };

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  const handleTitleChange = (newTitle) => setSchema({ ...schema, title: newTitle });
  const handleDescriptionChange = (newDescription) => setSchema({ ...schema, description: newDescription });
  const handleThankYouMessageChange = (newMessage) => setSchema({ ...schema, thankYouMessage: newMessage });
  
  //  CREATE A NEW HANDLER FOR BANNER IMAGE
  const handleBannerImageChange = (newImage) => {
    // Add to undo stack before state change
    setUndoStack((prev) => [
      ...prev,
      { schema: deepClone(schema), thankYouMessage: schema.thankYouMessage, bannerImage: bannerImage },
    ]);
    setRedoStack([]);
    setBannerImage(newImage);
  };

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
  };

  if (showPreview) {
    return (
      <Box sx={{ position: "relative" }}>
        {/* ... (Preview AppBar code remains the same) */}
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
              <Box sx={{ fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" }, fontWeight: 500, color: "#202124" }}>
                {schema?.title || "Untitled Form"} - Preview
              </Box>
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
          questions={schema.fields || []}
          title={schema.title || "Untitled Form"}
          description={schema.description || ""}
          thankYouMessage={schema.thankYouMessage || "Thank you for your submission!"}
          bannerImage={bannerImage} // Pass the banner image to PreviewPage
        />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#efebf9" }}>
      {/* ... (Main AppBar code remains the same) */}
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
              <IconButton aria-label="save" size="small" sx={{ ml: { xs: 0, sm: 0, md: "-44px" } }}>
                <Icon 
                  icon="mdi:content-save-check-outline" 
                  style={{
                    color: "#959698", 
                    fontSize: theme.breakpoints.down('sm') ? '18px' : 
                      theme.breakpoints.down('md') ? '20px' : 
                      theme.breakpoints.down('lg') ? '24px' : 
                      theme.breakpoints.down('xl') ? '26px' : '32px',
                  }} 
                />
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
            <Button
              variant="contained"
              sx={{
                background: "#7049b4",
                color: "white",
                fontWeight: 500,
                px: { xs: 1, sm: 1.5, md: 2.5 },
                minHeight: { sm: 32, md: 36 },
                height:{xs:"25px"},
                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                textTransform: "none",
                boxShadow: "0 1px 4px rgba(60,64,67,.13)",
                "&:hover": { background: "#5a36a1" },
              }}
            >
              Publish
            </Button>
            <IconButton size="small">
              <MoreVertIcon sx={{ color: "#959698", fontSize: { xs: 18, sm: 20, md: 24 } }} />
            </IconButton>
          </Box>
        </Toolbar>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ "& .MuiTab-root": { fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" } } }}
        >
          <Tab label="Questions" />
          <Tab label="Responses" />
        </Tabs>
      </AppBar>
      {activeTab === 0 && (
        <FormBuilder
          questions={schema.fields || []}
          onQuestionsChange={handleSchemaChange}
          title={schema.title || ""}
          onTitleChange={handleTitleChange}
          description={schema.description || ""}
          onDescriptionChange={handleDescriptionChange}
          thankYouMessage={schema.thankYouMessage}
          onThankYouMessageChange={handleThankYouMessageChange}
          bannerImage={bannerImage} 
          onBannerImageChange={handleBannerImageChange}
        />
      )}
      {activeTab === 1 && <AdminPanel />}
    </Box>
  );
}

