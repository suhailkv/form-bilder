import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Box,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const FormPreviewModal = ({ open, onClose, schema, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
    onClose();
  };

  const shouldShowField = (field) => {
    if (!field.conditions || field.conditions.length === 0) return true;
    
    return field.conditions.every(condition => {
      const fieldValue = formData[condition.field];
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'contains':
          return fieldValue && fieldValue.includes(condition.value);
        default:
          return true;
      }
    });
  };

  const renderField = (field) => {
    if (!shouldShowField(field)) return null;

    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.id}
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            margin="normal"
          />
        );

      case 'number':
        return (
          <TextField
            key={field.id}
            fullWidth
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            margin="normal"
          />
        );

      case 'select':
        return (
          <FormControl key={field.id} fullWidth margin="normal" required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleInputChange(field.id, e.target.checked)}
              />
            }
            label={field.label}
          />
        );

      case 'radio':
        return (
          <FormControl key={field.id} component="fieldset" margin="normal" required={field.required}>
            <Typography variant="subtitle1" gutterBottom>
              {field.label}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Form Preview</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <form onSubmit={handleSubmit}>
            {schema.fields.map(renderField)}
          </form>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<VisibilityIcon />}
        >
          Submit Form
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormPreviewModal;