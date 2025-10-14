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
    label: "" ,
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
      return { ...baseField, accept: "", maxSize: "" }; // Optional: Add accept and maxSize
     
    default:
      return baseField;
  }
};

export const defaultFormSchema = {
  title: "Sample Form with Conditional Logic",
  description: "This form demonstrates conditional field rendering",
  fields: [
    {
      id: "q1",
      type: "select",
      label: "Do you have a car?",
      required: true,
      options: ["Yes", "No"],
      conditions: [],
    },
    {
      id: "q2",
      type: "text",
      label: "Which model do you have?",
      placeholder: "e.g., Toyota Camry",
      required: false,
      conditions: [{ field: "q1", value: "Yes" }],
    },
    {
      id: "q3",
      type: "select",
      label: "Do you want a loan?",
      required: true,
      options: ["Yes", "No"],
      conditions: [],
    },
    {
      id: "q4",
      type: "select",
      label: "How much money do you want?",
      required: false,
      options: ["1 Lakh", "2 Lakhs"],
      conditions: [{ field: "q3", value: "Yes" }],
    },
 {
      id: "q1",
      type: "multipleChoice",
      label: "Favorite Food",
      required: true,
      options: ["Pizza", "Burger", "Biriyani", "Pasta", "Other"],
      conditions: [],
    },
    {
      id: "q2",
      type: "uploadFile",
      label: "Upload Image",
      required: false,
      accept: "image/*", // allow images only
      maxSize: 5 * 1024 * 1024, // 5 MB
      conditions: [],
    },
  ],
};







export const evaluateConditions = (field, formData) => {
  if (!field.conditions || field.conditions.length === 0) {
    return true; // Show fields with no conditions
  }

  const result = field.conditions.every((condition) => {
    const fieldValue = formData[condition.field];
    console.log(`Evaluating condition for field ${field.id}:`, {
      conditionField: condition.field,
      conditionValue: condition.value,
      currentFieldValue: fieldValue,
    });
    // If the field has no response or is empty, hide conditional fields
    if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
      return false;
    }
    // For multipleChoice (array-based), check if the condition value is included
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(condition.value);
    }
    // For uploadFile, check if a file is present (true/false)
    if (field.type === "uploadFile") {
      return fieldValue ? condition.value === "true" : condition.value === "false";
    }
    // For select, radio, text, etc., compare directly
    return fieldValue === condition.value;
  });

  return result;
};

export const getAvailableFieldsForConditions = (fields, currentFieldId) => {
  return fields.filter((field) => field.id !== currentFieldId);
};

