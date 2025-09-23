import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Button,
  Divider,
  Alert
} from '@mui/material';
import { evaluateConditions } from '../utils/formSchema';

const FormPreview = ({ schema }) => {
  const [formData, setFormData] = useState({});
  const [visibleFields, setVisibleFields] = useState([]);

 
  useEffect(() => {
    const visible = schema.fields.filter(field => 
      evaluateConditions(field, formData)
    );
    setVisibleFields(visible);
  }, [schema.fields, formData]);

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
  
    const requiredFields = visibleFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => 
      !formData[field.id] || formData[field.id] === ''
    );

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }


    alert(`Form submitted!\n\nData:\n${JSON.stringify(formData, null, 2)}`);
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            sx={{ mb: 2 }}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            inputProps={{
              min: field.min || undefined,
              max: field.max || undefined
            }}
            sx={{ mb: 2 }}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
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

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={value === true || value === 'true'}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              />
            }
            label={field.label}
            sx={{ mb: 2, display: 'block' }}
          />
        );

      default:
        return null;
    }
  };

  const hiddenFieldsCount = schema.fields.length - visibleFields.length;

  return (
    <Paper sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      {/* Form Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {schema.title || 'Untitled Form'}
        </Typography>
        {schema.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {schema.description}
          </Typography>
        )}
        
        {hiddenFieldsCount > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {hiddenFieldsCount} field(s) are hidden due to conditional logic
          </Alert>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

    
      {schema.fields.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6, 
          color: 'text.secondary',
          border: '2px dashed #e0e0e0',
          borderRadius: 1
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No fields to preview
          </Typography>
          <Typography variant="body2">
            Add fields in the builder to see the preview
          </Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          {visibleFields.map((field) => (
            <Box key={field.id}>
              {renderField(field)}
            </Box>
          ))}

          {visibleFields.length > 0 && (
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Submit Form
              </Button>
            </Box>
          )}
        </form>
      )}

   
      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Form Data (Debug):
        </Typography>
        <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
          {JSON.stringify(formData, null, 2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FormPreview;