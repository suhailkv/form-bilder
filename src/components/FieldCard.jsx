import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import {
  DragIndicator,
  Edit,
  Delete,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fieldTypes } from '../utils/formSchema';

const FieldCard = ({ field, onEdit, onDelete, hasConditions }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        border: hasConditions ? '2px solid #1976d2' : '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: 3,
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" flex={1}>
            <IconButton
              {...attributes}
              {...listeners}
              size="small"
              sx={{ mr: 1, cursor: 'grab' }}
            >
              <DragIndicator />
            </IconButton>
            
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography variant="body2" component="span">
                  {fieldTypes[field.type].icon}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {field.label}
                </Typography>
                {field.required && (
                  <Chip label="Required" size="small" color="error" />
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                {fieldTypes[field.type].label} • ID: {field.id}
              </Typography>
              
              {field.conditions && field.conditions.length > 0 && (
                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                  <VisibilityOff fontSize="small" color="primary" />
                  <Typography variant="caption" color="primary">
                    {field.conditions.length} condition(s)
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box>
            <IconButton
              size="small"
              onClick={() => onEdit(field)}
              sx={{ mr: 0.5 }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(field.id)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FieldCard;