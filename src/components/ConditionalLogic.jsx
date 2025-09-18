import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Chip
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { getAvailableFieldsForConditions } from '../utils/formSchema';

const ConditionalLogic = ({ field, allFields, onChange }) => {
  const availableFields = getAvailableFieldsForConditions(allFields, field.id);

  const addCondition = () => {
    const newConditions = [...(field.conditions || []), { field: '', value: '' }];
    onChange({ ...field, conditions: newConditions });
  };

  const updateCondition = (index, updates) => {
    const newConditions = [...field.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    onChange({ ...field, conditions: newConditions });
  };

  const removeCondition = (index) => {
    const newConditions = field.conditions.filter((_, i) => i !== index);
    onChange({ ...field, conditions: newConditions });
  };

  const getFieldOptions = (fieldId) => {
    const targetField = allFields.find(f => f.id === fieldId);
    if (!targetField) return [];
    
    if (targetField.type === 'select' || targetField.type === 'radio') {
      return targetField.options || [];
    }
    if (targetField.type === 'checkbox') {
      return ['true', 'false'];
    }
    return [];
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Conditional Logic</Typography>
        <IconButton onClick={addCondition} color="primary">
          <Add />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        This field will only show when all conditions are met:
      </Typography>

      {field.conditions && field.conditions.length > 0 ? (
        field.conditions.map((condition, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography variant="body2" fontWeight="bold">
                Show when:
              </Typography>
              <IconButton
                size="small"
                onClick={() => removeCondition(index)}
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Field</InputLabel>
                <Select
                  value={condition.field || ''}
                  label="Field"
                  onChange={(e) => updateCondition(index, { field: e.target.value, value: '' })}
                >
                  {availableFields.map(f => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="body2">equals</Typography>

              {condition.field && getFieldOptions(condition.field).length > 0 ? (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Value</InputLabel>
                  <Select
                    value={condition.value || ''}
                    label="Value"
                    onChange={(e) => updateCondition(index, { value: e.target.value })}
                  >
                    {getFieldOptions(condition.field).map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  size="small"
                  label="Value"
                  value={condition.value || ''}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                  sx={{ minWidth: 120 }}
                />
              )}
            </Box>
          </Box>
        ))
      ) : (
        <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
          <Typography variant="body2">
            No conditions set. This field will always be visible.
          </Typography>
          <Typography variant="caption">
            Click the + button to add conditions.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ConditionalLogic;