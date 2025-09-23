import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Assignment, TrendingUp, CloudUpload } from "@mui/icons-material";
import fields from "../data/fields.json";
import responsesJson from "../data/responses.json";
import { exportToCsv } from "../utils/exportCsv";

const AdminDashboard = () => {
  const [tab, setTab] = useState(1);
  const [responses, setResponses] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    setResponses(responsesJson);
  }, []);

  const handleChange = (event, newValue) => setTab(newValue);
  const handleExport = () => exportToCsv(responses);

  const totalSubmissions = responses.length;
  const todaySubmissions = responses.filter(r => {
    const today = new Date();
    const ts = new Date(r.timestamp);
    return ts.toDateString() === today.toDateString();
  }).length;

  return (
    <Box sx={{ fontFamily: "Roboto", bgcolor: "#f8f5fc", minHeight: "100vh" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Untitled Form</Typography>
          <Button variant="contained" sx={{ bgcolor: "#673ab7", "&:hover": { bgcolor: "#5e35b1" } }}>Publish</Button>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={handleChange}
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
          <Box sx={{ maxWidth: 1000, mx: "auto" }}>
            {/* Export & Stats */}
            <Paper elevation={1} sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">{totalSubmissions} submissions</Typography>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ textTransform: "none", fontWeight: 500 }}
                onClick={handleExport}
                disabled={totalSubmissions === 0}
              >
                EXPORT ALL DATA
              </Button>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
              <Grid container spacing={2}>
                {[ 
                  { label: "Total Submissions", value: totalSubmissions, icon: <Assignment sx={{ color: "primary.main" }} /> },
                  { label: "Today's Submissions", value: todaySubmissions, icon: <TrendingUp sx={{ color: "green" }} /> }
                ].map((stat, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2, justifyContent: "center" }}>
                      {stat.icon}
                      <Box>
                        <Typography variant="subtitle2">{stat.label}</Typography>
                        <Typography variant="h5">{stat.value}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Responses Table */}
            {totalSubmissions === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", color: "gray" }} elevation={1}>
                <Assignment sx={{ fontSize: 40, mb: 1, color: "gray" }} />
                <Typography variant="h6">No submissions yet</Typography>
              </Paper>
            ) : (
              <Paper sx={{ p: 2 }} elevation={1}>
                <Typography variant="h6" gutterBottom>Responses Table</Typography>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {responses.map((resp) => (
                      <TableRow key={resp.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" }, "&:hover": { backgroundColor: "#e0e0e0", cursor: "pointer" } }}>
                        <TableCell align="center">{resp.id}</TableCell>
                        <TableCell
                          align="center"
                          sx={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                          onClick={() => setSelectedSubmission(resp)}
                        >
                          Submitted
                        </TableCell>
                        <TableCell align="center">{new Date(resp.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Submission Dialog */}
                <Dialog open={!!selectedSubmission} onClose={() => setSelectedSubmission(null)} fullWidth maxWidth="sm">
                  <DialogTitle>Submission Details</DialogTitle>
                  <DialogContent dividers>
                    {selectedSubmission && fields.map((f, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <strong>{f.label}:</strong> {selectedSubmission.responses[f.id] || "-"}
                      </Box>
                    ))}
                    {selectedSubmission && (
                      <Box sx={{ mt: 1 }}>
                        <strong>Timestamp:</strong> {new Date(selectedSubmission.timestamp).toLocaleString()}
                      </Box>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setSelectedSubmission(null)}>Close</Button>
                  </DialogActions>
                </Dialog>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
