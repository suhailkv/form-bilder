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
import { AUTH_TOKEN } from "../utils/const";


const ViewResponse = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();

  const { formResponses, currentSchema, loading, error } = useSelector(
    (state) => state.adminForm
  );

  console.log("formResponses:", formResponses);
  console.log("currentSchema:", currentSchema);

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
  }, [dispatch, id]);

  const columns = [
    { 
      field: "sl_no", 
      headerName: "Sl No", 
      width: 80,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      )
    },
    // { 
    //   field: "id", 
    //   headerName: "Response ID", 
    //   width: 120,
    //   renderCell: (params) => (
    //     <Typography variant="body2">{params.value}</Typography>
    //   )
    // },
    { 
      field: "email", 
      headerName: "Email", 
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || "No email provided"}>
          <Typography variant="body2" sx={{ color: params.value ? "inherit" : "gray" }}>
            {params.value || "N/A"}
          </Typography>
        </Tooltip>
      )
    },
    { 
      field: "userIP", 
      headerName: "IP Address", 
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {params.value || "N/A"}
        </Typography>
      )
    },
    {
      field: "isVerified",
      headerName: "Verified",
      width: 100,
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
      field: "userAgent", 
      headerName: "User Agent", 
      width: 180,
      renderCell: (params) => (
        <Tooltip title={params.value || "Unknown"}>
          <Typography 
            variant="body2" 
            sx={{ 
              overflow: "hidden", 
              textOverflow: "ellipsis",
              whiteSpace: "nowrap" 
            }}
          >
            {params.value || "N/A"}
          </Typography>
        </Tooltip>
      )
    },
    { 
      field: "submissionToken", 
      headerName: "Token", 
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: "monospace",
              fontSize: "0.75rem",
              overflow: "hidden", 
              textOverflow: "ellipsis" 
            }}
          >
            {params.value ? params.value.substring(0, 12) + "..." : "N/A"}
          </Typography>
        </Tooltip>
      )
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
              {currentSchema?.title || `Form ${id}`} - Responses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {rows.length} responses found
            </Typography>
            {currentSchema?.publishedAt && (
              <Typography variant="caption" color="text.secondary">
                Published: {new Date(currentSchema.publishedAt).toLocaleDateString()}
              </Typography>
            )}
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
            width: 700,
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
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Response ID:</strong> {selectedResponse.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Email:</strong> {selectedResponse.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>IP Address:</strong> {selectedResponse.userIP || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Verified:</strong>{" "}
                    <span style={{ color: selectedResponse.isVerified ? "green" : "red", fontWeight: 600 }}>
                      {selectedResponse.isVerified ? "Yes" : "No"}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>User Agent:</strong> {selectedResponse.userAgent || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ wordBreak: "break-all" }}>
                    <strong>Submission Token:</strong> {selectedResponse.submissionToken || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight={600}>
                Submitted Data:
              </Typography>
              <Box sx={{ mt: 1 }}>
                {selectedResponse.data && Object.keys(selectedResponse.data).length > 0 ? (
                  Object.entries(selectedResponse.data).map(([key, value], i) => {
                    // Skip _files object
                    if (key === "_files") return null;
                    
                    return (
                      <Paper
                        key={i}
                        sx={{ p: 1.5, mb: 1.5, bgcolor: "#f5f5f5", borderRadius: 1 }}
                      >
                        <Typography fontWeight={600} sx={{ color: "#1a237e" }}>
                          {key}
                        </Typography>
                        <Typography sx={{ color: "#424242", mt: 0.5 }}>
                          {Array.isArray(value) 
                            ? value.join(", ") 
                            : typeof value === "object" 
                            ? JSON.stringify(value, null, 2) 
                            : String(value)}
                        </Typography>
                      </Paper>
                    );
                  })
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