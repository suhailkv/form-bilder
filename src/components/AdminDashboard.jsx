import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Assignment, TrendingUp } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import tabledata from "../Data/tabledata.json"; // ✅ your sample data
import { exportToCsv, exportToExcel, exportToPdf } from "../utils/exportCsv";

import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [tab, setTab] = useState(1);
  const [responses, setResponses] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const navigate=useNavigate()

  // Export Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleExport = (type) => {
    if (type === "csv") exportToCsv(columns, responses);
    if (type === "excel") exportToExcel(columns, responses);
    if (type === "pdf") exportToPdf(columns, responses);
    // if (type === "json") exportSubmissions(1);
    handleMenuClose();
  };

  // ✅ use local JSON first
  useEffect(() => {
    setResponses(tabledata);
  }, []);

  // ✅ optional backend fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getSubmissions(1);
  //       if (data?.rows) setResponses(data.rows);
  //     } catch (err) {
  //       console.error("Failed to fetch submissions", err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const totalSubmissions = responses.length;
  const todaySubmissions = responses.filter((r) => {
    const today = new Date();
    const ts = new Date(r.timeStamp);
    return ts.toDateString() === today.toDateString();
  }).length;

  // ✅ DataGrid Columns
  const columns = [
    { field: "sl_no", headerName: "Sl No", width: 80 },
    { field: "title", headerName: "Form Title", width: 200 },
    {
      field: "description",
      headerName: "Form Description",
      width: 220,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    { field: "timeStamp", headerName: "Time Stamp", width: 160 },
    {
      field: "isPublished",
      headerName: "Is Published",
      width: 140,
      renderCell: (params) => (
        <span style={{ color: params.value ? "green" : "red" }}>
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    { field: "noOfSubmission", headerName: "No of Submission", width: 160 },
    {
      field: "edit",
      headerName: "Edit Form",
      width: 140,
      renderCell: (params) => <Button onClick={()=>navigate('/questions')}>EDIT</Button>,
    },
    {
      field: "View Response",
      headerName: "Form Response",
      width: 140,
      renderCell: (params) => <Button onClick={()=>navigate('/viewResponse')} >View</Button>,
    },
  ];

  return (
    <Box sx={{ fontFamily: "Roboto", bgcolor: "#f8f5fc", minHeight: "100vh" }}>
      {/* Topbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "white", color: "black" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Untitled Form
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "#673ab7", "&:hover": { bgcolor: "#5e35b1" } }}
          >
            Publish
          </Button>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          centered
          textColor="secondary"
          indicatorColor="secondary"
          sx={{ "& .MuiTab-root": { fontWeight: 500, textTransform: "none" } }}
        >
          <Tab label="Questions" />
          <Tab label="Responses" />
        </Tabs>
      </AppBar>

      <Box p={3}>
        {tab === 1 && (
          <Box sx={{ maxWidth: 850, mx: "auto" }}>
            {/* Export & Stats */}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                {totalSubmissions} submissions
              </Typography>

              {/* Export Button with Menu */}
              <Button
                variant="outlined"
                onClick={handleMenuClick}
                sx={{ textTransform: "none", fontWeight: 500 }}
                disabled={totalSubmissions === 0}
              >
                EXPORT ALL DATA
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleExport("csv")}>CSV</MenuItem>
                <MenuItem onClick={() => handleExport("excel")}>Excel</MenuItem>
                <MenuItem onClick={() => handleExport("pdf")}>PDF</MenuItem>
                <MenuItem onClick={() => handleExport("json")}>
                  Export JSON
                </MenuItem>
              </Menu>
            </Paper>

            {/* Stats Cards */}
            <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
              <Grid container spacing={2}>
                {[
                  {
                    label: "Total Submissions",
                    value: totalSubmissions,
                    icon: <Assignment sx={{ color: "primary.main" }} />,
                  },
                  {
                    label: "Today's Submissions",
                    value: todaySubmissions,
                    icon: <TrendingUp sx={{ color: "green" }} />,
                  },
                ].map((stat, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: 2,
                        justifyContent: "center",
                      }}
                    >
                      {stat.icon}
                      <Box>
                        <Typography variant="subtitle2">
                          {stat.label}
                        </Typography>
                        <Typography variant="h5">{stat.value}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Responses DataGrid */}
            {totalSubmissions === 0 ? (
              <Paper
                sx={{ p: 4, textAlign: "center", color: "gray" }}
                elevation={1}
              >
                <Assignment sx={{ fontSize: 40, mb: 1, color: "gray" }} />
                <Typography variant="h6">No submissions yet</Typography>
              </Paper>
            ) : (
              <Paper sx={{ height: 500, width: "100%", p: 2 }} elevation={1}>
                <Typography variant="h6" gutterBottom>
                  Forms Table
                </Typography>
                <DataGrid
                  rows={responses}
                  columns={columns}
                  getRowId={(row) => row.sl_no} // ✅ use sl_no as ID
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  onRowClick={(params) => setSelectedSubmission(params.row)}
                />
              </Paper>
            )}

            {/* Submission Dialog */}
            <Dialog
              open={!!selectedSubmission}
              onClose={() => setSelectedSubmission(null)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Form Details</DialogTitle>
              <DialogContent dividers>
                {selectedSubmission &&
                  columns.map((col) => (
                    <Box key={col.field} sx={{ mb: 1 }}>
                      <strong>{col.headerName}:</strong>{" "}
                      {selectedSubmission[col.field]?.toString()}
                    </Box>
                  ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Paper,
//   Grid,
//   Button,
//   Tabs,
//   Tab,
//   Menu,
//   MenuItem,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from "@mui/material";
// import { Assignment, TrendingUp } from "@mui/icons-material";
// import { DataGrid } from "@mui/x-data-grid";
// import fields from "../data/fields.json";
// import responsesJson from "../data/responses.json";
// import { exportToCsv, exportToExcel, exportToPdf } from "../utils/exportCsv";
// import { getSubmissions, exportSubmissions } from "../utils/api";

// // Form List JSON
// const formListTableData = [
//   { id: 1, sl_no: 1, title: "Employee Feedback", description: "Quarterly feedback form for employees", timeStamp: "2025-09-30 10:30 AM", isPublished: true, noOfSubmission: 45 },
//   { id: 2, sl_no: 2, title: "Customer Satisfaction Survey", description: "Survey to gather customer satisfaction levels", timeStamp: "2025-09-28 04:15 PM", isPublished: false, noOfSubmission: 0 },
//   { id: 3, sl_no: 3, title: "Training Registration", description: "Form for employees to register for training", timeStamp: "2025-09-25 11:45 AM", isPublished: true, noOfSubmission: 120 },
//   { id: 4, sl_no: 4, title: "Project Feedback", description: "Collect feedback on recent projects", timeStamp: "2025-09-20 09:20 AM", isPublished: true, noOfSubmission: 32 },
//   { id: 5, sl_no: 5, title: "Leave Application", description: "Form for submitting leave requests", timeStamp: "2025-09-18 02:10 PM", isPublished: false, noOfSubmission: 5 },
// ];

// // Form List Table headers
// const formListTableHeader = [
//   { field: "sl_no", headerName: "Sl No", width: 80 },
//   { field: "title", headerName: "Form Title", width: 200 },
//   { field: "description", headerName: "Form Description", width: 250, renderCell: (params) => (
//       <Tooltip title={params.value || ""}>
//         <span>{params.value}</span>
//       </Tooltip>
//   )},
//   { field: "timeStamp", headerName: "Time Stamp", width: 150 },
//   { field: "isPublished", headerName: "Is Published", width: 120, renderCell: (params) => (params.value ? "Yes" : "No") },
//   { field: "noOfSubmission", headerName: "No of Submission", width: 150 },
// ];

// const AdminDashboard = () => {
//   const [tab, setTab] = useState(0); // 0 -> Forms List, 1 -> Responses
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const open = Boolean(anchorEl);

//   // Export Menu
//   const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);
//   const handleExport = (type) => {
//     if (tab === 0) {
//       if (type === "csv") exportToCsv(formListTableHeader, formListTableData);
//       if (type === "excel") exportToExcel(formListTableHeader, formListTableData);
//       if (type === "pdf") exportToPdf(formListTableHeader, formListTableData);
//     } else {
//       if (type === "csv") exportToCsv(fields, responses);
//       if (type === "excel") exportToExcel(fields, responses);
//       if (type === "pdf") exportToPdf(fields, responses);
//       if (type === "json") exportSubmissions(1);
//     }
//     handleMenuClose();
//   };

//   // Load dummy responses or fetch from backend
//   useEffect(() => {
//     setResponses(responsesJson);
//     const fetchData = async () => {
//       try {
//         const data = await getSubmissions(1);
//         setResponses(data.rows || []);
//       } catch (err) {
//         console.error("Failed to fetch submissions", err);
//       }
//     };
//     fetchData();
//   }, []);

//   const totalSubmissions = responses.length;
//   const todaySubmissions = responses.filter(r => {
//     const today = new Date();
//     const ts = new Date(r.timestamp);
//     return ts.toDateString() === today.toDateString();
//   }).length;

//   return (
//     <Box sx={{ fontFamily: "Roboto", bgcolor: "#f8f5fc", minHeight: "100vh" }}>
//       {/* Topbar */}
//       <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "black" }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography variant="h6" sx={{ fontWeight: 500 }}>Admin Dashboard</Typography>
//           <Button variant="contained" sx={{ bgcolor: "#673ab7", "&:hover": { bgcolor: "#5e35b1" } }}>Publish</Button>
//         </Toolbar>
//         <Tabs
//           value={tab}
//           onChange={(e, newValue) => setTab(newValue)}
//           centered
//           textColor="secondary"
//           indicatorColor="secondary"
//           sx={{ "& .MuiTab-root": { fontWeight: 500, textTransform: "none" } }}
//         >
//           <Tab label="Forms List" />
//           <Tab label="Responses" />
//         </Tabs>
//       </AppBar>

//       <Box p={3}>
//         <Paper elevation={1} sx={{ p:2, mb:2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//           <Typography variant="h6">{tab === 0 ? formListTableData.length + " forms" : totalSubmissions + " submissions"}</Typography>
//           <Button variant="outlined" onClick={handleMenuClick} sx={{ textTransform:"none", fontWeight:500 }}>
//             EXPORT ALL DATA
//           </Button>
//           <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//             <MenuItem onClick={() => handleExport("csv")}>CSV</MenuItem>
//             <MenuItem onClick={() => handleExport("excel")}>Excel</MenuItem>
//             <MenuItem onClick={() => handleExport("pdf")}>PDF</MenuItem>
//             {tab === 1 && <MenuItem onClick={() => handleExport("json")}>Export JSON</MenuItem>}
//           </Menu>
//         </Paper>

//         {tab === 0 ? (
//           <Paper sx={{ p:2 }}>
//             <div style={{ height: 450, width:"100%" }}>
//               <DataGrid rows={formListTableData} columns={formListTableHeader} pageSize={5} rowsPerPageOptions={[5,10,20]} disableSelectionOnClick />
//             </div>
//           </Paper>
//         ) : (
//           <Paper sx={{ p:2 }}>
//             <Typography variant="h6" gutterBottom>Responses Table</Typography>
//             <div style={{ height: 400, width:"100%" }}>
//               <DataGrid
//                 rows={responses.map((resp, idx) => ({
//                   id: idx+1,
//                   timestamp: new Date(resp.timestamp).toLocaleString(),
//                   fullData: resp
//                 }))}
//                 columns={[
//                   { field: "id", headerName:"S.No", width:80 },
//                   { field: "timestamp", headerName:"Timestamp", width:200 },
//                 ]}
//                 pageSize={5}
//                 rowsPerPageOptions={[5,10,20]}
//                 onRowClick={(params) => setSelectedSubmission(params.row.fullData)}
//               />
//             </div>

//             {/* Submission Dialog */}
//             <Dialog open={!!selectedSubmission} onClose={()=>setSelectedSubmission(null)} fullWidth maxWidth="sm">
//               <DialogTitle>Submission Details</DialogTitle>
//               <DialogContent dividers>
//                 {selectedSubmission && fields.map((f, idx)=>(
//                   <Box key={idx} sx={{mb:1}}>
//                     <strong>{f.label}:</strong> {selectedSubmission[f.id] || "-"}
//                   </Box>
//                 ))}
//                 {selectedSubmission && (
//                   <Box sx={{mt:1}}>
//                     <strong>Timestamp:</strong> {new Date(selectedSubmission.timestamp).toLocaleString()}
//                   </Box>
//                 )}
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={()=>setSelectedSubmission(null)}>Close</Button>
//               </DialogActions>
//             </Dialog>
//           </Paper>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default AdminDashboard;
