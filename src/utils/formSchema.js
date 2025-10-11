export const fieldTypes = {
  text: { label: "Text Input" },
  number: { label: "Number Input" },
  select: { label: "Dropdown" },
  checkbox: { label: "Checkbox" },
  radio: { label: "Radio Group" },
  multipleChoice: { label: "Multiple Choice" },
  uploadFile: { label: "Upload File" },
};

export const createNewField = (type, id) => {
  const baseField = {
    id: id || `field_${Date.now()}`,
    type,
    label: `New ${fieldTypes[type]?.label || "Field"}`,
    required: false,
    conditions: [],
  };

  switch (type) {
    case "text":
      return { ...baseField, placeholder: "Enter text..." };
    case "number":
      return { ...baseField, placeholder: "Enter number...", min: "", max: "" };
    case "select":
    case "radio":
    case "multipleChoice":
      return { ...baseField, options: ["Option 1", "Option 2"] };
    case "checkbox":
      return { ...baseField, defaultChecked: false };
    case "uploadFile":
      return { ...baseField, accept: "", maxSize: "" };
    default:
      return baseField;
  }
};

// Determine if a field should render based on conditional logic
export const evaluateConditions = (field, formData) => {
  if (!field.conditions || field.conditions.length === 0) return true; // Show if no conditions

  return field.conditions.every((condition) => {//AND condition only
    const fieldValue = formData[condition.field];
    const expectedValue = condition.value;

    // Hide if controller field has no value
    if (fieldValue === undefined || fieldValue === null || fieldValue === "") return false;

    if (typeof fieldValue === "boolean") {
      const expectedBool = expectedValue === "true";
      return fieldValue === expectedBool;
    }

    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(expectedValue);
    }

    if (!isNaN(fieldValue) && !isNaN(expectedValue)) {
      return Number(fieldValue) === Number(expectedValue);
    }

    if (field.type === "uploadFile") {
      return !!fieldValue === (expectedValue === "true");
    }

    return String(fieldValue).trim() === String(expectedValue).trim();
  });
};

export const getAvailableFieldsForConditions = (fields, currentFieldId) =>
  fields.filter((f) => f.id !== currentFieldId);
