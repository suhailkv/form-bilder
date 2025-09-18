import React, { useState, useEffect } from 'react';
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
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { fieldTypes, createNewField } from '../utils/formSchema';
import ConditionalLogic from './ConditionalLogic';

const FieldEditor = ({ open, field, allFields, onSave, onClose }) => {
  const [editedField, setEditedField] = useState(null);
  const [isNewField, setIsNewField] = useState(false);

  useEffect(() => {
    if (open) {
      if (field) {
        setEditedField({ ...field });
        setIsNewField(false);
      } else {
        setEditedField(createNewField('text'));
        setIsNewField(true);
      }
    }
  }, [open, field]);

  if (!editedField) return null;

  const handleSave = () => {
    if (!editedField.label.trim()) {
      alert('Please enter a field label');
      return;
    }
    onSave(editedField);
    onClose();
  };

  const updateField = (updates) => {
    setEditedField(prev => ({ ...prev, ...updates }));
  };

  const updateOptions = (options) => {
    updateField({ options });
  };

  const addOption = () => {
    const newOptions = [...(editedField.options || []), `Option ${(editedField.options?.length || 0) + 1}`];
    updateOptions(newOptions);
  };

  const updateOption = (index, value) => {
    const newOptions = [...editedField.options];
    newOptions[index] = value;
    updateOptions(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = editedField.options.filter((_, i) => i !== index);
    updateOptions(newOptions);
  };

  const handleTypeChange = (newType) => {
    const newField = createNewField(newType, editedField.id);
    setEditedField({
      ...newField,
      label: editedField.label,
      required: editedField.required,
      conditions: editedField.conditions
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isNewField ? 'Add New Field' : 'Edit Field'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Basic Field Properties */}
          <Box>
            <Typography variant="h6" gutterBottom>Basic Properties</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Field Type</InputLabel>
                <Select
                  value={editedField.type}
                  label="Field Type"
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  {Object.entries(fieldTypes).map(([type, config]) => (
                    <MenuItem key={type} value={type}>
                      {config.icon} {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Field ID"
                value={editedField.id}
                onChange={(e) => updateField({ id: e.target.value })}
                disabled={!isNewField}
                sx={{ minWidth: 150 }}
              />
            </Box>

            <TextField
              fullWidth
              label="Label"
              value={editedField.label}
              onChange={(e) => updateField({ label: e.target.value })}
              sx={{ mb: 2 }}
            />

            {(editedField.type === 'text' || editedField.type === 'number') && (
              <TextField
                fullWidth
                label="Placeholder"
                value={editedField.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                sx={{ mb: 2 }}
              />
            )}

            {editedField.type === 'number' && (
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Min Value"
                  type="number"
                  value={editedField.min || ''}
                  onChange={(e) => updateField({ min: e.target.value })}
                />
                <TextField
                  label="Max Value"
                  type="number"
                  value={editedField.max || ''}
                  onChange={(e) => updateField({ max: e.target.value })}
                />
              </Box>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={editedField.required || false}
                  onChange={(e) => updateField({ required: e.target.checked })}
                />
              }
              label="Required field"
            />
          </Box>

          {/* Options for Select and Radio */}
          {(editedField.type === 'select' || editedField.type === 'radio') && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Options</Typography>
                <Button startIcon={<Add />} onClick={addOption} variant="outlined" size="small">
                  Add Option
                </Button>
              </Box>

              {editedField.options?.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeOption(index)}
                    color="error"
                    disabled={editedField.options.length <= 1}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Divider />

          {/* Conditional Logic */}
          <ConditionalLogic
            field={editedField}
            allFields={allFields}
            onChange={setEditedField}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {isNewField ? 'Add Field' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldEditor;