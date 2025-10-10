import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Fab,
  AppBar,
  Toolbar,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Assignment, Today, Add, Visibility, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchFormsList, softDeleteForm } from "../redux/features/Adminformslice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from '@iconify/react';
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;


export default function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms, loading, error, pagination } = useSelector((state) => state.adminForm);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  

  const [logoInterval] = useState("https://www.intervaledu.com/static/web/images/logo/logo-dark.png");
  const [logoMap] = useState("https://protest.teaminterval.net/static/media/map.7dd1ec7c87cddefd09e4.gif");

  useEffect(() => {
    if (AUTH_TOKEN) {
      dispatch(fetchFormsList({ token: AUTH_TOKEN, page, limit: pageSize }));
    }
  }, [dispatch, page, pageSize]);

  const totalForms = pagination.total || 0;
  const today = new Date().toDateString();
  const todayForms =
    forms?.filter((f) => new Date(f.createdAt).toDateString() === today).length || 0;

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      dispatch(softDeleteForm({ id, token: AUTH_TOKEN })).then(() => {
        dispatch(fetchFormsList({ token: AUTH_TOKEN, page, limit: pageSize }));
      });
    }
  };

  const columns = [
    { field: "id", headerName: "Form ID", width: 120 },
    { field: "title", headerName: "Form Title", width: 220 },
    { field: "description", headerName: "Description", width: 250 },
    {
      field: "isPublished",
      headerName: "Published",
      width: 130,
      renderCell: (params) => {
        const isPub = params.value === 1 || params.value === true;
        return (
          <span style={{ color: isPub ? "green" : "red", fontWeight: 600 }}>
            {isPub ? "Yes" : "No"}
          </span>
        );
      },
    },
    {
      field: "submissionCount",
      headerName: "Submissions",
      width: 140,
    },
    {
      field: "viewResponse",
      headerName: "View Response",
      width: 120,
      renderCell: (params) => {
        const isPub = params.row.isPublished === 1 || params.row.isPublished === true;
        return (
          <Tooltip title={isPub ? "View Responses" : "Form not published"}>
            {/* <span style={{ filter: isPub ? "none" : "blur(2px)" }}> */}
              <IconButton
                onClick={() => isPub && navigate(`/viewResponse/${params.row.id}`)}
                sx={{ color: "#1a237e" }}
                 disabled={!isPub}
              >
                <Visibility />
              </IconButton>
            {/* </span> */}
          </Tooltip>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (params) => (
        <Tooltip title="Edit Form">
          <IconButton onClick={() => navigate(`/questions/${params.row.id}`)} sx={{ color: "#00796b" }}>
            <Edit />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 80,
      renderCell: (params) => (
        <Tooltip title="Delete Form">
          <IconButton onClick={() => handleDelete(params.row.id)} sx={{ color: "#c62828" }}>
            <Delete />
          </IconButton>
        </Tooltip>
      ),
    },
  {
  field: "action",
  headerName: "Copy Link",
  width: 150,
  renderCell: (params) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const handleCopy = () => {
      const fullUrl = `${window.location.origin}/form/${params.row.formToken}`;
      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          setMessage("✅ Link copied to clipboard!");
          setSeverity("success");
          setOpen(true);
        })
        .catch(() => {
          setMessage("❌ Failed to copy link!");
          setSeverity("error");
          setOpen(true);
        });
    };

    return (
      <>
        <Button
          onClick={handleCopy}
          disabled={!params.row.isPublished}
          variant="contained"
          size="small"
          startIcon={<Icon icon="icon-park-outline:link" width="20" height="20" />}
        >
          Copy
        </Button>

        {/* MUI Snackbar Alert */}
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </>
    );
  },
}
  ];

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh", pb: 8, fontFamily: "Poppins" }}>
      {/* NAVBAR */}
      <AppBar position="static" sx={{ bgcolor: "#1a237e", boxShadow: "0 3px 8px rgba(0,0,0,0.2)", mb: 4 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <motion.img
              src={logoInterval}
              alt="Interval Logo"
              style={{ height: 55, objectFit: "contain" }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 5 }}
            />
            <motion.img
              src={logoMap}
              alt="Map Animation"
              style={{ height: 65, borderRadius: "8px" }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* STATS */}
      <Paper
        sx={{
          p: 3,
          maxWidth: 1350,
          height: 120,
          mx: "auto",
          mb: 3,
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: "#fff",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box textAlign="center" p={2}>
          <Assignment sx={{ fontSize: 45, color: "#3949ab", mb: 1 }} />
          <Typography variant="subtitle2" color="textSecondary">
            Total Forms
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {totalForms}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "2px",
            height: 80,
            bgcolor: "#e0e0e0",
            mx: 4,
            display: { xs: "none", sm: "block" },
          }}
        />

        <Box textAlign="center" p={2}>
          <Today sx={{ fontSize: 45, color: "#00796b", mb: 1 }} />
          <Typography variant="subtitle2" color="textSecondary">
            Today's Forms
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {todayForms}
          </Typography>
        </Box>
      </Paper>

      {/* DATAGRID */}
      <Paper
        sx={{
          p: 3,
          maxWidth: 1350,
          mx: "auto",
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#1a237e" }}>
          All Forms
        </Typography>

        {loading ? (
          <Box sx={{ p: 5, textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}>
            <CircularProgress sx={{ color: "#1a237e" }} />
            <Typography>Loading forms...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", p: 2 }}>
            Failed to fetch forms: {error}
          </Typography>
        ) : (
          <>
            <div style={{ height: 420, width: "100%" }}>
              <DataGrid
                rows={forms || []}
                columns={columns}
                getRowId={(row) => row.id}
                pagination
                paginationMode="server"
                rowCount={pagination.total}
                paginationModel={{
                  page: page - 1,
                  pageSize: pageSize,
                }}
                onPaginationModelChange={(model) => {
                  setPage(model.page + 1);
                  setPageSize(model.pageSize);
                }}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
              />
            </div>
            <Typography variant="body2" sx={{ textAlign: "right", mt: 1, color: "gray" }}>
              Page {page} of {pagination.totalPages} ({pagination.total} total forms)
            </Typography>
          </>
        )}
      </Paper>

      {/* ADD BUTTON */}
      <Tooltip title="Create New Form">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate("/questions")}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            bgcolor: "#1a237e",
            "&:hover": { bgcolor: "#0d175e" },
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          }}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Box>
  );
}










// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   IconButton,
//   Tooltip,
//   Fab,
//   AppBar,
//   Toolbar,
//   CircularProgress,
//   Button,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { Assignment, Today, Add, Visibility, Edit, DeleteOutline, Warning } from "@mui/icons-material";
// import { DataGrid } from "@mui/x-data-grid";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFormsList, softDeleteForm } from "../redux/features/Adminformslice";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { AUTH_TOKEN } from "../utils/const";
// import { Icon } from '@iconify/react';

// export default function LandingPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { forms, loading, error, pagination } = useSelector((state) => state.adminForm);

//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [formToDelete, setFormToDelete] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//   const [logoInterval] = useState("https://www.intervaledu.com/static/web/images/logo/logo-dark.png");
//   const [logoMap] = useState("https://protest.teaminterval.net/static/media/map.7dd1ec7c87cddefd09e4.gif");

//   // Fetch forms on mount and when page/pageSize changes
//   useEffect(() => {
//     if (AUTH_TOKEN) {
//       dispatch(fetchFormsList({ token: AUTH_TOKEN, page, limit: pageSize }));
//     }
//   }, [dispatch, page, pageSize]);

//   const totalForms = pagination.total || 0;
//   const today = new Date().toDateString();
//   const todayForms =
//     forms?.filter((f) => new Date(f.createdAt).toDateString() === today).length || 0;

//   // Open delete confirmation dialog
//   const handleDeleteClick = (form) => {
//     setFormToDelete(form);
//     setDeleteDialogOpen(true);
//   };

//   // Close delete dialog
//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false);
//     setFormToDelete(null);
//   };

//   // Confirm soft delete
//   const handleDeleteConfirm = async () => {
//     if (!formToDelete) return;

//     setDeleting(true);
    
//     try {
//       await dispatch(softDeleteForm({ id: formToDelete.id, token: AUTH_TOKEN })).unwrap();
      
//       setSnackbar({
//         open: true,
//         message: `✅ Form "${formToDelete.title}" has been soft deleted successfully!`,
//         severity: "success"
//       });

//       // Refresh the forms list
//       dispatch(fetchFormsList({ token: AUTH_TOKEN, page, limit: pageSize }));
      
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: `❌ Failed to delete form: ${err}`,
//         severity: "error"
//       });
//     } finally {
//       setDeleting(false);
//       setDeleteDialogOpen(false);
//       setFormToDelete(null);
//     }
//   };

//   const columns = [
//     { 
//       field: "id", 
//       headerName: "Form ID", 
//       width: 100,
//       renderCell: (params) => (
//         <Typography variant="body2" fontWeight={600}>
//           #{params.value}
//         </Typography>
//       )
//     },
//     { 
//       field: "title", 
//       headerName: "Form Title", 
//       width: 220,
//       renderCell: (params) => (
//         <Tooltip title={params.value}>
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               overflow: "hidden", 
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap" 
//             }}
//           >
//             {params.value}
//           </Typography>
//         </Tooltip>
//       )
//     },
//     { 
//       field: "description", 
//       headerName: "Description", 
//       width: 250,
//       renderCell: (params) => (
//         <Tooltip title={params.value || "No description"}>
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               overflow: "hidden", 
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//               color: params.value ? "inherit" : "gray"
//             }}
//           >
//             {params.value || "No description"}
//           </Typography>
//         </Tooltip>
//       )
//     },
//     {
//       field: "isPublished",
//       headerName: "Published",
//       width: 120,
//       renderCell: (params) => {
//         const isPub = params.value === 1 || params.value === true;
//         return (
//           <Box
//             sx={{
//               px: 1.5,
//               py: 0.5,
//               borderRadius: 1,
//               bgcolor: isPub ? "#e8f5e9" : "#ffebee",
//               color: isPub ? "#2e7d32" : "#c62828",
//               fontWeight: 600,
//               fontSize: "0.75rem",
//               textAlign: "center"
//             }}
//           >
//             {isPub ? "Published" : "Draft"}
//           </Box>
//         );
//       },
//     },
//     {
//       field: "submissionCount",
//       headerName: "Submissions",
//       width: 130,
//       renderCell: (params) => (
//         <Typography variant="body2" fontWeight={600} color="primary">
//           {params.value || 0}
//         </Typography>
//       )
//     },
//     {
//       field: "viewResponse",
//       headerName: "Responses",
//       width: 110,
//       renderCell: (params) => {
//         const isPub = params.row.isPublished === 1 || params.row.isPublished === true;
//         return (
//           <Tooltip title={isPub ? "View Responses" : "Form not published"}>
//             <span>
//               <IconButton
//                 onClick={() => isPub && navigate(`/viewResponse/${params.row.id}`)}
//                 disabled={!isPub}
//                 size="small"
//                 sx={{ 
//                   color: isPub ? "#1a237e" : "#bdbdbd",
//                   "&:hover": {
//                     bgcolor: isPub ? "rgba(26, 35, 126, 0.08)" : "transparent"
//                   }
//                 }}
//               >
//                 <Visibility />
//               </IconButton>
//             </span>
//           </Tooltip>
//         );
//       },
//     },
//     {
//       field: "edit",
//       headerName: "Edit",
//       width: 80,
//       renderCell: (params) => (
//         <Tooltip title="Edit Form">
//           <IconButton 
//             onClick={() => navigate(`/questions/${params.row.id}`)} 
//             size="small"
//             sx={{ 
//               color: "#00796b",
//               "&:hover": { bgcolor: "rgba(0, 121, 107, 0.08)" }
//             }}
//           >
//             <Edit />
//           </IconButton>
//         </Tooltip>
//       ),
//     },
//     {
//       field: "delete",
//       headerName: "Delete",
//       width: 80,
//       renderCell: (params) => (
//         <Tooltip title="Soft Delete Form">
//           <IconButton 
//             onClick={() => handleDeleteClick(params.row)}
//             size="small"
//             sx={{ 
//               color: "#d32f2f",
//               "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" }
//             }}
//           >
//             <DeleteOutline />
//           </IconButton>
//         </Tooltip>
//       ),
//     },
//     {
//       field: "action",
//       headerName: "Copy Link",
//       width: 140,
//       renderCell: (params) => {
//         const [open, setOpen] = useState(false);

//         const handleCopy = () => {
//           const fullUrl = `${window.location.origin}/form/${params.row.formToken}`;
//           navigator.clipboard
//             .writeText(fullUrl)
//             .then(() => {
//               setOpen(true);
//             })
//             .catch(() => {
//               setSnackbar({
//                 open: true,
//                 message: "❌ Failed to copy link!",
//                 severity: "error"
//               });
//             });
//         };

//         return (
//           <>
//             <Button
//               onClick={handleCopy}
//               disabled={!params.row.isPublished}
//               variant="outlined"
//               size="small"
//               startIcon={<Icon icon="icon-park-outline:link" width="18" height="18" />}
//               sx={{ 
//                 textTransform: "none",
//                 fontSize: "0.75rem",
//                 py: 0.5
//               }}
//             >
//               Copy
//             </Button>

//             <Snackbar
//               open={open}
//               autoHideDuration={2000}
//               onClose={() => setOpen(false)}
//               anchorOrigin={{ vertical: "top", horizontal: "center" }}
//             >
//               <Alert
//                 onClose={() => setOpen(false)}
//                 severity="success"
//                 variant="filled"
//               >
//                 ✅ Link copied to clipboard!
//               </Alert>
//             </Snackbar>
//           </>
//         );
//       },
//     }
//   ];

//   return (
//     <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh", pb: 8, fontFamily: "Poppins" }}>
//       {/* NAVBAR */}
//       <AppBar position="static" sx={{ bgcolor: "#1a237e", boxShadow: "0 3px 8px rgba(0,0,0,0.2)", mb: 4 }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Box display="flex" alignItems="center" gap={2}>
//             <motion.img
//               src={logoInterval}
//               alt="Interval Logo"
//               style={{ height: 55, objectFit: "contain" }}
//               animate={{ scale: [1, 1.05, 1] }}
//               transition={{ repeat: Infinity, duration: 5 }}
//             />
//             <motion.img
//               src={logoMap}
//               alt="Map Animation"
//               style={{ height: 65, borderRadius: "8px" }}
//               animate={{ rotate: [0, 10, -10, 0] }}
//               transition={{ repeat: Infinity, duration: 6 }}
//             />
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* STATS */}
//       <Paper
//         sx={{
//           p: 3,
//           maxWidth: 1350,
//           height: 120,
//           mx: "auto",
//           mb: 3,
//           borderRadius: 3,
//           boxShadow: 4,
//           bgcolor: "#fff",
//           display: "flex",
//           justifyContent: "space-around",
//           alignItems: "center",
//           flexWrap: "wrap",
//         }}
//       >
//         <Box textAlign="center" p={2}>
//           <Assignment sx={{ fontSize: 45, color: "#3949ab", mb: 1 }} />
//           <Typography variant="subtitle2" color="textSecondary">
//             Total Forms
//           </Typography>
//           <Typography variant="h4" fontWeight={700}>
//             {totalForms}
//           </Typography>
//         </Box>

//         <Box
//           sx={{
//             width: "2px",
//             height: 80,
//             bgcolor: "#e0e0e0",
//             mx: 4,
//             display: { xs: "none", sm: "block" },
//           }}
//         />

//         <Box textAlign="center" p={2}>
//           <Today sx={{ fontSize: 45, color: "#00796b", mb: 1 }} />
//           <Typography variant="subtitle2" color="textSecondary">
//             Today's Forms
//           </Typography>
//           <Typography variant="h4" fontWeight={700}>
//             {todayForms}
//           </Typography>
//         </Box>
//       </Paper>

//       {/* DATAGRID */}
//       <Paper
//         sx={{
//           p: 3,
//           maxWidth: 1350,
//           mx: "auto",
//           borderRadius: 3,
//           boxShadow: 4,
//           bgcolor: "#fff",
//         }}
//       >
//         <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#1a237e" }}>
//           All Forms
//         </Typography>

//         {loading ? (
//           <Box sx={{ p: 5, textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}>
//             <CircularProgress sx={{ color: "#1a237e" }} />
//             <Typography>Loading forms...</Typography>
//           </Box>
//         ) : error ? (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             Failed to fetch forms: {error}
//           </Alert>
//         ) : (
//           <>
//             <div style={{ height: 420, width: "100%" }}>
//               <DataGrid
//                 rows={forms || []}
//                 columns={columns}
//                 getRowId={(row) => row.id}
//                 pagination
//                 paginationMode="server"
//                 rowCount={pagination.total}
//                 paginationModel={{
//                   page: page - 1,
//                   pageSize: pageSize,
//                 }}
//                 onPaginationModelChange={(model) => {
//                   setPage(model.page + 1);
//                   setPageSize(model.pageSize);
//                 }}
//                 pageSizeOptions={[5, 10, 20]}
//                 loading={loading}
//                 sx={{
//                   '& .MuiDataGrid-cell:focus': {
//                     outline: 'none',
//                   },
//                   '& .MuiDataGrid-row:hover': {
//                     bgcolor: 'rgba(26, 35, 126, 0.04)',
//                   },
//                 }}
//               />
//             </div>
//             <Typography variant="body2" sx={{ textAlign: "right", mt: 1, color: "gray" }}>
//               Page {page} of {pagination.totalPages} ({pagination.total} total forms)
//             </Typography>
//           </>
//         )}
//       </Paper>

//       {/* ADD BUTTON */}
//       <Tooltip title="Create New Form">
//         <Fab
//           color="primary"
//           aria-label="add"
//           onClick={() => navigate("/questions")}
//           sx={{
//             position: "fixed",
//             bottom: 30,
//             right: 30,
//             bgcolor: "#1a237e",
//             "&:hover": { bgcolor: "#0d175e" },
//             boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
//           }}
//         >
//           <Add />
//         </Fab>
//       </Tooltip>

//       {/* SOFT DELETE CONFIRMATION DIALOG */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={handleDeleteCancel}
//         aria-labelledby="delete-dialog-title"
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//             minWidth: 450,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
//           }
//         }}
//       >
//         <DialogTitle 
//           id="delete-dialog-title" 
//           sx={{ 
//             display: "flex", 
//             alignItems: "center", 
//             gap: 1.5,
//             pb: 1,
//             borderBottom: "1px solid #f0f0f0"
//           }}
//         >
//           <Warning sx={{ color: "#ff9800", fontSize: 32 }} />
//           <Box>
//             <Typography variant="h6" fontWeight={600}>
//               Confirm Soft Delete
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               This form will be marked as deleted
//             </Typography>
//           </Box>
//         </DialogTitle>
        
//         <DialogContent sx={{ mt: 2 }}>
//           <DialogContentText>
//             Are you sure you want to soft delete the form:
//             <br />
//             <Box
//               component="span"
//               sx={{
//                 display: "block",
//                 mt: 1,
//                 p: 1.5,
//                 bgcolor: "#f5f5f5",
//                 borderRadius: 1,
//                 fontWeight: 600,
//                 color: "#333"
//               }}
//             >
//               "{formToDelete?.title}"
//             </Box>
//             <br />
//             <Box sx={{ 
//               bgcolor: "#fff3e0", 
//               p: 1.5, 
//               borderRadius: 1, 
//               borderLeft: "4px solid #ff9800",
//               mt: 2
//             }}>
//               <Typography variant="body2" color="text.secondary">
//                 ⚠️ This will mark the form as deleted but keep it in the database.
//                 You may be able to restore it later.
//               </Typography>
//             </Box>
//           </DialogContentText>
//         </DialogContent>
        
//         <DialogActions sx={{ p: 2.5, pt: 1, gap: 1 }}>
//           <Button 
//             onClick={handleDeleteCancel} 
//             variant="outlined"
//             disabled={deleting}
//             sx={{ 
//               textTransform: "none",
//               color: "#666",
//               borderColor: "#ddd",
//               px: 3,
//               "&:hover": {
//                 borderColor: "#999",
//                 bgcolor: "#f5f5f5"
//               }
//             }}
//           >
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleDeleteConfirm} 
//             variant="contained"
//             color="error"
//             disabled={deleting}
//             startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutline />}
//             sx={{ 
//               textTransform: "none",
//               fontWeight: 600,
//               px: 3,
//               bgcolor: "#d32f2f",
//               "&:hover": {
//                 bgcolor: "#c62828"
//               }
//             }}
//           >
//             {deleting ? "Deleting..." : "Soft Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* SNACKBAR FOR SUCCESS/ERROR MESSAGES */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ 
//             width: "100%",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }