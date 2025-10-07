// // import React, { useState } from "react";
// // import { Box, AppBar, Toolbar, Tabs, Tab, IconButton, Button, InputBase, Tooltip, useTheme, useMediaQuery } from "@mui/material";
// // import {
// //   TextSnippet as TextSnippetIcon,
// //   StarOutline as StarOutlineIcon,
// //   Visibility as VisibilityIcon,
// //   MoreVert as MoreVertIcon,
// //   Undo as UndoIcon,
// //   Redo as RedoIcon,
// // } from "@mui/icons-material";
// // import { Icon } from "@iconify/react";
// // import FormBuilder from "../components/FormBuilder";
// // import AdminPanel from "../components/AdminPanel";
// // import FromPreview from "../components/FormPreview";

// // export default function Index() {
// //   const theme = useTheme();
// //   const isXsOrSm = useMediaQuery(theme.breakpoints.down("sm"));

// //   const [schema, setSchema] = useState({
// //     title: "",
// //     description: "",
// //     fields: [],
// //     thankYouMessage: "",
// //     bannerImage: "", // Banner image is now part of schema
// //   });

// //   const [undoStack, setUndoStack] = useState([]);
// //   const [redoStack, setRedoStack] = useState([]);
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [showPreview, setShowPreview] = useState(false);

// //   const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// //   const handleSchemaChange = (newFields, newThankYouMessage) => {
// //     setUndoStack((prev) => [...prev, deepClone(schema)]);
// //     setRedoStack([]);
// //     setSchema({
// //       ...schema,
// //       fields: deepClone(newFields),
// //       thankYouMessage: newThankYouMessage,
// //     });
// //   };

// //   const handleUndo = () => {
// //     if (undoStack.length === 0) return;
// //     const previous = undoStack[undoStack.length - 1];
// //     setUndoStack((prev) => prev.slice(0, prev.length - 1));
// //     setRedoStack((prev) => [deepClone(schema), ...prev]);
// //     setSchema(previous);
// //   };

// //   const handleRedo = () => {
// //     if (redoStack.length === 0) return;
// //     const next = redoStack[0];
// //     setRedoStack((prev) => prev.slice(1));
// //     setUndoStack((prev) => [...prev, deepClone(schema)]);
// //     setSchema(next);
// //   };

// //   const handleTabChange = (_, newValue) => setActiveTab(newValue);

// //   const handleTitleChange = (newTitle) => setSchema({ ...schema, title: newTitle });
// //   const handleDescriptionChange = (newDescription) => setSchema({ ...schema, description: newDescription });
// //   const handleThankYouMessageChange = (newMessage) => setSchema({ ...schema, thankYouMessage: newMessage });

// //   // Updated handler for banner image - now updates schema directly
// //   const handleBannerImageChange = (newImage) => {
// //     setUndoStack((prev) => [...prev, deepClone(schema)]);
// //     setRedoStack([]);
// //     setSchema({ ...schema, bannerImage: newImage });
// //   };

// //   const handlePreviewToggle = () => {
// //     setShowPreview(!showPreview);
// //   };

// //   if (showPreview) {
// //     return (
// //       <Box sx={{ position: "relative" }}>
// //         <AppBar
// //           position="sticky"
// //           elevation={0}
// //           sx={{
// //             background: "white",
// //             borderBottom: "1px solid #dadce0",
// //             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
// //             px: { xs: 1, sm: 1.5, md: 2 },
// //             py: { xs: 0.5, sm: 0.75, md: 1 },
// //           }}
// //         >
// //           <Toolbar
// //             sx={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               minHeight: { xs: "48px !important", sm: "52px !important", md: "56px !important" },
// //               alignItems: "center",
// //             }}
// //           >
// //             <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
// //               <TextSnippetIcon sx={{ color: "#7049b4", fontSize: { xs: 24, sm: 26, md: 28 } }} />
// //               <Box sx={{ fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" }, fontWeight: 500, color: "#202124" }}>
// //                 {schema?.title || "Untitled Form"} - Preview
// //               </Box>
// //             </Box>
// //             <Button
// //               variant="outlined"
// //               onClick={handlePreviewToggle}
// //               sx={{
// //                 color: "#7049b4",
// //                 borderColor: "#7049b4",
// //                 textTransform: "none",
// //                 fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
// //                 px: { xs: 1, sm: 1.5, md: 2 },
// //                 "&:hover": {
// //                   borderColor: "#5a36a1",
// //                   backgroundColor: "rgba(112, 73, 180, 0.04)",
// //                 },
// //               }}
// //             >
// //               Back to Edit
// //             </Button>
// //           </Toolbar>
// //         </AppBar>
// //         {/* Pass the entire schema */}
// //         <FromPreview previewData={schema} />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#efebf9" }}>
// //       <AppBar
// //         position="sticky"
// //         elevation={0}
// //         sx={{
// //           background: "white",
// //           borderTopLeftRadius: "19px",
// //           borderTopRightRadius: "19px",
// //           boxShadow: "none",
// //           px: { xs: 1, sm: 1.5, md: 2 },
// //           pt: { xs: 0.5, sm: 0.75, md: 1 },
// //         }}
// //       >
// //         <Toolbar
// //           sx={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             minHeight: { xs: "48px !important", sm: "52px !important", md: "56px !important" },
// //             gap: { xs: 0.5, sm: 1, md: 2 },
// //           }}
// //         >
// //           <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
// //             <TextSnippetIcon sx={{ color: "#7049b4", fontSize: { xs: 24, sm: 28, md: 32 } }} />
// //             {!isXsOrSm && (
// //               <InputBase
// //                 value={schema.title || ""}
// //                 onChange={(e) => handleTitleChange(e.target.value)}
// //                 placeholder="Untitled Form"
// //                 sx={{ fontSize: { md: "1.8rem" }, fontWeight: 600 }}
// //               />
// //             )}
// //             <Tooltip title="Save Form" arrow>
// //               <IconButton aria-label="save" size="small" sx={{ ml: { xs: 0, sm: 0, md: "-44px" } }}>
// //                 <Icon
// //                   icon="mdi:content-save-check-outline"
// //                   style={{
// //                     color: "#959698",
// //                     fontSize: theme.breakpoints.down("sm")
// //                       ? "18px"
// //                       : theme.breakpoints.down("md")
// //                       ? "20px"
// //                       : theme.breakpoints.down("lg")
// //                       ? "24px"
// //                       : theme.breakpoints.down("xl")
// //                       ? "26px"
// //                       : "32px",
// //                   }}
// //                 />
// //               </IconButton>
// //             </Tooltip>
// //           </Box>
// //           <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1, md: 1.5 } }}>
// //             <Tooltip title="Undo" arrow>
// //               <span>
// //                 <IconButton onClick={handleUndo} disabled={undoStack.length === 0} size="small">
// //                   <UndoIcon sx={{ color: undoStack.length === 0 ? "#ccc" : "#7049b4", fontSize: { xs: 18, sm: 20, md: 24 } }} />
// //                 </IconButton>
// //               </span>
// //             </Tooltip>
// //             <Tooltip title="Redo" arrow>
// //               <span>
// //                 <IconButton onClick={handleRedo} disabled={redoStack.length === 0} size="small">
// //                   <RedoIcon sx={{ color: redoStack.length === 0 ? "#ccc" : "#7049b4", fontSize: { xs: 18, sm: 20, md: 24 } }} />
// //                 </IconButton>
// //               </span>
// //             </Tooltip>
// //             <Tooltip title="Preview" arrow>
// //               <IconButton onClick={handlePreviewToggle} size="small">
// //                 <VisibilityIcon sx={{ color: "#959698", fontSize: { xs: 18, sm: 20, md: 24 } }} />
// //               </IconButton>
// //             </Tooltip>
// //             <Button
// //               variant="contained"
// //               sx={{
// //                 background: "#7049b4",
// //                 color: "white",
// //                 fontWeight: 500,
// //                 px: { xs: 1, sm: 1.5, md: 2.5 },
// //                 minHeight: { sm: 32, md: 36 },
// //                 height: { xs: "25px" },
// //                 fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
// //                 textTransform: "none",
// //                 boxShadow: "0 1px 4px rgba(60,64,67,.13)",
// //                 "&:hover": { background: "#5a36a1" },
// //               }}
// //             >
// //               Publish
// //             </Button>
// //             <IconButton size="small">
// //               <MoreVertIcon sx={{ color: "#959698", fontSize: { xs: 18, sm: 20, md: 24 } }} />
// //             </IconButton>
// //           </Box>
// //         </Toolbar>
// //         <Tabs
// //           value={activeTab}
// //           onChange={handleTabChange}
// //           centered
// //           sx={{ "& .MuiTab-root": { fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" } } }}
// //         >
// //           <Tab label="Responses" />
// //           <Tab label="Questions" />
// //         </Tabs>
// //       </AppBar>
// //       {activeTab === 1 && (
// //         <FormBuilder
// //           questions={schema.fields || []}
// //           onQuestionsChange={handleSchemaChange}
// //           title={schema.title || ""}
// //           onTitleChange={handleTitleChange}
// //           description={schema.description || ""}
// //           onDescriptionChange={handleDescriptionChange}
// //           thankYouMessage={schema.thankYouMessage}
// //           onThankYouMessageChange={handleThankYouMessageChange}
// //           bannerImage={schema.bannerImage} // Now passing from schema
// //           onBannerImageChange={handleBannerImageChange}
// //         />
// //       )}
// //       {activeTab === 0 && <AdminPanel />}
// //     </Box>
// //   );
// // }


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   AppBar,
//   Toolbar,
//   Tabs,
//   Tab,
//   IconButton,
//   Button,
//   InputBase,
//   Tooltip,
//   useTheme,
//   useMediaQuery,
//   Typography,
//   Paper,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import {
//   TextSnippet as TextSnippetIcon,
//   Undo as UndoIcon,
//   Redo as RedoIcon,
//   Visibility as VisibilityIcon,
//   MoreVert as MoreVertIcon,
//   Assignment,
//   TrendingUp,
// } from "@mui/icons-material";
// import { Icon } from "@iconify/react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useNavigate } from "react-router-dom";

// import FormBuilder from "../components/FormBuilder";
// import FormPreview from "../components/FormPreview";
// import { exportToCsv, exportToExcel, exportToPdf } from "../utils/exportCsv";
// import tabledata from "../data/tabledata.json";

// export default function Index() {
//   const theme = useTheme();
//   const isXsOrSm = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();

//   // --- Form Schema ---
//   const [schema, setSchema] = useState({
//     title: "",
//     description: "",
//     fields: [],
//     thankYouMessage: "",
//     bannerImage: "",
//   });

//   // --- Undo / Redo ---
//   const [undoStack, setUndoStack] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);

//   // --- Tabs ---
//   const [activeTab, setActiveTab] = useState(0); // 0 = Responses default
//   const [showPreview, setShowPreview] = useState(false);

//   // --- Responses Data ---
//   const [responses, setResponses] = useState([]);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   // --- Export Menu ---
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   // --- Load demo data ---
//   useEffect(() => {
//     setResponses(tabledata);
//   }, []);

//   // --- Submission Stats ---
//   const totalSubmissions = responses.length;
//   const todaySubmissions = responses.filter((r) => {
//     const today = new Date();
//     const ts = new Date(r.timeStamp);
//     return ts.toDateString() === today.toDateString();
//   }).length;

//   // --- Export ---
//   const handleExport = (type) => {
//     if (type === "csv") exportToCsv(columns, responses);
//     if (type === "excel") exportToExcel(columns, responses);
//     if (type === "pdf") exportToPdf(columns, responses);
//     handleMenuClose();
//   };

//   // --- Columns for DataGrid ---
//   const columns = [
//     { field: "sl_no", headerName: "Sl No", width: 80 },
//     { field: "title", headerName: "Form Title", width: 200 },
//     {
//       field: "description",
//       headerName: "Description",
//       width: 220,
//       renderCell: (params) => (
//         <Tooltip title={params.value || ""}>
//           <span>{params.value}</span>
//         </Tooltip>
//       ),
//     },
//     { field: "timeStamp", headerName: "Time Stamp", width: 160 },
//     {
//       field: "isPublished",
//       headerName: "Is Published",
//       width: 130,
//       renderCell: (params) => (
//         <span style={{ color: params.value ? "green" : "red" }}>
//           {params.value ? "Yes" : "No"}
//         </span>
//       ),
//     },
//     { field: "noOfSubmission", headerName: "No. of Submissions", width: 170 },
//     {
//       field: "edit",
//       headerName: "Edit Form",
//       width: 140,
//       renderCell: () => (
//         <Button
//           onClick={() => navigate("/questions")}
//           sx={{
//             color: "#673ab7",
//             fontWeight: 500,
//             textTransform: "none",
//           }}
//         >
//           Edit
//         </Button>
//       ),
//     },
//     {
//       field: "view",
//       headerName: "View Response",
//       width: 160,
//       renderCell: () => (
//         <Button
//           onClick={() => navigate("/viewResponse")}
//           sx={{
//             color: "#1976d2",
//             fontWeight: 500,
//             textTransform: "none",
//           }}
//         >
//           View
//         </Button>
//       ),
//     },
//   ];

//   // --- Schema helpers ---
//   const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
//   const handleSchemaChange = (fields, message) => {
//     setUndoStack((prev) => [...prev, deepClone(schema)]);
//     setRedoStack([]);
//     setSchema({
//       ...schema,
//       fields: deepClone(fields),
//       thankYouMessage: message,
//     });
//   };

//   const handleUndo = () => {
//     if (!undoStack.length) return;
//     const prevSchema = undoStack.pop();
//     setRedoStack((r) => [deepClone(schema), ...r]);
//     setSchema(prevSchema);
//   };
//   const handleRedo = () => {
//     if (!redoStack.length) return;
//     const next = redoStack.shift();
//     setUndoStack((u) => [...u, deepClone(schema)]);
//     setSchema(next);
//   };

//   // --- Preview ---
//   const handlePreviewToggle = () => setShowPreview(!showPreview);

//   if (showPreview) {
//     return (
//       <Box sx={{ position: "relative" }}>
//         <AppBar
//           position="sticky"
//           elevation={0}
//           sx={{
//             background: "white",
//             borderBottom: "1px solid #dadce0",
//             px: 2,
//             py: 1,
//           }}
//         >
//           <Toolbar sx={{ justifyContent: "space-between" }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <TextSnippetIcon sx={{ color: "#7049b4" }} />
//               <Typography variant="subtitle1">
//                 {schema.title || "Untitled Form"} - Preview
//               </Typography>
//             </Box>
//             <Button
//               variant="outlined"
//               onClick={handlePreviewToggle}
//               sx={{
//                 color: "#7049b4",
//                 borderColor: "#7049b4",
//                 textTransform: "none",
//               }}
//             >
//               Back to Edit
//             </Button>
//           </Toolbar>
//         </AppBar>
//         <FormPreview previewData={schema} />
//       </Box>
//     );
//   }

//   // --- Main ---
//   return (
//     <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#efebf9" }}>
//       {/* Header */}
//       <AppBar
//         position="sticky"
//         elevation={0}
//         sx={{
//           background: "white",
//           borderTopLeftRadius: "19px",
//           borderTopRightRadius: "19px",
//           boxShadow: "none",
//           px: 2,
//           pt: 1,
//         }}
//       >
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <TextSnippetIcon sx={{ color: "#7049b4", fontSize: 30 }} />
//             {!isXsOrSm && (
//               <InputBase
//                 value={schema.title || ""}
//                 onChange={(e) =>
//                   setSchema({ ...schema, title: e.target.value })
//                 }
//                 placeholder="Untitled Form"
//                 sx={{ fontSize: "1.6rem", fontWeight: 600 }}
//               />
//             )}
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Tooltip title="Undo">
//               <span>
//                 <IconButton
//                   onClick={handleUndo}
//                   disabled={!undoStack.length}
//                   size="small"
//                 >
//                   <UndoIcon
//                     sx={{
//                       color: undoStack.length ? "#7049b4" : "#ccc",
//                       fontSize: 22,
//                     }}
//                   />
//                 </IconButton>
//               </span>
//             </Tooltip>
//             <Tooltip title="Redo">
//               <span>
//                 <IconButton
//                   onClick={handleRedo}
//                   disabled={!redoStack.length}
//                   size="small"
//                 >
//                   <RedoIcon
//                     sx={{
//                       color: redoStack.length ? "#7049b4" : "#ccc",
//                       fontSize: 22,
//                     }}
//                   />
//                 </IconButton>
//               </span>
//             </Tooltip>
//             <Tooltip title="Preview">
//               <IconButton onClick={handlePreviewToggle} size="small">
//                 <VisibilityIcon sx={{ color: "#959698", fontSize: 22 }} />
//               </IconButton>
//             </Tooltip>
//             <Button
//               variant="contained"
//               sx={{
//                 background: "#7049b4",
//                 color: "white",
//                 textTransform: "none",
//                 "&:hover": { background: "#5a36a1" },
//               }}
//             >
//               Publish
//             </Button>
//             <IconButton size="small">
//               <MoreVertIcon sx={{ color: "#959698" }} />
//             </IconButton>
//           </Box>
//         </Toolbar>

//         {/* Tabs */}
//         <Tabs
//           value={activeTab}
//           onChange={(_, v) => setActiveTab(v)}
//           centered
//           sx={{
//             "& .MuiTab-root": {
//               fontSize: "0.9rem",
//               fontWeight: 500,
//               textTransform: "none",
//             },
//           }}
//         >
//           <Tab label="Responses" />
//           <Tab label="Questions" />
//         </Tabs>
//       </AppBar>

//       {/* Questions Tab */}
//       {activeTab === 1 && (
//         <FormBuilder
//           questions={schema.fields}
//           onQuestionsChange={handleSchemaChange}
//           title={schema.title}
//           description={schema.description}
//           thankYouMessage={schema.thankYouMessage}
//           bannerImage={schema.bannerImage}
//         />
//       )}

//       {/* Responses Tab */}
//       {activeTab === 0 && (
//         <Box p={3}>
//           <Box sx={{ maxWidth: 850, mx: "auto" }}>
//             <Paper
//               elevation={1}
//               sx={{
//                 p: 2,
//                 mb: 2,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Typography variant="h6">
//                 {totalSubmissions} Submissions
//               </Typography>
//               <Button
//                 variant="outlined"
//                 onClick={handleMenuClick}
//                 sx={{ textTransform: "none", fontWeight: 500 }}
//                 disabled={!totalSubmissions}
//               >
//                 EXPORT ALL DATA
//               </Button>
//               <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//                 <MenuItem onClick={() => handleExport("csv")}>CSV</MenuItem>
//                 <MenuItem onClick={() => handleExport("excel")}>Excel</MenuItem>
//                 <MenuItem onClick={() => handleExport("pdf")}>PDF</MenuItem>
//               </Menu>
//             </Paper>

//             {/* Stats */}
//             <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
//               <Grid container spacing={2}>
//                 {[
//                   {
//                     label: "Total Submissions",
//                     value: totalSubmissions,
//                     icon: <Assignment sx={{ color: "primary.main" }} />,
//                   },
//                   {
//                     label: "Today's Submissions",
//                     value: todaySubmissions,
//                     icon: <TrendingUp sx={{ color: "green" }} />,
//                   },
//                 ].map((s, i) => (
//                   <Grid item xs={12} sm={6} key={i}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 2,
//                         p: 2,
//                         bgcolor: "#f5f5f5",
//                         borderRadius: 2,
//                         justifyContent: "center",
//                       }}
//                     >
//                       {s.icon}
//                       <Box>
//                         <Typography variant="subtitle2">{s.label}</Typography>
//                         <Typography variant="h5">{s.value}</Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Paper>

//             {/* DataGrid */}
//             {totalSubmissions === 0 ? (
//               <Paper
//                 sx={{ p: 4, textAlign: "center", color: "gray" }}
//                 elevation={1}
//               >
//                 <Assignment sx={{ fontSize: 40, mb: 1, color: "gray" }} />
//                 <Typography variant="h6">No submissions yet</Typography>
//               </Paper>
//             ) : (
//               <Paper sx={{ height: 500, width: "100%", p: 2 }} elevation={1}>
//                 <Typography variant="h6" gutterBottom>
//                   Forms Table
//                 </Typography>
//                 <DataGrid
//                   rows={responses}
//                   columns={columns}
//                   getRowId={(r) => r.sl_no}
//                   pageSize={5}
//                   rowsPerPageOptions={[5, 10, 20]}
//                   onRowClick={(p) => setSelectedSubmission(p.row)}
//                 />
//               </Paper>
//             )}

//             {/* Dialog */}
//             <Dialog
//               open={!!selectedSubmission}
//               onClose={() => setSelectedSubmission(null)}
//               fullWidth
//               maxWidth="sm"
//             >
//               <DialogTitle>Form Details</DialogTitle>
//               <DialogContent dividers>
//                 {selectedSubmission &&
//                   columns.map((col) => (
//                     <Box key={col.field} sx={{ mb: 1 }}>
//                       <strong>{col.headerName}:</strong>{" "}
//                       {selectedSubmission[col.field]?.toString()}
//                     </Box>
//                   ))}
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={() => setSelectedSubmission(null)}>Close</Button>
//               </DialogActions>
//             </Dialog>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// }




import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  TextSnippet as TextSnippetIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Assignment,
  TrendingUp,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import FormBuilder from "../components/FormBuilder";
import FormPreview from "../components/FormPreview";
import { exportToCsv, exportToExcel, exportToPdf } from "../utils/exportCsv";
import { fetchFormsList } from "../redux/features/Adminformslice"; // Import the action

// Replace with your actual token
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjc1MywiaWF0IjoxNzU5NzQ4NDE1LCJleHAiOjE3NTk4MzQ4MTV9.8h81eFC6oS17Su3vh9yY3MYuz7zku6GpGPfXYZs-_DE";

export default function Index() {
  const theme = useTheme();
  const isXsOrSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { forms, loading, error } = useSelector((state) => state.adminForm);

  // --- Form Schema ---
  const [schema, setSchema] = useState({
    title: "",
    description: "",
    fields: [],
    thankYouMessage: "",
    bannerImage: "",
  });

  // --- Undo / Redo ---
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // --- Tabs ---
  const [activeTab, setActiveTab] = useState(0); // 0 = Responses default
  const [showPreview, setShowPreview] = useState(false);

  // --- Selected Form ---
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // --- Export Menu ---
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // --- Fetch forms on component mount ---
  useEffect(() => {
    // Only fetch if we have a token
    if (AUTH_TOKEN) {
      dispatch(fetchFormsList(AUTH_TOKEN));
    } else {
      console.error("No authentication token found");
    }
  }, [dispatch]);

  // Debug: Log forms data when it changes
  useEffect(() => {
    console.log("Forms from Redux:", forms);
    console.log("Responses for DataGrid:", responses);
  }, [forms]);

  // Retry fetch function
  const handleRetry = () => {
    dispatch(fetchFormsList(AUTH_TOKEN));
  };

  // --- Transform forms data for DataGrid ---
  const responses = forms.map((form) => ({
    sl_no: form.sl_no, // Use sl_no from API
    id: form.id,
    title: form.title || "Untitled Form",
    description: form.description || "No description",
    timeStamp: new Date(form.createdAt).toLocaleString(),
    isPublished: true, // You can add this field to your API response
    noOfSubmission: 0, // You need to add this from your API or calculate it
  }));

  // --- Submission Stats ---
  const totalSubmissions = responses.length;
  const todaySubmissions = responses.filter((r) => {
    const today = new Date();
    const ts = new Date(r.timeStamp);
    return ts.toDateString() === today.toDateString();
  }).length;

  // --- Export ---
  const handleExport = (type) => {
    if (type === "csv") exportToCsv(columns, responses);
    if (type === "excel") exportToExcel(columns, responses);
    if (type === "pdf") exportToPdf(columns, responses);
    handleMenuClose();
  };

  // --- Columns for DataGrid ---
  const columns = [
    { field: "sl_no", headerName: "Sl No", width: 80 },
    { field: "title", headerName: "Form Title", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 220,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    { field: "timeStamp", headerName: "Time Stamp", width: 160 },
    {
      field: "isPublished",
      headerName: "Is Published",
      width: 130,
      renderCell: (params) => (
        <span style={{ color: params.value ? "green" : "red" }}>
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    { field: "noOfSubmission", headerName: "No. of Submissions", width: 170 },
    {
      field: "edit",
      headerName: "Edit Form",
      width: 140,
      renderCell: (params) => (
        <Button
          onClick={() => navigate(`/questions/${params.row.id}`)}
          sx={{
            color: "#673ab7",
            fontWeight: 500,
            textTransform: "none",
          }}
        >
          Edit
        </Button>
      ),
    },
   {
  field: "view",
  headerName: "View Response",
  width: 100,
  renderCell: (params) => (
    <Tooltip title="View Response">
      <IconButton
        onClick={() => navigate(`/viewResponse/${params.row.id}`)}
        sx={{ color: "#1976d2" }}
      >
        <VisibilityIcon />
      </IconButton>
    </Tooltip>
  ),
},

  ];

  // --- Schema helpers ---
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
  const handleSchemaChange = (fields, message) => {
    setUndoStack((prev) => [...prev, deepClone(schema)]);
    setRedoStack([]);
    setSchema({
      ...schema,
      fields: deepClone(fields),
      thankYouMessage: message,
    });
  };

  const handleUndo = () => {
    if (!undoStack.length) return;
    const prevSchema = undoStack.pop();
    setRedoStack((r) => [deepClone(schema), ...r]);
    setSchema(prevSchema);
  };
  const handleRedo = () => {
    if (!redoStack.length) return;
    const next = redoStack.shift();
    setUndoStack((u) => [...u, deepClone(schema)]);
    setSchema(next);
  };

  // --- Preview ---
  const handlePreviewToggle = () => setShowPreview(!showPreview);

  if (showPreview) {
    return (
      <Box sx={{ position: "relative" }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "white",
            borderBottom: "1px solid #dadce0",
            px: 2,
            py: 1,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextSnippetIcon sx={{ color: "#7049b4" }} />
              <Typography variant="subtitle1">
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

  // --- Main ---
  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#efebf9" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "white",
          borderTopLeftRadius: "19px",
          borderTopRightRadius: "19px",
          boxShadow: "none",
          px: 2,
          pt: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextSnippetIcon sx={{ color: "#7049b4", fontSize: 30 }} />
            {!isXsOrSm && (
              <InputBase
                value={schema.title || ""}
                onChange={(e) =>
                  setSchema({ ...schema, title: e.target.value })
                }
                placeholder="Untitled Form"
                sx={{ fontSize: "1.6rem", fontWeight: 600 }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Undo">
              <span>
                <IconButton
                  onClick={handleUndo}
                  disabled={!undoStack.length}
                  size="small"
                >
                  <UndoIcon
                    sx={{
                      color: undoStack.length ? "#7049b4" : "#ccc",
                      fontSize: 22,
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo">
              <span>
                <IconButton
                  onClick={handleRedo}
                  disabled={!redoStack.length}
                  size="small"
                >
                  <RedoIcon
                    sx={{
                      color: redoStack.length ? "#7049b4" : "#ccc",
                      fontSize: 22,
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Preview">
              <IconButton onClick={handlePreviewToggle} size="small">
                <VisibilityIcon sx={{ color: "#959698", fontSize: 22 }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              sx={{
                background: "#7049b4",
                color: "white",
                textTransform: "none",
                "&:hover": { background: "#5a36a1" },
              }}
            >
              Publish
            </Button>
            <IconButton size="small">
              <MoreVertIcon sx={{ color: "#959698" }} />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          centered
          sx={{
            "& .MuiTab-root": {
              fontSize: "0.9rem",
              fontWeight: 500,
              textTransform: "none",
            },
          }}
        >
          <Tab label="Responses" />
          <Tab label="Questions" />
        </Tabs>
      </AppBar>

      {/* Questions Tab */}
      {activeTab === 1 && (
        <FormBuilder
          questions={schema.fields}
          onQuestionsChange={handleSchemaChange}
          title={schema.title}
          description={schema.description}
          thankYouMessage={schema.thankYouMessage}
          bannerImage={schema.bannerImage}
        />
      )}

      {/* Responses Tab */}
      {activeTab === 0 && (
        <Box p={3}>
          <Box sx={{ maxWidth: 850, mx: "auto" }}>
            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={handleRetry}>
                    Retry
                  </Button>
                }
              >
                <strong>Connection Error:</strong> {error}
                <br />
                <Typography variant="caption">
                  Please check if the backend server is running at http://172.16.3.210:5000
                </Typography>
              </Alert>
            )}

            <Paper
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                {totalSubmissions} Forms
              </Typography>
              <Button
                variant="outlined"
                onClick={handleMenuClick}
                sx={{ textTransform: "none", fontWeight: 500 }}
                disabled={!totalSubmissions || loading}
              >
                EXPORT ALL DATA
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleExport("csv")}>CSV</MenuItem>
                <MenuItem onClick={() => handleExport("excel")}>Excel</MenuItem>
                <MenuItem onClick={() => handleExport("pdf")}>PDF</MenuItem>
              </Menu>
            </Paper>

            {/* Stats */}
            <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
              <Grid container spacing={2}>
                {[
                  {
                    label: "Total Forms",
                    value: totalSubmissions,
                    icon: <Assignment sx={{ color: "primary.main" }} />,
                  },
                  {
                    label: "Created Today",
                    value: todaySubmissions,
                    icon: <TrendingUp sx={{ color: "green" }} />,
                  },
                ].map((s, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: 2,
                        justifyContent: "center",
                      }}
                    >
                      {s.icon}
                      <Box>
                        <Typography variant="subtitle2">{s.label}</Typography>
                        <Typography variant="h5">{s.value}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Loading State */}
            {loading ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                elevation={1}
              >
                <CircularProgress sx={{ color: "#7049b4" }} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Loading forms...
                </Typography>
              </Paper>
            ) : totalSubmissions === 0 ? (
              <Paper
                sx={{ p: 4, textAlign: "center", color: "gray" }}
                elevation={1}
              >
                <Assignment sx={{ fontSize: 40, mb: 1, color: "gray" }} />
                <Typography variant="h6">No forms found</Typography>
              </Paper>
            ) : (
              <Paper sx={{ height: 500, width: "100%", p: 2 }} elevation={1}>
                <Typography variant="h6" gutterBottom>
                  Forms Table
                </Typography>
                <DataGrid
                  rows={responses}
                  columns={columns}
                  getRowId={(r) => r.id}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 20]}
                  onRowClick={(p) => setSelectedSubmission(p.row)}
                  disableRowSelectionOnClick
                />
              </Paper>
            )}

            {/* Dialog */}
            <Dialog
              open={!!selectedSubmission}
              onClose={() => setSelectedSubmission(null)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Form Details</DialogTitle>
              <DialogContent dividers>
                {selectedSubmission &&
                  columns.slice(0, 6).map((col) => (
                    <Box key={col.field} sx={{ mb: 1 }}>
                      <strong>{col.headerName}:</strong>{" "}
                      {selectedSubmission[col.field]?.toString()}
                    </Box>
                  ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedSubmission(null)}>Close</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      )}
    </Box>
  );
}

