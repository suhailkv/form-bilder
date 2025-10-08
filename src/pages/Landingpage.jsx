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
} from "@mui/material";
import {
  Assignment,
  Today,
  Add,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchFormsList,softDeleteForm } from "../redux/features/Adminformslice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Replace this with your real token
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjc1MywiaWF0IjoxNzU5NzQzODg2LCJleHAiOjE3NTk4MzAyODZ9.QCP20t5DkIuU9jyA6PjsGH2N6mZMH2i5vAUWV8IxV60";

export default function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms, loading, error } = useSelector((state) => state.adminForm);

  const [logoInterval] = useState(
    "https://www.intervaledu.com/static/web/images/logo/logo-dark.png"
  );
  const [logoMap] = useState(
    "https://protest.teaminterval.net/static/media/map.7dd1ec7c87cddefd09e4.gif"
  );

  // ✅ Fetch forms from backend when mounted
  useEffect(() => {
    if (AUTH_TOKEN) {
      dispatch(fetchFormsList(AUTH_TOKEN));
    } else {
      console.error("No authentication token found");
    }
  }, [dispatch]);


  // ✅ Stats
  const totalForms = forms?.length || 0;
  const today = new Date().toDateString();
  const todayForms =
    forms?.filter((f) => new Date(f.createdAt).toDateString() === today)
      .length || 0;

        // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      dispatch(softDeleteForm({ id, token: AUTH_TOKEN }));
    }
  };

  // ✅ DataGrid Columns
  const columns = [
    { field: "id", headerName: "Form ID", width: 120 },
    { field: "title", headerName: "Form Title", width: 220 },
    { field: "description", headerName: "Description", width: 250 },
    // {
    //   field: "createdAt",
    //   headerName: "Created Date",
    //   width: 200,
    //   valueGetter: (params) => new Date(params.row.createdAt).toLocaleString(),
    // },
    {
      field: "view Response",
      headerName: "view Response",
      width: 80,
      renderCell: (params) => (
        <Tooltip title="View Responses">
          <IconButton
            onClick={() => navigate(`/viewResponse/${params.row.id}`)}
            sx={{ color: "#1a237e" }}
          >
            <Visibility />
          </IconButton>
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
            onClick={() =>
                 handleDelete(params.row.id)}
             
            sx={{ color: "#c62828" }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh", pb: 8, fontFamily: "Poppins" }}>
      {/* ===== TOP NAVBAR ===== */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#1a237e",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
          mb: 4,
        }}
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

      {/* ===== COMBINED STATS BOX ===== */}
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
            Today’s Forms
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {todayForms}
          </Typography>
        </Box>
      </Paper>

      {/* ===== DATAGRID SECTION ===== */}
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
          <Box
            sx={{
              p: 5,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#1a237e" }} />
            <Typography>Loading forms...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", p: 2 }}>
            Failed to fetch forms: {error}
          </Typography>
        ) : (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={forms || []}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
            />
          </div>
        )}
      </Paper>

      {/* ===== ADD NEW FORM BUTTON ===== */}
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
