import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';


const AdminPanel = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    // Load submissions from localStorage
    const savedSubmissions = localStorage.getItem('formSubmissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleDeleteSubmission = (id) => {
    const updatedSubmissions = submissions.filter(sub => sub.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('formSubmissions', JSON.stringify(updatedSubmissions));
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(submissions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'form_submissions.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatsCards = () => {
    const totalSubmissions = submissions.length;
    const todaySubmissions = submissions.filter(sub => 
      new Date(sub.timestamp).toDateString() === new Date().toDateString()
    ).length;
    const avgFieldsPerSubmission = submissions.length > 0 
      ? Math.round(submissions.reduce((acc, sub) => acc + Object.keys(sub.data).length, 0) / submissions.length)
      : 0;

    return [
      {
        title: 'Total Submissions',
        value: totalSubmissions,
        icon: <AssignmentIcon />,
        color: 'primary'
      },
      {
        title: 'Today\'s Submissions',
        value: todaySubmissions,
        icon: <TrendingUpIcon />,
        color: 'success'
      },
      {
        title: 'Avg Fields per Form',
        value: avgFieldsPerSubmission,
        icon: <PeopleIcon />,
        color: 'info'
      }
    ];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportData}
          disabled={submissions.length === 0}
        >
          Export All Data
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {getStatsCards().map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Submissions Table */}
      <Paper elevation={2}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Form Submissions ({submissions.length})
          </Typography>
        </Box>
        <Divider />
        
        {submissions.length === 0 ? (
          <Box p={4} textAlign="center">
            <AssignmentIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No submissions yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Form submissions will appear here once users start filling out forms
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Submission ID</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell>Fields Count</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {submission.id.slice(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(submission.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${Object.keys(submission.data).length} fields`} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Completed" 
                        color="success" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleViewSubmission(submission)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteSubmission(submission.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* View Submission Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Submission Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Submitted: {formatDate(selectedSubmission.timestamp)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom mb={2}>
                ID: {selectedSubmission.id}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Form Data:
              </Typography>
              
              <Grid container spacing={2}>
                {Object.entries(selectedSubmission.data).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        {key}
                      </Typography>
                      <Typography variant="body1">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;