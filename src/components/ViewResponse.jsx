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
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility as VisibilityIcon, Assignment, FileDownload } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchFormResponses, exportFormResponses } from "../redux/features/Adminformslice";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AUTH_TOKEN } from "../utils/const";

const ViewResponse = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { formResponses, currentSchema, exportData, loading, exportLoading, error } =
    useSelector((state) => state.adminForm);

  const [selectedResponse, setSelectedResponse] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    if (id && AUTH_TOKEN) {
      dispatch(fetchFormResponses({ formId: id, token: AUTH_TOKEN }))
        .unwrap()
        .then((res) => console.log("API Success:", res))
        .catch((err) => console.error("API Error:", err));
    }
  }, [dispatch, id]);

  const flattenExportData = (data) =>
    data.map((res, i) => {
      const flatRow = { "Response #": i + 1 };
      res.fields.forEach((field) => {
        const value = Array.isArray(field.value) ? field.value.join(", ") : field.value;
        flatRow[field.label] = value;
      });
      return flatRow;
    });

  const exportToCSV = (data) => {
    const flatData = flattenExportData(data);
    const headers = Object.keys(flatData[0]);
    const csvContent = [
      headers.join(","),
      ...flatData.map((row) =>
        headers.map((h) => JSON.stringify(row[h] || "")).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `form_${id}_responses.csv`;
    link.click();
    handleMenuClose();
  };

  const exportToExcel = (data) => {
    const flatData = flattenExportData(data);
    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, `form_${id}_responses.xlsx`);
    handleMenuClose();
  };

  const exportToPDF = (data) => {
    const flatData = flattenExportData(data);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Form ${id} - Responses`, 14, 15);
    const headers = Object.keys(flatData[0]);
    const rows = flatData.map((r) => headers.map((h) => r[h] || ""));
    doc.autoTable({ head: [headers], body: rows, startY: 25 });
    doc.save(`form_${id}_responses.pdf`);
    handleMenuClose();
  };

  const handleExport = (type) => {
    dispatch(exportFormResponses({ formId: id, token: AUTH_TOKEN }))
      .unwrap()
      .then((res) => {
        const data = res?.data || [];
        if (!data.length) return alert("No data to export!");
        if (type === "csv") exportToCSV(data);
        else if (type === "excel") exportToExcel(data);
        else if (type === "pdf") exportToPDF(data);
      })
      .catch((err) => console.error("Export failed:", err))
      .finally(() => handleMenuClose());
  };

  const columns = [
    { field: "sl_no", headerName: "Sl No", width: 80 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value ? `Email ID: ${params.value}` : "Email not available"}>
          <Typography variant="body2" sx={{ color: params.value ? "inherit" : "gray" }}>
            {params.value || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "userIP",
      headerName: "IP Address",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "isVerified",
      headerName: "Verified",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Verified" : "Not Verified"}
          size="small"
          color={params.value ? "success" : "error"}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const formatted = date.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return <Typography variant="body2">{formatted}</Typography>;
      },
    },
    {
      field: "userAgent",
      headerName: "User Agent",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || "Unknown"}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.value || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "view",
      headerName: "View Details",
      width: 130,
      renderCell: (params) => (
        <Tooltip title="View Full Response">
          <IconButton sx={{ color: "#1a237e" }} onClick={() => setSelectedResponse(params.row)}>
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
      <Paper sx={{ p: 2, mb: 3, boxShadow: 3, borderRadius: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {currentSchema?.title || `Form ${id}`} - Responses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {rows.length} responses found
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleMenuClick}
            disabled={!rows.length || loading || exportLoading}
            startIcon={exportLoading ? <CircularProgress size={16} /> : <FileDownload />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              bgcolor: "#1a237e",
              "&:hover": { bgcolor: "#0d175e" },
            }}
          >
            {exportLoading ? "Exporting..." : "EXPORT DATA"}
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
        <Alert severity="error">{error}</Alert>
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
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 20]}
            autoHeight
            disableRowSelectionOnClick
          />
        </Paper>
      )}

      {/* MODAL SECTION */}
      <Modal
        open={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
        aria-labelledby="response-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: 600,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography id="response-modal" variant="h6" fontWeight={600} gutterBottom>
            Response Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {selectedResponse?.fields?.map((field, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Type: {field.type}
              </Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                {field.label}
              </Typography>
              {Array.isArray(field.value) ? (
                <Typography variant="body2">{field.value.join(", ")}</Typography>
              ) : field.type === "uploadFile" ? (
                <a
                  href={field.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1a237e", textDecoration: "underline" }}
                >
                  {field.value}
                </a>
              ) : (
                <Typography variant="body2">{field.value || "N/A"}</Typography>
              )}
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}

          <Box textAlign="right" sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setSelectedResponse(null)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewResponse;
