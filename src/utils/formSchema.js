// Form schema utilities and default data

export const fieldTypes = {
  text: { label: 'Text Input', icon: '📝' },
  number: { label: 'Number Input', icon: '🔢' },
  select: { label: 'Select Dropdown', icon: '📋' },
  checkbox: { label: 'Checkbox', icon: '☑️' },
  radio: { label: 'Radio Group', icon: '🔘' }
};

export const createNewField = (type, id) => {
  const baseField = {
    id: id || `field_${Date.now()}`,
    type,
    label: `New ${fieldTypes[type].label}`,
    required: false,
    conditions: []
  };

  switch (type) {
    case 'text':
      return { ...baseField, placeholder: 'Enter text...' };
    case 'number':
      return { ...baseField, placeholder: 'Enter number...', min: '', max: '' };
    case 'select':
    case 'radio':
      return { ...baseField, options: ['Option 1', 'Option 2'] };
    case 'checkbox':
      return { ...baseField, defaultChecked: false };
    default:
      return baseField;
  }
};

export const defaultFormSchema = {
  title: 'Sample Form with Conditional Logic',
  description: 'This form demonstrates conditional field rendering',
  fields: [
    {
      id: 'q1',
      type: 'select',
      label: 'Do you have a car?',
      required: true,
      options: ['Yes', 'No'],
      conditions: []
    },
    {
      id: 'q2',
      type: 'text',
      label: 'What is your car model?',
      placeholder: 'e.g., Toyota Camry',
      required: false,
      conditions: [
        { field: 'q1', value: 'Yes' }
      ]
    },
    {
      id: 'q3',
      type: 'radio',
      label: 'How often do you drive?',
      options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
      required: false,
      conditions: [
        { field: 'q1', value: 'Yes' }
      ]
    }
  ]
};







export const evaluateConditions = (field, formData) => {
  if (!field.conditions || field.conditions.length === 0) {
    return true;
  }

  return field.conditions.every(condition => {
    const fieldValue = formData[condition.field];
    return fieldValue === condition.value;
  });
};

export const getAvailableFieldsForConditions = (fields, currentFieldId) => {
  return fields.filter(field => field.id !== currentFieldId);
};