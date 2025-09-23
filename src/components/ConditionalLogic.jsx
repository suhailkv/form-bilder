import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
} from "@mui/material";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { getAvailableFieldsForConditions } from "../utils/formSchema";

const ConditionalLogic = ({ field, allFields, onChange }) => {
  const [conditions, setConditions] = useState(field.conditions || []);

  const availableFields = getAvailableFieldsForConditions(allFields, field.id);

  const handleAddCondition = () => {
    const newCondition = { field: availableFields[0]?.id || "", value: "" };
    setConditions([...conditions, newCondition]);
    console.log("Added condition for field", field.id, ":", newCondition);
  };

  const handleConditionChange = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [key]: value };
    setConditions(newConditions);
    onChange({ conditions: newConditions });
    console.log("Updated conditions for field", field.id, ":", newConditions);
  };

  const handleRemoveCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    onChange({ conditions: newConditions });
    console.log("Removed condition for field", field.id, ":", newConditions);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Conditional Logic
      </Typography>
      {conditions.map((condition, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Field</InputLabel>
            <Select
              value={condition.field}
              onChange={(e) => handleConditionChange(index, "field", e.target.value)}
            >
              {availableFields.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Value</InputLabel>
            <Select
              value={condition.value}
              onChange={(e) => handleConditionChange(index, "value", e.target.value)}
            >
              {allFields
                .find((f) => f.id === condition.field)
                ?.options?.map((opt, i) => (
                  <MenuItem key={i} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <IconButton onClick={() => handleRemoveCondition(index)}>
            <DeleteOutlineOutlined />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        onClick={handleAddCondition}
        disabled={availableFields.length === 0}
      >
        Add Condition
      </Button>
    </Box>
  );
};

export default ConditionalLogic;