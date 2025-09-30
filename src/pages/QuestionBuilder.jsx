// import React, { useState } from "react";
// import {
//   Box, AppBar, Toolbar, IconButton, Button, InputBase, Tooltip,
//   Paper, Typography, TextField, Select, MenuItem, Divider, Radio,
//   Switch, Checkbox, FormControl, InputLabel, Modal, Backdrop, Fade,
//   Menu, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
//   useTheme, useMediaQuery,
// } from "@mui/material";
// import {
//   TextSnippet as TextSnippetIcon,
//   Undo as UndoIcon,
//   Redo as RedoIcon,
//   Visibility as VisibilityIcon,
//   MoreVert as MoreVertIcon,
//   ContentCopyOutlined,
//   DeleteOutlineOutlined,
//   RuleOutlined,
//   DragIndicator as DragIndicatorIcon,
//   CloudUploadOutlined,
//   Close as CloseIcon,
// } from "@mui/icons-material";
// import { Icon } from "@iconify/react";
// import MiniSideBar from "../components/MiniSideBar/MiniSideBar";
// import ConditionalLogic from "../components/ConditionalLogic";
// import { fieldTypes, createNewField } from "../utils/formSchema";
// import FormPreview from "../components/FormPreview";

// // Your existing styles (unchanged)
// const containerStyles = {
//   minHeight: "80vh",
//   width: "100%",
//   bgcolor: "#efebf9",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   pt: { xs: 2, sm: 3, md: 4 },
// };

// const headerStyles = {
//   width: { xs: "100%", sm: "90%", md: 780, lg: 900 },
//   maxWidth: "95%",
//   mb: { xs: 1, sm: 2 },
//   borderRadius: 3,
//   p: { xs: 2, sm: 3 },
//   bgcolor: "white",
//   position: "relative",
//   boxShadow: "0 2px 8px rgba(112,73,180,0.08)",
// };

// const questionBoxStyles = {
//   width: { xs: "100%", sm: "90%", md: 780, lg: 900 },
//   maxWidth: "95%",
//   mb: { xs: 1, sm: 2 },
//   borderRadius: 3,
//   bgcolor: "white",
//   position: "relative",
//   boxShadow: "0 2px 8px rgba(112,73,180,0.08)",
//   borderLeft: { xs: "2px solid #4b34b4", sm: "4px solid #4b34b4" },
//   transition: "opacity 0.2s, transform 0.2s",
// };

// const focusedQuestionStyles = {
//   ...questionBoxStyles,
//   borderLeft: { xs: "4px solid #4285f4", sm: "6px solid #4285f4" },
//   boxShadow: "0 4px 12px rgba(112,73,180,0.15)",
// };

// // Mobile Modal Styles
// const mobileModalStyle = {
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   right: 0,
//   bgcolor: 'background.paper',
//   borderTopLeftRadius: 16,
//   borderTopRightRadius: 16,
//   boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
//   p: 0,
//   outline: 'none',
//   maxHeight: '60vh',
//   overflow: 'hidden',
// };

// const mobileModalHeader = {
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   p: 2,
//   borderBottom: '1px solid #e0e0e0',
// };

// export default function QuestionBuilder() {
//   const theme = useTheme();
//   const isXs = useMediaQuery(theme.breakpoints.down("sm"));
//   const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
//   const isXsOrSm = useMediaQuery(theme.breakpoints.down("sm"));

//   const [schema, setSchema] = useState({
//     title: "",
//     description: "",
//     fields: [],
//     thankYouMessage: "",
//     bannerImage: "",
//   });

//   const [undoStack, setUndoStack] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);
//   const [showPreview, setShowPreview] = useState(false);

//   // FormBuilder internal states
//   const [focusedQuestion, setFocusedQuestion] = useState(null);
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [menuQuestionId, setMenuQuestionId] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [conditionalLogicOpen, setConditionalLogicOpen] = useState(null);
//   const [draggedId, setDraggedId] = useState(null);
//   const [uploadError, setUploadError] = useState(null);

//   // Deep clone helper
//   const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

//   // Schema change handler combined with undo stack management
//   const handleSchemaChange = (newFields, newThankYouMessage) => {
//     setUndoStack((prev) => [...prev, deepClone(schema)]);
//     setRedoStack([]);
//     setSchema({
//       ...schema,
//       fields: deepClone(newFields),
//       thankYouMessage: newThankYouMessage,
//     });
//   };

//   // Undo/Redo handlers from Index combined
//   const handleUndo = () => {
//     if (!undoStack.length) return;
//     const previous = undoStack[undoStack.length - 1];
//     setUndoStack((prev) => prev.slice(0, prev.length - 1));
//     setRedoStack((prev) => [deepClone(schema), ...prev]);
//     setSchema(previous);
//   };

//   const handleRedo = () => {
//     if (!redoStack.length) return;
//     const next = redoStack[0];
//     setRedoStack((prev) => prev.slice(1));
//     setUndoStack((prev) => [...prev, deepClone(schema)]);
//     setSchema(next);
//   };

//   // Handlers for title, description, thank you message
//   const handleTitleChange = (newTitle) => setSchema({ ...schema, title: newTitle });
//   const handleDescriptionChange = (newDescription) => setSchema({ ...schema, description: newDescription });
//   const handleThankYouMessageChange = (newMessage) => setSchema({ ...schema, thankYouMessage: newMessage });

//   // All handlers (updateField, addQuestion, toggleRequired, etc.) from FormBuilder
//   const handleUpdateField = (id, updatedField) => {
//     const newQuestions = schema.fields.map((q) => (q.id === id ? { ...q, ...updatedField } : q));
//     handleSchemaChange(newQuestions, schema.thankYouMessage);
//   };

//   const handleAddQuestion = () => {
//     const newQuestion = createNewField("multipleChoice");
//     handleSchemaChange([...schema.fields, newQuestion], schema.thankYouMessage);
//     setFocusedQuestion(newQuestion.id);
//   };

//   const handleQuestionTypeChange = (id, newType) => {
//     let newField = createNewField(newType, id);
//     const existing = schema.fields.find((q) => q.id === id);
//     if (existing) {
//       newField = {
//         ...newField,
//         label: existing.label,
//         required: existing.required,
//         conditions: existing.conditions || [],
//       };
//     }
//     console.log(`Changing field ${id} type to ${newType}:`, newField); // Debug log
//     handleUpdateField(id, newField);
//   };

//   const handleQuestionChange = (id, value) => handleUpdateField(id, { label: value });

//   const handleOptionChange = (questionId, optionIndex, value) => {
//     const question = schema.fields.find((q) => q.id === questionId);
//     if (!question) return;
//     const newOptions = [...(question.options || [])];
//     newOptions[optionIndex] = value;
//     handleUpdateField(questionId, { options: newOptions });
//   };

//   const handleAddOption = (questionId) => {
//     const question = schema.fields.find((q) => q.id === questionId);
//     if (!question) return;
//     const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
//     handleUpdateField(questionId, { options: newOptions });
//   };

//   const handleAddOtherOption = (questionId) => {
//     const question = schema.fields.find((q) => q.id === questionId);
//     if (!question) return;
//     const currentOptions = question.options || [];
//     if (currentOptions.includes("Other")) return;
//     const newOptions = [...currentOptions, "Other"];
//     handleUpdateField(questionId, { options: newOptions });
//   };

//   const handleRemoveOption = (questionId, optionIndex) => {
//     const question = schema.fields.find((q) => q.id === questionId);
//     if (!question || !question.options || question.options.length <= 1) return;
//     const newOptions = question.options.filter((_, idx) => idx !== optionIndex);
//     handleUpdateField(questionId, { options: newOptions });
//   };

//   const handleDuplicateField = (id) => {
//     const q = schema.fields.find((q) => q.id === id);
//     if (!q) return;
//     const copy = { ...q, id: `field_${Date.now()}`, label: q.label };
//     const index = schema.fields.findIndex((item) => item.id === id);
//     const newQuestions = [...schema.fields];
//     newQuestions.splice(index + 1, 0, copy);
//     handleSchemaChange(newQuestions, schema.thankYouMessage);
//     handleCloseMenu();
//   };

//   const handleDeleteField = (id) => {
//     if (window.confirm("Delete question?")) {
//       const filtered = schema.fields.filter((q) => q.id !== id);
//       handleSchemaChange(filtered, schema.thankYouMessage);
//       if (focusedQuestion === id) setFocusedQuestion(null);
//       if (conditionalLogicOpen === id) setConditionalLogicOpen(null);
//     }
//     handleCloseMenu();
//   };

//   const handleToggleRequired = (id) => {
//     const question = schema.fields.find((q) => q.id === id);
//     handleUpdateField(id, { required: !question?.required });
//   };

//   // Banner Image Upload & Remove 
//   const handleBannerImageChange = (newImage) => {
//     setUndoStack((prev) => [...prev, deepClone(schema)]);
//     setRedoStack([]);
//     setSchema({ ...schema, bannerImage: newImage });
//   };

//   const handleBannerImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file type
//     const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
//     if (!validImageTypes.includes(file.type)) {
//       setUploadError("Please upload a valid image file (JPEG, PNG, or GIF).");
//       return;
//     }

//     // Validate file size (e.g., max 5MB)
//     const maxSize = 5 * 1024 * 1024; // 5MB in bytes
//     if (file.size > maxSize) {
//       setUploadError("Image size exceeds 5MB limit.");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (readerEvent) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
        
//         // Define desired aspect ratio (e.g., 16:9 for a wide banner)
//         // Your current display size is around 4:1 (800x200), so let's aim for that.
//         const targetWidth = 800;
//         const targetHeight = 200;

//         let width = img.width;
//         let height = img.height;

//         // Resize logic to maintain aspect ratio and fit into target dimensions
//         if (width > height) {
//           if (width > targetWidth) {
//             height = height * (targetWidth / width);
//             width = targetWidth;
//           }
//         } else {
//           if (height > targetHeight) {
//             width = width * (targetHeight / height);
//             height = targetHeight;
//           }
//         }
        
//         canvas.width = width;
//         canvas.height = height;
        
//         // Draw image on canvas and get the new base64 string
//         ctx.drawImage(img, 0, 0, width, height);
//         const dataUrl = canvas.toDataURL(file.type);

//         setUploadError(null);
//         handleBannerImageChange(dataUrl); // Pass the RESIZED base64 string
//       };
//       img.onerror = () => {
//         setUploadError("Failed to process the image.");
//       };
//       img.src = readerEvent.target.result;
//     };
//     reader.onerror = () => {
//       setUploadError("Failed to read the image file.");
//     };
//     reader.readAsDataURL(file);
//   };

//   // Handler for question-specific file upload
//   const handleQuestionFileUpload = (event, id) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       handleUpdateField(id, { fileName: file.name, fileData: reader.result });
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveQuestionFile = (id) => {
//     handleUpdateField(id, { fileName: null, fileData: null });
//   };

//   // Handler to remove banner image
//   const handleRemoveBanner = () => {
//     handleBannerImageChange(null);
//     setUploadError(null);
//   };

//   // Drag-and-drop handlers
//   const handleDragStart = (e, id) => {
//     setDraggedId(id);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragEnd = () => setDraggedId(null);

//   const handleDrop = (e, targetId) => {
//     e.preventDefault();
//     if (draggedId && draggedId !== targetId) {
//       const newQuestions = [...schema.fields];
//       const draggedIndex = schema.fields.findIndex((q) => q.id === draggedId);
//       const targetIndex = schema.fields.findIndex((q) => q.id === targetId);
//       if (draggedIndex === -1 || targetIndex === -1) return;
//       const [draggedQuestion] = newQuestions.splice(draggedIndex, 1);
//       newQuestions.splice(targetIndex, 0, draggedQuestion);
//       handleSchemaChange(newQuestions, schema.thankYouMessage);
//     }
//     setDraggedId(null);
//   };

//   const handleDragOver = (e) => e.preventDefault();

//   const handleToggleConditionalLogic = () => {
//     if (conditionalLogicOpen === menuQuestionId) setConditionalLogicOpen(null);
//     else setConditionalLogicOpen(menuQuestionId);
//     handleCloseMenu();
//   };

//   const handleConditionalLogicChange = (questionId, updatedField) => {
//     handleUpdateField(questionId, updatedField);
//   };

//   // Menus open/close handlers
//   const handleOpenMenu = (event, questionId) => {
//     event.stopPropagation();
//     setMenuQuestionId(questionId);
//     if (isXs) setMobileMenuOpen(true);
//     else setMenuAnchor(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setMenuAnchor(null);
//     setMenuQuestionId(null);
//     setMobileMenuOpen(false);
//   };

//   const handlePreviewToggle = () => setShowPreview(!showPreview);

//   const renderOptionControl = (type) => {
//     switch (type) {
//       case "radio":
//         return <Radio disabled size={isXs ? "small" : "medium"} sx={{ p: isXs ? 0.25 : 0.5 }} />;
//       case "checkbox":
//         return <Checkbox disabled size={isXs ? "small" : "medium"} sx={{ p: isXs ? 0.25 : 0.5 }} />;
//       case "multipleChoice":
//         return (
//           <FormControl sx={{ minWidth: isXs ? "100%" : 260, mt: 1 }}>
//             <InputLabel shrink>Multiple Choice</InputLabel>
//             <Select
//               multiple
//               disabled
//               displayEmpty
//               value={[]}
//               renderValue={() => "Select multiple options"}
//               size={isXs ? "small" : "medium"}
//               sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}
//             >
//               <MenuItem disabled value="">
//                 Select options
//               </MenuItem>
//             </Select>
//           </FormControl>
//         );
//       default:
//         return null;
//     }
//   };

//   // Mobile Menu Component
//   const MobileMenu = () => (
//     <Modal
//       open={mobileMenuOpen}
//       onClose={handleCloseMenu}
//       closeAfterTransition
//       BackdropComponent={Backdrop}
//       BackdropProps={{
//         timeout: 300,
//         sx: { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
//       }}
//     >
//       <Fade in={mobileMenuOpen}>
//         <Box sx={mobileModalStyle}>
//           {/* Modal Header */}
//           <Box sx={mobileModalHeader}>
//             <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
//               Question options
//             </Typography>
//             <IconButton onClick={handleCloseMenu} size="small">
//               <CloseIcon />
//             </IconButton>
//           </Box>
          
//           {/* Menu Items */}
//           <List sx={{ py: 0 }}>
//             <ListItem disablePadding>
//               <ListItemButton 
//                 onClick={handleToggleConditionalLogic}
//                 sx={{ 
//                   py: 2,
//                   px: 3,
//                   '&:hover': { bgcolor: '#f5f5f5' }
//                 }}
//               >
//                 <ListItemIcon sx={{ minWidth: 40 }}>
//                   <RuleOutlined sx={{ color: '#5f6368' }} />
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary={conditionalLogicOpen === menuQuestionId ? "Hide conditions" : "Add condition"}
//                   sx={{ 
//                     '& .MuiListItemText-primary': { 
//                       fontSize: '1rem',
//                       color: '#3c4043' 
//                     } 
//                   }}
//                 />
//               </ListItemButton>
//             </ListItem>
            
//             <Divider sx={{ mx: 3 }} />
            
//             <ListItem disablePadding>
//               <ListItemButton 
//                 onClick={() => handleDuplicateField(menuQuestionId)}
//                 sx={{ 
//                   py: 2,
//                   px: 3,
//                   '&:hover': { bgcolor: '#f5f5f5' }
//                 }}
//               >
//                 <ListItemIcon sx={{ minWidth: 40 }}>
//                   <ContentCopyOutlined sx={{ color: '#5f6368' }} />
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary="Duplicate"
//                   sx={{ 
//                     '& .MuiListItemText-primary': { 
//                       fontSize: '1rem',
//                       color: '#3c4043' 
//                     } 
//                   }}
//                 />
//               </ListItemButton>
//             </ListItem>
            
//             <Divider sx={{ mx: 3 }} />
            
//             <ListItem disablePadding>
//               <ListItemButton 
//                 onClick={() => handleDeleteField(menuQuestionId)}
//                 sx={{ 
//                   py: 2,
//                   px: 3,
//                   '&:hover': { bgcolor: '#fce8e6' }
//                 }}
//               >
//                 <ListItemIcon sx={{ minWidth: 40 }}>
//                   <DeleteOutlineOutlined sx={{ color: '#d93025' }} />
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary="Delete"
//                   sx={{ 
//                     '& .MuiListItemText-primary': { 
//                       fontSize: '1rem',
//                       color: '#d93025' 
//                     } 
//                   }}
//                 />
//               </ListItemButton>
//             </ListItem>
//           </List>
//         </Box>
//       </Fade>
//     </Modal>
//   );

//   if (showPreview) {
//     // Render preview header + preview page with schema
//     return (
//       <Box sx={{ position: "relative" }}>
//         <AppBar position="sticky" elevation={0} sx={{ background: "white", borderBottom: "1px solid #dadce0", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", px: { xs: 1, sm: 1.5, md: 2 }, py: { xs: 0.5, sm: 0.75, md: 1 } }}>
//           <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: { xs: "48px !important", sm: "52px !important", md: "56px !important" }, alignItems: "center" }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
//               <TextSnippetIcon sx={{ color: "#7049b4", fontSize: { xs: 24, sm: 26, md: 28 } }} />
//               <Typography sx={{ fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" }, fontWeight: 500, color: "#202124" }}>
//                 {schema.title || "Untitled Form"} - Preview
//               </Typography>
//             </Box>
//             <Button variant="outlined" onClick={handlePreviewToggle} sx={{ color: "#7049b4", borderColor: "#7049b4", textTransform: "none", fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" }, px: { xs: 1, sm: 1.5, md: 2 } }}>
//               Back to Edit
//             </Button>
//           </Toolbar>
//         </AppBar>
       
//         <FormPreview previewData={schema}/>
//       </Box>
//     );
//   }

//   // Full rendering of navbar + FormBuilder UI inside combined component
//   return (
//     <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#efebf9" }}>
//       {/* Navbar (imported from your index) */}
//       <AppBar position="sticky" elevation={0} sx={{
//         background: "white",
//         borderTopLeftRadius: "19px",
//         borderTopRightRadius: "19px",
//         boxShadow: "none",
//         px: { xs: 1, sm: 1.5, md: 2 },
//         pt: { xs: 0.5, sm: 0.75, md: 1 },
//       }}>
//         <Toolbar sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           minHeight: { xs: "48px !important", sm: "52px !important", md: "56px !important" },
//           gap: { xs: 0.5, sm: 1, md: 2 },
//         }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
//             <TextSnippetIcon sx={{ color: "#7049b4", fontSize: { xs: 24, sm: 28, md: 32 } }} />
//             {!isXsOrSm && (
//               <InputBase
//                 value={schema.title || ""}
//                 onChange={(e) => handleTitleChange(e.target.value)}
//                 placeholder="Untitled Form"
//                 sx={{ fontSize: { md: "1.8rem" }, fontWeight: 600 }}
//               />
//             )}
//             <Tooltip title="Save Form" arrow>
                
//               <IconButton aria-label="save" size="small" sx={{ ml: { xs: 0, sm: 0, md: "-44px" } }}>
//                 <Icon
//                   icon="mdi:content-save-check-outline"
//                   style={{ color: "#4e6ca7ff", fontSize: 30 }}
//                 />
//               </IconButton>
//             </Tooltip>
//           </Box>
//           <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1, md: 1.5 } }}>
//             <Tooltip title="Undo" arrow>
//               <span>
//                 <IconButton onClick={handleUndo} disabled={undoStack.length === 0} size="small">
//                   <UndoIcon sx={{ color: undoStack.length === 0 ? "#ccc" : "#7049b4", fontSize: { xs: 18, sm: 20, md: 24 } }} />
//                 </IconButton>
//               </span>
//             </Tooltip>
//             <Tooltip title="Redo" arrow>
//               <span>
//                 <IconButton onClick={handleRedo} disabled={redoStack.length === 0} size="small">
//                   <RedoIcon sx={{ color: redoStack.length === 0 ? "#ccc" : "#7049b4", fontSize: { xs: 18, sm: 20, md: 24 } }} />
//                 </IconButton>
//               </span>
//             </Tooltip>
//             <Tooltip title="Preview" arrow>
//               <IconButton onClick={handlePreviewToggle} size="small">
//                 <VisibilityIcon sx={{ color: "#959698", fontSize: { xs: 18, sm: 20, md: 24 } }} />
//               </IconButton>
//             </Tooltip>
//             <Button
//               variant="contained"
//               sx={{
//                 background: "#7049b4",
//                 color: "white",
//                 fontWeight: 500,
//                 px: { xs: 1, sm: 1.5, md: 2.5 },
//                 minHeight: { sm: 32, md: 36 },
//                 height: { xs: "25px" },
//                 fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
//                 textTransform: "none",
//                 boxShadow: "0 1px 4px rgba(60,64,67,.13)",
//                 "&:hover": { background: "#5a36a1" },
//               }}
//             >
//               Publish
//             </Button>
//             <IconButton size="small">
//               <MoreVertIcon sx={{ color: "#959698", fontSize: { xs: 18, sm: 20, md: 24 } }} />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Form Builder CONTENT copied intact from your FormBuilder code above */}
//       <Box sx={containerStyles}>
//         <MiniSideBar onAddQuestion={handleAddQuestion} />

//         {/* Header */}
//         <Paper sx={headerStyles}>
//           {/* Banner Image Upload and Preview */}
//           <Box sx={{ mb: isXs ? 2 : 3, position: "relative" }}>
//             {schema.bannerImage ? (
//               <Box
//                 sx={{
//                   width: "100%",
//                   height: { xs: 70, sm: 100, md: 200 },
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   mb: 2,
//                   position: "relative",
//                 }}
//               >
//                 <img
//                   src={schema.bannerImage}
//                   alt="Banner"
//                   style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                   onError={() => {
//                     setUploadError("Failed to load the image.");
//                     handleBannerImageChange(null);
//                   }}
//                 />
//                 <Button
//                   variant="contained"
//                   size="small"
//                   sx={{
//                     position: "absolute",
//                     top: 8,
//                     right: 8,
//                     bgcolor: "rgba(0, 0, 0, 0.6)",
//                     color: "white",
//                     "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
//                   }}
//                   onClick={handleRemoveBanner}
//                 >
//                   Remove
//                 </Button>
//               </Box>
//             ) : (
//               <Box
//                 sx={{
//                   width: "100%",
//                   height: { xs: 100, sm: 150, md: 200 },
//                   borderRadius: 2,
//                   border: "2px dashed #ccc",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   bgcolor: "#fafafa",
//                   mb: 2,
//                 }}
//               >
//                 <Button
//                   variant="outlined"
//                   component="label"
//                   startIcon={<CloudUploadOutlined />}
//                   sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}
//                 >
//                   Upload Banner Image
//                   <input
//                     type="file"
//                     accept="image/jpeg,image/png,image/gif"
//                     hidden
//                     onChange={handleBannerImageUpload}
//                   />
//                 </Button>
//               </Box>
//             )}
//             {uploadError && (
//               <Typography color="error" sx={{ fontSize: isXs ? "0.8rem" : "0.9rem", mt: 1 }}>
//                 {uploadError}
//               </Typography>
//             )}
//           </Box>
//           <TextField
//             variant="standard"
//             fullWidth
//             value={schema.title}
//             onChange={(e) => handleTitleChange(e.target.value)}
//             placeholder="Untitled form"
//             InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "1.5rem" : isSm ? "1.8rem" : "2rem" } }}
//           />
//           <Divider sx={{ my: isXs ? 1 : 2 }} />
//           <TextField
//             variant="standard"
//             fullWidth
//             value={schema.description}
//             onChange={(e) => handleDescriptionChange(e.target.value)}
//             placeholder="Form description"
//             InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "0.9rem" : "1rem", color: "#666" } }}
//           />
//         </Paper>

//         {/* Submission Message Box */}
//         <Paper sx={headerStyles}>
//           <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: isXs ? 1 : 2, fontSize: isXs ? "1rem" : "1.1rem" }}>
//             Submission message
//           </Typography>
//           <Divider sx={{ my: isXs ? 1 : 2 }} />
//           <TextField
//             variant="standard"
//             fullWidth
//             value={schema.thankYouMessage}
//             onChange={(e) => handleThankYouMessageChange(e.target.value)}
//             placeholder="Thank you for submitting"
//             InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "0.9rem" : "1rem", color: "#666" } }}
//           />
//         </Paper>

//         {/* Questions */}
//         {schema.fields.map((q) => {
//           const isFocused = focusedQuestion === q.id;
//           const isConditionalOpen = conditionalLogicOpen === q.id;
//           const isDragging = draggedId === q.id;

//           return (
//             <Paper
//               key={q.id}
//               sx={{
//                 ...(isFocused ? focusedQuestionStyles : questionBoxStyles),
//                 ...(isDragging && {
//                   opacity: 0.5,
//                   transform: "rotate(2deg)",
//                 }),
//               }}
//               draggable
//               onDragStart={(e) => handleDragStart(e, q.id)}
//               onDragEnd={handleDragEnd}
//               onDragOver={handleDragOver}
//               onDrop={(e) => handleDrop(e, q.id)}
//               onClick={() => setFocusedQuestion(q.id)}
//             >
//               {/* Question Header */}
//               <Box sx={{ display: "flex", alignItems: "center", p: isXs ? 1 : 1.5, flexDirection: isXs ? "column" : "row" }}>
//                 <Tooltip title="Drag to reorder">
//                   <DragIndicatorIcon
//                     className="drag-handle"
//                     sx={{
//                       color: "#959698",
//                       fontSize: isXs ? 20 : 24,
//                       mr: isXs ? 0 : 1,
//                       cursor: "grab",
//                       "&:active": { cursor: "grabbing" },
//                     }}
//                   />
//                 </Tooltip>
//                 <TextField
//                   variant="standard"
//                   fullWidth
//                   value={q.label}
//                   onChange={(e) => handleQuestionChange(q.id, e.target.value)}
//                   onFocus={() => setFocusedQuestion(q.id)}
//                   placeholder="Question"
//                   InputProps={{
//                     disableUnderline: true,
//                     sx: { fontSize: isXs ? "0.9rem" : "1rem", fontWeight: 500 },
//                   }}
//                   sx={{ mb: isXs ? 1 : 0, mr: isXs ? 0 : 2 }}
//                 />
//                 <Box sx={{ width: isXs ? "100%" : "auto" }}>
//                   <Select
//                     value={q.type}
//                     onChange={(e) => handleQuestionTypeChange(q.id, e.target.value)}
//                     variant="outlined"
//                     size="small"
//                     sx={{ minWidth: isXs ? "100%" : 140, bgcolor: "#faf8ff", fontSize: isXs ? "0.9rem" : "1rem" }}
//                   >
//                     {Object.entries(fieldTypes || {}).map(([type, config]) => (
//                       <MenuItem key={type} value={type} sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}>
//                         <span>{config.label}</span>
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </Box>
//               </Box>

//               <Divider />

//               {/* Options */}
//               {(q.type === "radio" || q.type === "select" || q.type === "multipleChoice") && (
//                 <Box>
//                   {(q.options || []).map((opt, i) => (
//                     <Box key={i} sx={{ display: "flex", alignItems: "center", p: isXs ? 0.5 : 1 }}>
//                       {q.type === "multipleChoice" ? (
//                         <Checkbox disabled size={isXs ? "small" : "medium"} sx={{ p: isXs ? 0.25 : 0.5 }} />
//                       ) : (
//                         renderOptionControl(q.type)
//                       )}
//                       <TextField
//                         variant="standard"
//                         value={opt}
//                         onChange={(e) => handleOptionChange(q.id, i, e.target.value)}
//                         placeholder={`Option ${i + 1}`}
//                         InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "0.8rem" : "0.9rem" } }}
//                         sx={{ width: isXs ? "100%" : 260, mr: 1, ml: 1, bgcolor: "#efebf9" }}
//                       />
//                       {q.options && q.options.length > 1 && (
//                         <IconButton
//                           size="small"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRemoveOption(q.id, i);
//                           }}
//                         >
//                           <DeleteOutlineOutlined fontSize="small" />
//                         </IconButton>
//                       )}
//                     </Box>
//                   ))}

//                   <Box sx={{ p: isXs ? 1 : 2, pl: isXs ? 2 : 4 }}>
//                     <Button
//                       variant="text"
//                       size="small"
//                       sx={{ color: "#7049b4", fontSize: isXs ? "0.8rem" : "0.9rem" }}
//                       onClick={() => handleAddOption(q.id)}
//                     >
//                       Add option
//                     </Button>
//                     <Typography component="span" sx={{ mx: 1, color: "#5c646d", fontSize: isXs ? "0.8rem" : "0.9rem" }}>
//                       or
//                     </Typography>
//                     <Button
//                       variant="text"
//                       size="small"
//                       sx={{ color: "#7049b4", fontSize: isXs ? "0.8rem" : "0.9rem" }}
//                       onClick={() => handleAddOtherOption(q.id)}
//                     >
//                       Add "Other"
//                     </Button>
//                   </Box>
//                 </Box>
//               )}

//               {/* Text/Number Preview */}
//               {(q.type === "text" || q.type === "number") && (
//                 <Box sx={{ p: isXs ? 1 : 2, pl: isXs ? 2 : 4 }}>
//                   <TextField
//                     disabled
//                     variant="standard"
//                     placeholder={q.placeholder || "Your answer"}
//                     InputProps={{ disableUnderline: true }}
//                     sx={{ width: isXs ? "100%" : "50%", fontSize: isXs ? "0.8rem" : "0.9rem" }}
//                   />
//                 </Box>
//               )}
//               {/* checkbox Preview */}

//               {(q.type === "checkbox") && (
//                 <Box sx={{ p: isXs ? 1 : 2, pl: isXs ? 2 : 4 }}></Box>

//               )}
//               {/* File Upload Preview */}
//               {q.type === "uploadFile" && (
//                 <Box sx={{ p: isXs ? 1 : 2, pl: isXs ? 2 : 4 }}>
//                   {q.fileData ? (
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
//                       <CloudUploadOutlined color="action" />
//                       <Typography variant="body1" sx={{ flexGrow: 1 }}>{q.fileName}</Typography>
//                       <Button onClick={() => handleRemoveQuestionFile(q.id)} color="error" size="small">
//                         Remove
//                       </Button>
//                     </Box>
//                   ) : (
//                     <Button
//                       variant="outlined"
//                       component="label"
//                       startIcon={<CloudUploadOutlined />}
//                       sx={{ width: isXs ? "100%" : "50%", fontSize: isXs ? "0.8rem" : "0.9rem" }}
//                     >
//                       Upload File
//                       <input
//                         type="file"
//                         hidden
//                         onChange={(e) => handleQuestionFileUpload(e, q.id)}
//                       />
//                     </Button>
//                   )}
//                 </Box>
//               )}

//               {/* Conditional Logic */}
//               {isConditionalOpen && (
//                 <Box sx={{ px: isXs ? 1 : 3, pb: isXs ? 1 : 2 }}>
//                   <Paper sx={{ p: isXs ? 1 : 2 }}>
//                     <ConditionalLogic
//                       field={q}
//                       allFields={schema.fields}
//                       onChange={(updatedField) => handleConditionalLogicChange(q.id, updatedField)}
//                     />
//                   </Paper>
//                 </Box>
//               )}

//               {/* Footer */}
//               {isFocused && (
//                 <>
//                   <Divider />
//                   <Box sx={{ display: "flex", justifyContent: "flex-end", p: isXs ? 1 : 1.5, gap: isXs ? 0.25 : 0.5 }}>
//                     <Tooltip title="Duplicate">
//                       <IconButton size="small" onClick={() => handleDuplicateField(q.id)}>
//                         <ContentCopyOutlined fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                       <IconButton
//                         size="small"
//                         onClick={() => handleDeleteField(q.id)}
//                         sx={{ "&:hover": { color: "error.main" } }}
//                       >
//                         <DeleteOutlineOutlined fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                     <Divider orientation="vertical" flexItem sx={{ mx: isXs ? 0.5 : 1 }} />
//                     <Typography variant="body2" sx={{ fontSize: isXs ? "0.75rem" : "0.875rem", mr: 1 }}>
//                       Required
//                     </Typography>
//                     <Switch
//                       size="small"
//                       checked={q.required || false}
//                       onChange={() => handleToggleRequired(q.id)}
//                     />
//                     <Tooltip title="More options">
//                       <IconButton size="small" onClick={(e) => handleOpenMenu(e, q.id)}>
//                         <MoreVertIcon fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                 </>
//               )}

//               {/* Desktop Menu - Only show on non-mobile screens */}
//               {!isXs && (
//                 <Menu
//                   anchorEl={menuAnchor}
//                   open={Boolean(menuAnchor && menuQuestionId === q.id)}
//                   onClose={handleCloseMenu}
//                 >
//                   <MenuItem onClick={handleToggleConditionalLogic}>
//                     <ListItemIcon>
//                       <RuleOutlined fontSize="small" />
//                     </ListItemIcon>
//                     <ListItemText sx={{ fontSize: "0.9rem" }}>
//                       {conditionalLogicOpen === q.id ? "Hide conditions" : "Add condition"}
//                     </ListItemText>
//                   </MenuItem>
//                   <MenuItem onClick={() => handleDuplicateField(q.id)}>
//                     <ListItemIcon>
//                       <ContentCopyOutlined fontSize="small" />
//                     </ListItemIcon>
//                     <ListItemText sx={{ fontSize: "0.9rem" }}>Duplicate</ListItemText>
//                   </MenuItem>
//                   <Divider />
//                   <MenuItem onClick={() => handleDeleteField(q.id)} sx={{ color: "error.main" }}>
//                     <ListItemIcon>
//                       <DeleteOutlineOutlined fontSize="small" color="error" />
//                     </ListItemIcon>
//                     <ListItemText sx={{ fontSize: "0.9rem" }}>Delete</ListItemText>
//                   </MenuItem>
//                 </Menu>
//               )}
//             </Paper>
//           );
//         })}

//         {/* Mobile Menu Modal */}
//         <MobileMenu />

//         {schema.fields.length === 0 && (
//           <Box sx={{ mt: isXs ? 3 : 6, textAlign: "center", color: "#666" }}>
//             <Typography variant="h6" sx={{ fontSize: isXs ? "1rem" : "1.25rem" }}>
//               Click "+" to add your first question
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, AppBar, Toolbar, IconButton, Button, InputBase, Tooltip,
  Paper, Typography, TextField, Select, MenuItem, Divider, Radio,
  Switch, Checkbox, FormControl, InputLabel, Modal, Backdrop, Fade,
  Menu, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  useTheme, useMediaQuery, CircularProgress,
} from "@mui/material";
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
import { useParams } from "react-router-dom";
import MiniSideBar from "../components/MiniSideBar/MiniSideBar";
import ConditionalLogic from "../components/ConditionalLogic";
import FormPreview from "../components/FormPreview";
import { fieldTypes, createNewField } from "../utils/formSchema";
import {
  setSchema, setUndoStack, setRedoStack, setShowPreview,
  setFocusedQuestion, setMenuAnchor, setMenuQuestionId,
  setMobileMenuOpen, setConditionalLogicOpen, setDraggedId,
  setUploadError, fetchForm, createForm,
} from "../redux/features/formCreationSlice";

// Styles (unchanged)
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

const mobileModalStyle = {
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
};

const mobileModalHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  p: 2,
  borderBottom: "1px solid #e0e0e0",
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
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isXsOrSm = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { formId } = useParams();

  // Redux state
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
    uploadError,
    loading,
  } = useSelector((state) => state.formCreation);

  // Loader state
  const [showLoader, setShowLoader] = useState(false);

  // Deep clone helper
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  // Fetch form data on mount if formId exists
  useEffect(() => {
    if (formId) {
      setShowLoader(true);
      dispatch(fetchForm(formId)).finally(() => {
        setTimeout(() => setShowLoader(false), 5000);
      });
    }
  }, [formId, dispatch]);

  // Schema change handler with undo stack
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

  // Handlers
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
    if (window.confirm("Delete question?")) {
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

  const handleBannerImageChange = (newImage) => {
    dispatch(setUndoStack([...undoStack, deepClone(schema)]));
    dispatch(setRedoStack([]));
    dispatch(setSchema({ ...schema, bannerImage: newImage }));
  };

  const handleBannerImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
      dispatch(setUploadError("Please upload a valid image file (JPEG, PNG, or GIF)."));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      dispatch(setUploadError("Image size exceeds 5MB limit."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const targetWidth = 800;
        const targetHeight = 200;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > targetWidth) {
            height = height * (targetWidth / width);
            width = targetWidth;
          }
        } else {
          if (height > targetHeight) {
            width = width * (targetHeight / height);
            height = targetHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type);

        dispatch(setUploadError(null));
        handleBannerImageChange(dataUrl);
      };
      img.onerror = () => dispatch(setUploadError("Failed to process the image."));
      img.src = readerEvent.target.result;
    };
    reader.onerror = () => dispatch(setUploadError("Failed to read the image file."));
    reader.readAsDataURL(file);
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

  const handleRemoveBanner = () => {
    handleBannerImageChange(null);
    dispatch(setUploadError(null));
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

  const handleSaveForm = () => {
    setShowLoader(true);
    dispatch(createForm(schema)).finally(() => {
      setTimeout(() => setShowLoader(false), 5000);
    });
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
        <Box sx={mobileModalStyle}>
          <Box sx={mobileModalHeader}>
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
              >
                <Icon
                  icon="mdi:content-save-check-outline"
                  style={{ color: "#4e6ca7ff", fontSize: 30 }}
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
                height: { xs: "25px" },
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
      </AppBar>

      <Box sx={containerStyles}>
        <MiniSideBar onAddQuestion={handleAddQuestion} />
        <Paper sx={headerStyles}>
          <Box sx={{ mb: isXs ? 2 : 3, position: "relative" }}>
            {schema.bannerImage ? (
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 70, sm: 100, md: 200 },
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 2,
                  position: "relative",
                }}
              >
                <img
                  src={schema.bannerImage}
                  alt="Banner"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={() => {
                    dispatch(setUploadError("Failed to load the image."));
                    handleBannerImageChange(null);
                  }}
                />
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
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadOutlined />}
                  sx={{ fontSize: isXs ? "0.8rem" : "0.9rem" }}
                >
                  Upload Banner Image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    hidden
                    onChange={handleBannerImageUpload}
                  />
                </Button>
              </Box>
            )}
            {uploadError && (
              <Typography color="error" sx={{ fontSize: isXs ? "0.8rem" : "0.9rem", mt: 1 }}>
                {uploadError}
              </Typography>
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

        <Paper sx={headerStyles}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: isXs ? 1 : 2, fontSize: isXs ? "1rem" : "1.1rem" }}>
            Submission message
          </Typography>
          <Divider sx={{ my: isXs ? 1 : 2 }} />
          <TextField
            variant="standard"
            fullWidth
            value={schema.thankYouMessage}
            onChange={(e) => handleThankYouMessageChange(e.target.value)}
            placeholder="Thank you for submitting"
            InputProps={{ disableUnderline: true, sx: { fontSize: isXs ? "0.9rem" : "1rem", color: "#666" } }}
          />
        </Paper>

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
