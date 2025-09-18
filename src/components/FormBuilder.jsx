import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { Add } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import FieldCard from './FieldCard';
import FieldEditor from './FieldEditor';
import { fieldTypes, createNewField } from '../utils/formSchema';

const FormBuilder = ({ schema, onSchemaChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = schema.fields.findIndex(field => field.id === active.id);
      const newIndex = schema.fields.findIndex(field => field.id === over.id);
      
      const newFields = arrayMove(schema.fields, oldIndex, newIndex);
      onSchemaChange({ ...schema, fields: newFields });
    }
  };

  const handleAddField = (type) => {
    setAnchorEl(null);
    setEditingField(null);
    setEditorOpen(true);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setEditorOpen(true);
  };

  const handleDeleteField = (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      const newFields = schema.fields.filter(field => field.id !== fieldId);
      onSchemaChange({ ...schema, fields: newFields });
    }
  };

  const handleSaveField = (field) => {
    if (editingField) {
      // Update existing field
      const newFields = schema.fields.map(f => f.id === field.id ? field : f);
      onSchemaChange({ ...schema, fields: newFields });
    } else {
      // Add new field
      const newFields = [...schema.fields, field];
      onSchemaChange({ ...schema, fields: newFields });
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      {/* Form Title and Description */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Form Title"
          value={schema.title}
          onChange={(e) => onSchemaChange({ ...schema, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          label="Form Description"
          value={schema.description}
          onChange={(e) => onSchemaChange({ ...schema, description: e.target.value })}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Add Field Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          fullWidth
          size="large"
        >
          Add Field
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {Object.entries(fieldTypes).map(([type, config]) => (
            <MenuItem key={type} onClick={() => handleAddField(type)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{config.icon}</span>
                <span>{config.label}</span>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Fields List */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Form Fields ({schema.fields.length})
        </Typography>

        {schema.fields.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
            color: 'text.secondary',
            border: '2px dashed #e0e0e0',
            borderRadius: 1
          }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              No fields added yet
            </Typography>
            <Typography variant="body2">
              Click "Add Field" to get started
            </Typography>
          </Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={schema.fields.map(field => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {schema.fields.map((field) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  onEdit={handleEditField}
                  onDelete={handleDeleteField}
                  hasConditions={field.conditions && field.conditions.length > 0}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Box>

      {/* Field Editor Dialog */}
      <FieldEditor
        open={editorOpen}
        field={editingField}
        allFields={schema.fields}
        onSave={handleSaveField}
        onClose={() => {
          setEditorOpen(false);
          setEditingField(null);
        }}
      />
    </Paper>
  );
};

export default FormBuilder;