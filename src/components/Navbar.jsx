// import React, { useState } from "react";
// import {
//   Box,
//   AppBar,
//   Toolbar,
//   Tabs,
//   Tab,
//   InputBase,
//   IconButton,
// } from "@mui/material";
// import {
//   TextSnippet as TextSnippetIcon,
//   StarOutline as StarOutlineIcon,
//   MoreVert as MoreVertIcon,
// } from "@mui/icons-material";
// // import FormBuilder from "../components/FormBuilder";
// // import AdminPanel from "../components/AdminDashboard";
// import AdminDashboard from "../components/AdminDashboard";

// export default function Index() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [title, setTitle] = useState("Untitled Form");
//   const [description, setDescription] = useState("");
//   const [questions, setQuestions] = useState([]);

//   const handleTabChange = (_, newValue) => setActiveTab(newValue);

//   return (
//     <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#efebf9" }}>
//       <AppBar
//         position="static"
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
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           {/* Left Section */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <TextSnippetIcon sx={{ color: "#7049b4", fontSize: 40 }} />
//             <InputBase
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Untitled Form"
//               sx={{ fontSize: 24, fontWeight: 600 }}
//             />
//             <IconButton aria-label="star" size="small" sx={{ ml: "-44px" }}>
//               <StarOutlineIcon sx={{ color: "#959698", fontSize: 24 }} />
//             </IconButton>
//           </Box>

//           {/* Right Section - only menu button now */}
//           <Box>
//             <IconButton sx={{ ml: 1 }}>
//               <MoreVertIcon sx={{ color: "#959698", fontSize: 24 }} />
//             </IconButton>
//           </Box>
//         </Toolbar>

//         {/* Tabs */}
//         <Tabs value={activeTab} onChange={handleTabChange} centered>
//           <Tab label="Questions" />
//           <Tab label="Responses" />
//         </Tabs>
//       </AppBar>

//       {/* Content
//       {activeTab === 0 && (
//         <FormBuilder
//           questions={questions}
//           onQuestionsChange={setQuestions}
//           title={title}
//           onTitleChange={setTitle}
//           description={description}
//           onDescriptionChange={setDescription}
//         />
//       )} */}
//       {activeTab === 1 && <AdminDashboard />}
//     </Box>
//   );
// }
