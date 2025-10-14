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
// } from "@mui/material";
// import { Assignment, Today, Add, Visibility, Edit, Delete } from "@mui/icons-material";
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
  

//   const [logoInterval] = useState("https://www.intervaledu.com/static/web/images/logo/logo-dark.png");
//   const [logoMap] = useState("https://protest.teaminterval.net/static/media/map.7dd1ec7c87cddefd09e4.gif");

//   useEffect(() => {
//     if (AUTH_TOKEN) {
//       dispatch(fetchFormsList({ token: AUTH_TOKEN, page, limit: pageSize }));
//     }
//   }, [dispatch, page, pageSize]);

//   const totalForms = pagination.total || 0;
//   const today = new Date().toDateString();
//   const todayForms =
//     forms?.filter((f) => new Date(f.createdAt).toDateString() === today).length || 0;

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this form?")) {
//       dispatch(softDeleteForm({ id, token: AUTH_TOKEN })).then(() => {
//         dispatch(fetchFormsList({ token: AUTH_TOKEN, page, limit: pageSize }));
//       });
//     }
//   };

//   const columns = [
//     { field: "id", headerName: "Form ID", width: 120 },
//     { field: "title", headerName: "Form Title", width: 220 },
//     { field: "description", headerName: "Description", width: 250 },
//     {
//       field: "isPublished",
//       headerName: "Published",
//       width: 130,
//       renderCell: (params) => {
//         const isPub = params.value === 1 || params.value === true;
//         return (
//           <span style={{ color: isPub ? "green" : "red", fontWeight: 600 }}>
//             {isPub ? "Yes" : "No"}
//           </span>
//         );
//       },
//     },
//     {
//       field: "submissionCount",
//       headerName: "Submissions",
//       width: 140,
//     },
//     {
//       field: "viewResponse",
//       headerName: "View Response",
//       width: 120,
//       renderCell: (params) => {
//         const isPub = params.row.isPublished === 1 || params.row.isPublished === true;
//         return (
//           <Tooltip title={isPub ? "View Responses" : "Form not published"}>
//             {/* <span style={{ filter: isPub ? "none" : "blur(2px)" }}> */}
//               <IconButton
//                 onClick={() => isPub && navigate(`/viewResponse/${params.row.id}`)}
//                 sx={{ color: "#1a237e" }}
//                  disabled={!isPub}
//               >
//                 <Visibility />
//               </IconButton>
//             {/* </span> */}
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
//           <IconButton onClick={() => navigate(`/questions/${params.row.id}`)} sx={{ color: "#00796b" }}>
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
//         <Tooltip title="Delete Form">
//           <IconButton onClick={() => handleDelete(params.row.id)} sx={{ color: "#c62828" }}>
//             <Delete />
//           </IconButton>
//         </Tooltip>
//       ),
//     },
//   {
//   field: "action",
//   headerName: "Copy Link",
//   width: 150,
//   renderCell: (params) => {
//     const [open, setOpen] = useState(false);
//     const [message, setMessage] = useState("");
//     const [severity, setSeverity] = useState("success");

//     const handleCopy = () => {
//       const fullUrl = `${window.location.origin}/form/${params.row.formToken}`;
//       navigator.clipboard
//         .writeText(fullUrl)
//         .then(() => {
//           setMessage("✅ Link copied to clipboard!");
//           setSeverity("success");
//           setOpen(true);
//         })
//         .catch(() => {
//           setMessage("❌ Failed to copy link!");
//           setSeverity("error");
//           setOpen(true);
//         });
//     };

//     return (
//       <>
//         <Button
//           onClick={handleCopy}
//           disabled={!params.row.isPublished}
//           variant="contained"
//           size="small"
//           startIcon={<Icon icon="icon-park-outline:link" width="20" height="20" />}
//         >
//           Copy
//         </Button>

//         {/* MUI Snackbar Alert */}
//         <Snackbar
//           open={open}
//           autoHideDuration={2000}
//           onClose={() => setOpen(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert
//             onClose={() => setOpen(false)}
//             severity={severity}
//             variant="filled"
//             sx={{ width: "100%" }}
//           >
//             {message}
//           </Alert>
//         </Snackbar>
//       </>
//     );
//   },
// }
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
//           <Typography color="error" sx={{ textAlign: "center", p: 2 }}>
//             Failed to fetch forms: {error}
//           </Typography>
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
//     </Box>
//   );
// }



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
  Popover,
} from "@mui/material";
import { Assignment, Today, Add, Visibility, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchFormsList, softDeleteForm } from "../redux/features/Adminformslice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AUTH_TOKEN } from "../utils/const";
import { Icon } from "@iconify/react";

export default function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms, loading, error, pagination } = useSelector(
    (state) => state.adminForm
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
  const [selectedFormId, setSelectedFormId] = useState(null);

  const [logoInterval] = useState(
    "https://www.intervaledu.com/static/web/images/logo/logo-dark.png"
  );
  const [logoMap] = useState(
    "https://protest.teaminterval.net/static/media/map.7dd1ec7c87cddefd09e4.gif"
  );

  useEffect(() => {
    if (AUTH_TOKEN) {
      dispatch(fetchFormsList({ token: AUTH_TOKEN, page, limit: pageSize }));
    }
  }, [dispatch, page, pageSize]);

  const totalForms = pagination.total || 0;
  const today = new Date().toDateString();
  const todayForms =
    forms?.filter((f) => new Date(f.createdAt).toDateString() === today)
      .length || 0;

  // 🔹 OPEN delete popover
  const handleOpenDeletePopover = (event, id) => {
    setDeleteAnchorEl(event.currentTarget);
    setSelectedFormId(id);
  };

  // 🔹 CLOSE delete popover
  const handleCloseDeletePopover = () => {
    setDeleteAnchorEl(null);
    setSelectedFormId(null);
  };

  // 🔹 CONFIRM delete action
  const handleConfirmDelete = () => {
    if (selectedFormId) {
      dispatch(softDeleteForm({ id: selectedFormId, token: AUTH_TOKEN })).then(() => {
        dispatch(fetchFormsList({ token: AUTH_TOKEN, page, limit: pageSize }));
      });
    }
    handleCloseDeletePopover();
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
        const isPub =
          params.row.isPublished === 1 || params.row.isPublished === true;
        return (
          <Tooltip title={isPub ? "View Responses" : "Form not published"}>
            <span>
              <IconButton
                onClick={() => isPub && navigate(`/viewResponse/${params.row.id}`)}
                sx={{ color: "#1a237e" }}
                disabled={!isPub}
              >
                <Visibility />
              </IconButton>
            </span>
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
          <IconButton
            onClick={() => navigate(`/questions/${params.row.id}`)}
            sx={{ color: "#00796b" }}
          >
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
          <IconButton
            onClick={(e) => handleOpenDeletePopover(e, params.row.id)}
            sx={{ color: "#c62828" }}
          >
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

            {/* Snackbar for copy status */}
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
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh", pb: 8, fontFamily: "Poppins" }}>
      {/* NAVBAR */}
      <AppBar
        position="static"
        sx={{ bgcolor: "#1a237e", boxShadow: "0 3px 8px rgba(0,0,0,0.2)", mb: 4 }}
      >
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

      {/* DELETE CONFIRM POPOVER */}
      <Popover
        open={Boolean(deleteAnchorEl)}
        anchorEl={deleteAnchorEl}
        onClose={handleCloseDeletePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ zIndex: 3000 }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this form?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="outlined" size="small" onClick={handleCloseDeletePopover}>
              Cancel
            </Button>
            <Button variant="contained" size="small" color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>

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
