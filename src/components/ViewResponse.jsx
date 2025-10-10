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
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable"; // Explicit import for plugin
import { AUTH_TOKEN } from "../utils/const";

const ViewResponse = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { formResponses, currentSchema, loading, exportLoading, error } =
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

  const flattenExportData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((responseItem, index) => {
      const flatRow = { "Response #": index + 1 };
      const fields = responseItem.fields || responseItem;
      if (Array.isArray(fields)) {
        fields.forEach((field) => {
          let value = field.value;
          if (Array.isArray(value)) {
            value = value.join(", ");
          }
          flatRow[field.label || "Unknown"] = value || "";
        });
      }
      return flatRow;
    });
  };

  // Export to CSV
  const exportToCSV = (data) => {
    try {
      const flatData = flattenExportData(data);
      if (!flatData || flatData.length === 0) {
        alert("No data available to export");
        return;
      }
      const headers = Object.keys(flatData[0]);
      const csvContent = [
        headers.join(","),
        ...flatData.map((row) =>
          headers
            .map((h) => {
              const value = row[h] || "";
              return `"${String(value).replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `form_${id}_responses.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      handleMenuClose();
    } catch (error) {
      console.error("CSV Export Error:", error.stack);
      alert("Failed to export CSV: " + error.message);
    }
  };

  // Export to Excel
  const exportToExcel = (data) => {
    try {
      const flatData = flattenExportData(data);
      if (!flatData || flatData.length === 0) {
        alert("No data available to export");
        return;
      }
      const ws = XLSX.utils.json_to_sheet(flatData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Responses");
      const maxWidth = 50;
      const cols = Object.keys(flatData[0]).map(() => ({ wch: maxWidth }));
      ws["!cols"] = cols;
      XLSX.writeFile(wb, `form_${id}_responses.xlsx`);
      handleMenuClose();
    } catch (error) {
      console.error("Excel Export Error:", error.stack);
      alert("Failed to export Excel: " + error.message);
    }
  };

  // Export to PDF - using explicit autoTable import and call
  const exportToPDF = (data) => {
    try {
      const flatData = flattenExportData(data);
      if (!flatData || flatData.length === 0) {
        alert("No data available to export");
        return;
      }
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Add title and metadata
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text(`Form ${id} - Responses`, 14, 15);

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(`Total Responses: ${flatData.length}`, 14, 22);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);

      const headers = Object.keys(flatData[0]);
      const rows = flatData.map((row) =>
        headers.map((h) => (row[h] !== null && row[h] !== undefined ? String(row[h]) : ""))
      );

      // Call the imported autoTable function passing doc instance and options
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 32,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
          overflow: "linebreak",
          cellWidth: "wrap",
          minCellHeight: 8,
        },
        headStyles: {
          fillColor: [26, 35, 126],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 20, halign: "center" },
        },
        margin: { top: 32, left: 10, right: 10 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: "center" }
          );
        },
      });

      doc.save(`form_${id}_responses.pdf`);
      handleMenuClose();
    } catch (error) {
      console.error("PDF Export Error:", error.stack);
      alert("Failed to export PDF: " + error.message);
    }
  };

  // Handle export button click
  const handleExport = (type) => {
    dispatch(exportFormResponses({ formId: id, token: AUTH_TOKEN }))
      .unwrap()
      .then((response) => {
        const data = response?.data || response;
        if (!data || (Array.isArray(data) && data.length === 0)) {
          alert("No data available to export!");
          handleMenuClose();
          return;
        }
        setTimeout(() => {
          if (type === "csv") exportToCSV(data);
          else if (type === "excel") exportToExcel(data);
          else if (type === "pdf") exportToPDF(data);
        }, 100);
      })
      .catch((err) => {
        console.error("Export Fetch Error:", err.stack);
        alert("Failed to fetch export data: " + (err.message || err));
        handleMenuClose();
      });
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
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return <Typography variant="body2">N/A</Typography>;
        const date = new Date(params.value);
        const formatted = date.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return (
          <Tooltip title={`Created on ${formatted}`}>
            <Typography variant="body2">{formatted}</Typography>
          </Tooltip>
        );
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
              <Typography variant="subtitle1" fontWeight={600}>
                {field.label}
              </Typography>
              {Array.isArray(field.value) ? (
                <Typography variant="body2">{field.value.join(", ")}</Typography>
              ) : field.type === "uploadFile" ? (
                <a
                  href={`${field.value}`}
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
