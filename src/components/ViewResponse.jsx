import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Modal,
  Divider,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  Grid,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility as VisibilityIcon, Assignment } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchFormResponses } from "../redux/features/Adminformslice";
import { exportToCsv, exportToExcel, exportToPdf } from "../utils/exportCsv";

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjc1MywiaWF0IjoxNzU5ODM4Nzk2LCJleHAiOjE3NTk5MjUxOTZ9.MedK26RLF5SZfipdGoAkqJrYWzPxXLIESzVlbslmH2U";

const ViewResponse = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();

  const { formResponses, loading, error } = useSelector(
    (state) => state.adminForm
  );
console.log("formresponse",formResponses)
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleExport = (type) => {
    if (!formResponses || formResponses.length === 0) return;

    const columns = Object.keys(formResponses[0]).map((key) => ({
      field: key,
      headerName: key,
    }));

    if (type === "csv") exportToCsv(columns, formResponses);
    if (type === "excel") exportToExcel(columns, formResponses);
    if (type === "pdf") exportToPdf(columns, formResponses);

    handleMenuClose();
  };

  // Fetch form responses when component mounts
 useEffect(() => {
  if (id && AUTH_TOKEN) {
    console.log("Dispatching fetchFormResponses for form ID:", id);
    dispatch(fetchFormResponses({ formId: id, token: AUTH_TOKEN }))
      .unwrap()
      .then((res) => console.log("API Success:", res))
      .catch((err) => console.error("API Error:", err));
  }
}, [dispatch, id, AUTH_TOKEN]);


  const columns = [
    { field: "sl_no", headerName: "Sl No", width: 80 },
        { field: "title", headerName: "title", width: 80 },
    { field: "email", headerName: "Email", width: 220},
      // valueGetter: (params) => params.row?.email || "N/A",},
    { field: "userIP", headerName: "IP Address", width: 160 },
    { field: "Publishet at", headerName: "Published at", width: 160 },
    
    
    {
      field: "isVerified",
      headerName: "Verified",
      width: 120,
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "red",
            fontWeight: 600,
          }}
        >
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "view",
      headerName: "View Details",
      width: 130,
      renderCell: (params) => (
        <Tooltip title="View Full Response">
          <IconButton
            sx={{ color: "#1a237e" }}
            onClick={() => setSelectedResponse(params.row)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rows =
    formResponses?.map((r, i) => ({
      sl_no: i + 1,
      ...r,
    })) || [];

  return (
    <Box sx={{ p: 3, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 2, mb: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#fff" }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Responses for Form {id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {rows.length} responses found
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleMenuClick}
            disabled={!rows.length || loading}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            EXPORT ALL DATA
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleExport("csv")}>Export as CSV</MenuItem>
            <MenuItem onClick={() => handleExport("excel")}>Export as Excel</MenuItem>
            <MenuItem onClick={() => handleExport("pdf")}>Export as PDF</MenuItem>
          </Menu>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress sx={{ color: "#1a237e" }} />
          <Typography sx={{ mt: 2 }}>Loading responses...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : rows.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", color: "gray" }} elevation={1}>
          <Assignment sx={{ fontSize: 40, mb: 1, color: "gray" }} />
          <Typography variant="h6">No responses found</Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.sl_no}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            autoHeight
            disableRowSelectionOnClick
          />
        </Paper>
      )}

      {/* MODAL for viewing full response details */}
      <Modal
        open={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            width: 600,
            maxHeight: "80vh",
            overflowY: "auto",
            p: 3,
          }}
        >
          {selectedResponse && (
            <>
              <Typography variant="h6" fontWeight={600}>
                Response Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>
                <strong>Email:</strong> {selectedResponse.email || "N/A"}
              </Typography>
              <Typography>
                <strong>IP Address:</strong> {selectedResponse.userIP || "N/A"}
              </Typography>
              <Typography>
                <strong>Verified:</strong>{" "}
                {selectedResponse.isVerified ? "Yes" : "No"}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Submitted Data:
              </Typography>
              <Box sx={{ mt: 1 }}>
                {selectedResponse.data && Object.keys(selectedResponse.data).length > 0 ? (
                  Object.entries(selectedResponse.data).map(([key, value], i) => (
                    <Paper
                      key={i}
                      sx={{ p: 1.5, mb: 1.5, bgcolor: "#f5f5f5", borderRadius: 1 }}
                    >
                      <Typography fontWeight={600}>{key}</Typography>
                      <Typography sx={{ color: "#424242", mt: 0.5 }}>
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography color="text.secondary">No data found.</Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewResponse;