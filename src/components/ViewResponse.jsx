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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility as VisibilityIcon, FileDownload } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchFormResponses, exportFormResponses } from "../redux/features/Adminformslice";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

const ViewResponse = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { formResponses, currentSchema, loading, pagination } = useSelector(
    (state) => state.adminForm
  );

  const [selectedResponse, setSelectedResponse] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    if (id && AUTH_TOKEN) {
      dispatch(fetchFormResponses({ formId: id, token: AUTH_TOKEN, page, limit: pageSize }))
        .unwrap()
        .catch((err) => console.error("API Error:", err));
    }
  }, [dispatch, id, page, pageSize]);

  const flattenExportData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map((responseItem, index) => {
      const flatRow = { "Response #": index + 1 };
      const fields = responseItem.fields || responseItem;
      if (Array.isArray(fields)) {
        fields.forEach((field) => {
          let value = field.value;
          if (Array.isArray(value)) value = value.join(", ");
          if (field.type === "checkbox") value = value ? "Yes" : "No";
          flatRow[field.label || "Unknown"] = value || "";
        });
      }
      return flatRow;
    });
  };

  const exportToCSV = (data) => {
    const flatData = flattenExportData(data);
    if (!flatData.length) return alert("No data available to export");
    const headers = Object.keys(flatData[0]);
    const csvContent = [
      headers.join(","),
      ...flatData.map((row) =>
        headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(",")
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
    if (!flatData.length) return alert("No data available to export");
    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, `form_${id}_responses.xlsx`);
    handleMenuClose();
  };

  const exportToPDF = (data) => {
    const flatData = flattenExportData(data);
    if (!flatData.length) return alert("No data available to export");
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text(`Form ${id} - Responses`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Responses: ${flatData.length}`, 14, 22);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);
    const headers = Object.keys(flatData[0]);
    const rows = flatData.map((row) => headers.map((h) => row[h] || ""));
    autoTable(doc, { head: [headers], body: rows, startY: 32, styles: { fontSize: 7 } });
    doc.save(`form_${id}_responses.pdf`);
    handleMenuClose();
  };

  const handleExport = (type) => {
    dispatch(exportFormResponses({ formId: id, token: AUTH_TOKEN }))
      .unwrap()
      .then((res) => {
        const data = res?.data || res;
        if (!data || !data.length) return alert("No data available to export!");
        if (type === "csv") exportToCSV(data);
        else if (type === "excel") exportToExcel(data);
        else if (type === "pdf") exportToPDF(data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch export data");
      });
  };

  const columns = [
    { field: "sl_no", headerName: "Sl No", width: 100 },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => (
        <Tooltip title={params.value || "Email not available"}>
          <Typography variant="body2" sx={{ color: params.value ? "inherit" : "gray" }}>
            {params.value || "N/A"}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "userIP", headerName: "IP Address", width: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 280,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        try {
          const date = new Date(params.value);
          return <Typography variant="body2">{format(date, "EEEE MMMM yyyy, hh:mm a")}</Typography>;
        } catch {
          return "Invalid Date";
        }
      },
    },
    { field: "userAgent", headerName: "User Agent", width: 250 },
    {
      field: "view",
      headerName: "View",
      width: 110,
      renderCell: (params) => (
        <IconButton onClick={() => setSelectedResponse(params.row)} color="primary">
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const rows = formResponses?.map((r, i) => ({ sl_no: i + 1, ...r })) || [];

  return (
    <Box sx={{ p: 3, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{currentSchema?.title || `Form ${id}`} - Responses</Typography>
            <Typography variant="body2">{rows.length} responses found</Typography>
          </Box>
          <Button variant="contained" onClick={handleMenuClick} startIcon={<FileDownload />}>
            EXPORT DATA
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleExport("csv")}>CSV</MenuItem>
            <MenuItem onClick={() => handleExport("excel")}>Excel</MenuItem>
            <MenuItem onClick={() => handleExport("pdf")}>PDF</MenuItem>
          </Menu>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>No responses found</Typography>
      ) : (
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.sl_no}
            pagination
            paginationMode="server"
            rowCount={pagination?.total || rows.length}
            pageSizeOptions={[5, 10, 20]}
            paginationModel={{ page: page - 1, pageSize }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1);
              setPageSize(model.pageSize);
            }}
            loading={loading}
            autoHeight
            sx={{ "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" } }}
          />
        </div>
      )}

      {/* MODAL */}
      <Modal open={!!selectedResponse} onClose={() => setSelectedResponse(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>Response Details</Typography>
          <Divider sx={{ mb: 2 }} />
          {selectedResponse?.fields?.map((field, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography fontWeight={600}>{field.label}</Typography>
              {Array.isArray(field.value) ? (
                <Typography>{field.value.join(", ")}</Typography>
              ) : field.type === "uploadFile" ? (
                <a href={field.value} target="_blank" rel="noopener noreferrer">{field.value}</a>
              ) : field.type === "checkbox" ? (
                <Typography>{field.value ? "Yes" : "No"}</Typography>
              ) : (
                <Typography>{field.value || "N/A"}</Typography>
              )}
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
          <Button onClick={() => setSelectedResponse(null)} variant="contained" sx={{ mt: 1 }}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewResponse;
