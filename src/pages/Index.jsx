import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Switch, 
  FormControlLabel,
  AppBar,
  Toolbar,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Brightness4 as DarkIcon, 
  Brightness7 as LightIcon,
  Build as BuildIcon,
  AdminPanelSettings as AdminIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import FormBuilder from '../components/FormBuilder';
import FormPreview from '../components/FormPreview';
import FormPreviewModal from '../components/FormPreviewModal';
import AdminPanel from '../components/AdminPanel';
import {defaultFormSchema} from "../utils/formSchema"

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);
  const [schema, setSchema] = useState(defaultFormSchema);
  const [activeTab, setActiveTab] = useState(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const handleSchemaChange = (newSchema) => {
    setSchema(newSchema);
  };

  const handleFormSubmission = (formData) => {
    // Save to localStorage for admin panel
    const submission = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      data: formData
    };

    const existingSubmissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    existingSubmissions.push(submission);
    localStorage.setItem('formSubmissions', JSON.stringify(existingSubmissions));

    alert('Form submitted successfully!');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Modern Form Builder
            </Typography>
            
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewModalOpen(true)}
              disabled={schema.fields.length === 0}
              sx={{ mr: 2 }}
            >
              Preview Form
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  icon={<LightIcon />}
                  checkedIcon={<DarkIcon />}
                />
              }
              label=""
            />
          </Toolbar>
        </AppBar>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab 
              icon={<BuildIcon />} 
              label="Form Builder" 
              iconPosition="start"
            />
            <Tab 
              icon={<AdminIcon />} 
              label="Admin Panel" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3} sx={{ height: 'calc(100vh - 180px)' }}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" gutterBottom>
                      Form Builder
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Drag and drop fields to build your form
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <FormBuilder schema={schema} onSchemaChange={handleSchemaChange} />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" gutterBottom>
                      Live Preview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      See how your form will look to users
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <FormPreview schema={schema} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <AdminPanel />
        )}

        <FormPreviewModal
          open={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          schema={schema}
          onSubmit={handleFormSubmission}
        />
      </Box>
    </ThemeProvider>
  );
} 