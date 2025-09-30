import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { getAvailableFieldsForConditions } from "../utils/formSchema";

const ConditionalLogic = ({ field, allFields, onChange }) => {
 const [conditions, setConditions] = useState(field.conditions || []);
  
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.between("lg", "xl"));

  // Sync local state when field.conditions changes (e.g., when loading schema data)
  useEffect(() => {
    setConditions(field.conditions || []);
  }, [field.conditions, field.id]);

  const availableFields = getAvailableFieldsForConditions(allFields, field.id);

  const getFieldOptions = (fieldId) => {
    const targetField = allFields.find((f) => f.id === fieldId);
    if (!targetField) return [];
    if (targetField.type === "select" || targetField.type === "radio") {
      return targetField.options || [];
    }
    if (targetField.type === 'multipleChoice') {
      return targetField.options || [];
    }
    if (targetField.type === "checkbox" || targetField.type === "uploadFile") {
      return ["true", "false"];
    }
    return [];
  };

  const handleAddCondition = () => {
    console.log('Adding condition, available fields:', availableFields);
    
    const newCondition = { field: availableFields[0]?.id || "", value: "" };
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    onChange({ ...field, conditions: newConditions });
    console.log("Added condition for field", field.id, ":", newCondition);
  };

  const handleConditionChange = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [key]: value };
    
    // If field changed, reset value
    if (key === "field") {
      newConditions[index].value = "";
    }
    
    setConditions(newConditions);
    onChange({ ...field, conditions: newConditions });
    console.log("Updated conditions for field", field.id, ":", newConditions);
  };

  const handleRemoveCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    onChange({ ...field, conditions: newConditions });
    console.log("Removed condition for field", field.id, ":", newConditions);
  };

  const getResponsiveConfig = () => {
    if (isXs) {
      return {
        direction: "column",
        fieldMinWidth: "100%",
        valueMinWidth: "100%",
        spacing: 2,
        titleVariant: "subtitle2",
        bodyVariant: "body2",
        captionVariant: "caption",
        buttonSize: "small",
        iconSize: "small"
      };
    }
    
    if (isSm) {
      return {
        direction: "column",
        fieldMinWidth: "100%",
        valueMinWidth: "100%",
        spacing: 2,
        titleVariant: "subtitle1",
        bodyVariant: "body2",
        captionVariant: "caption",
        buttonSize: "small",
        iconSize: "small"
      };
    }
    
    if (isMd) {
      return {
        direction: "row",
        fieldMinWidth: 180,
        valueMinWidth: 180,
        spacing: 1.5,
        titleVariant: "subtitle1",
        bodyVariant: "body2",
        captionVariant: "caption",
        buttonSize: "medium",
        iconSize: "medium"
      };
    }
    
    if (isLg) {
      return {
        direction: "row",
        fieldMinWidth: 220,
        valueMinWidth: 220,
        spacing: 2,
        titleVariant: "subtitle1",
        bodyVariant: "body2",
        captionVariant: "caption",
        buttonSize: "medium",
        iconSize: "medium"
      };
    }
    
    return {
      direction: "row",
      fieldMinWidth: 250,
      valueMinWidth: 250,
      spacing: 2,
      titleVariant: "h6",
      bodyVariant: "body1",
      captionVariant: "body2",
      buttonSize: "medium",
      iconSize: "medium"
    };
  };

  const config = getResponsiveConfig();

  return (
    <Box sx={{ 
      width: "100%",
      px: { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
      py: { xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }
    }}>
      <Typography 
        variant={config.titleVariant} 
        gutterBottom
        sx={{
          fontWeight: { xs: 500, sm: 500, md: 600, lg: 600, xl: 600 },
          mb: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }
        }}
      >
        Conditional Logic
      </Typography>
      
      {conditions.length > 0 ? (
        <Box sx={{ mb: { xs: 2, sm: 2, md: 3, lg: 3, xl: 4 } }}>
          {conditions.map((condition, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: "flex", 
                flexDirection: config.direction,
                alignItems: config.direction === "row" ? "center" : "stretch",
                mb: config.spacing,
                gap: { xs: 2, sm: 2, md: 1.5, lg: 2, xl: 2 },
                p: { xs: 2, sm: 2, md: 2, lg: 2.5, xl: 3 },
                border: { xs: "1px solid", sm: "1px solid", md: "none", lg: "none", xl: "none" },
                borderColor: { xs: "divider", sm: "divider" },
                borderRadius: { xs: 1, sm: 1 },
                bgcolor: { xs: "grey.50", sm: "grey.50", md: "transparent", lg: "transparent", xl: "transparent" }
              }}
            >
              <FormControl 
                sx={{ 
                  minWidth: config.fieldMinWidth,
                  width: config.direction === "column" ? "100%" : "auto",
                  flex: config.direction === "row" ? 1 : "none"
                }}
                size={config.buttonSize}
              >
                <InputLabel sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  Field
                </InputLabel>
                <Select
                  value={condition.field || ""}
                  onChange={(e) => handleConditionChange(index, "field", e.target.value)}
                  label="Field"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  {availableFields.map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      <Typography variant="body2" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                        {f.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {condition.field && getFieldOptions(condition.field).length > 0 ? (
                <FormControl 
                  sx={{ 
                    minWidth: config.valueMinWidth,
                    width: config.direction === "column" ? "100%" : "auto",
                    flex: config.direction === "row" ? 1 : "none"
                  }}
                  size={config.buttonSize}
                >
                  <InputLabel sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    Value
                  </InputLabel>
                  <Select
                    value={condition.value || ""}
                    onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                    label="Value"
                    sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    {getFieldOptions(condition.field).map((opt, i) => (
                      <MenuItem key={i} value={opt}>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          {opt}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  size={config.buttonSize}
                  label="Value"
                  value={condition.value || ""}
                  onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                  sx={{ 
                    minWidth: config.valueMinWidth,
                    width: config.direction === "column" ? "100%" : "auto",
                    flex: config.direction === "row" ? 1 : "none",
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" }
                    },
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.875rem", sm: "1rem" }
                    }
                  }}
                />
              )}
              
              <Box 
                sx={{ 
                  display: "flex",
                  justifyContent: config.direction === "column" ? "flex-end" : "center",
                  alignSelf: config.direction === "column" ? "flex-end" : "center"
                }}
              >
                <IconButton 
                  onClick={() => handleRemoveCondition(index)}
                  size={config.iconSize}
                  sx={{
                    color: "error.main",
                    "&:hover": {
                      bgcolor: "error.light",
                      color: "error.dark"
                    }
                  }}
                >
                  <DeleteOutlineOutlined fontSize={config.iconSize} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ 
          textAlign: "center", 
          py: { xs: 3, sm: 4, md: 5, lg: 6, xl: 8 }, 
          px: { xs: 2, sm: 3, md: 4, lg: 4, xl: 6 },
          color: "text.secondary",
          bgcolor: { xs: "grey.50", sm: "grey.50", md: "grey.25", lg: "transparent", xl: "transparent" },
          borderRadius: { xs: 1, sm: 2, md: 2, lg: 0, xl: 0 },
          border: { xs: "1px dashed", sm: "1px dashed", md: "1px dashed", lg: "none", xl: "none" },
          borderColor: { xs: "grey.300", sm: "grey.300", md: "grey.400" }
        }}>
          <Typography 
            variant={config.bodyVariant}
            sx={{ 
              mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 },
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem", lg: "1.125rem", xl: "1.125rem" },
              fontWeight: { xs: 400, sm: 500, md: 500, lg: 500, xl: 600 }
            }}
          >
            No conditions set. This field will always be visible.
          </Typography>
          <Typography 
            variant={config.captionVariant}
            sx={{ 
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem", lg: "1rem", xl: "1rem" },
              opacity: { xs: 0.8, sm: 0.7, md: 0.7, lg: 0.6, xl: 0.6 }
            }}
          >
            Click the Add Condition button to set conditions.
          </Typography>
        </Box>
      )}
      
      <Box sx={{ 
        display: "flex", 
        justifyContent: { xs: "stretch", sm: "flex-start" },
        mt: { xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }
      }}>
        <Button
          variant="outlined"
          onClick={handleAddCondition}
          disabled={availableFields.length === 0}
          size={config.buttonSize}
          sx={{
            width: { xs: "100%", sm: "auto" },
            py: { xs: 1.5, sm: 1, md: 1, lg: 1.25, xl: 1.5 },
            px: { xs: 3, sm: 2, md: 3, lg: 4, xl: 5 },
            fontSize: { xs: "0.875rem", sm: "0.875rem", md: "1rem", lg: "1rem", xl: "1.125rem" },
            fontWeight: { xs: 500, sm: 500, md: 600, lg: 600, xl: 600 },
            textTransform: { xs: "none", sm: "none", md: "capitalize", lg: "capitalize", xl: "capitalize" }
          }}
        >
          Add Condition
        </Button>
      </Box>
    </Box>
  );
};

export default ConditionalLogic;