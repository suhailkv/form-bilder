import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import tabledata from "../data/tabledata.json"; // Or fetch from API

const ViewResponse = () => {
  const { id } = useParams(); // form ID from URL
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // ✅ Filter responses based on selected form id
    const formResponses = tabledata.filter((item) => item.sl_no == id);
    setResponses(formResponses);
  }, [id]);

  const columns = [
    { field: "sl_no", headerName: "ID", width: 80 },
    { field: "title", headerName: "Title", width: 180 },
    {
      field: "Submitted By",
      headerName: "Submitted By",
      width: 220,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "isPublished",
      headerName: "Published",
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <span style={{ color: "green" }}>Yes</span>
        ) : (
          <span style={{ color: "red" }}>No</span>
        ),
    },
    { field: "noOfSubmission", headerName: "No. of Submissions", width: 180 },
    { field: "timeStamp", headerName: "Timestamp", width: 200 },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">
          Responses for Form ID: {id}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <DataGrid
          rows={responses}
          columns={columns}
          getRowId={(row) => row.sl_no}
          pageSize={5}
          autoHeight
          disableSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default ViewResponse;
