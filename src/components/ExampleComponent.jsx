import React from "react";
import { exportToCsv } from "../utils/exportCsv";

const ExampleComponent = () => {
  // Fields definition (questions)
  const fields = [
    { id: "q1", label: "Do you have a car?" },
    { id: "q2", label: "What is your car?" },
    { id: "q3", label: "How often do you drive?" },
    { id: "q4", label: "What is your favorite color?" },
    { id: "q5", label: "What is your age?" },
    { id: "q6", label: "What is your profession?" }
  ];

  // Responses (answers)
  const responses = [
    {
      q1: "Yes",
      q2: "Toyota",
      q3: "Daily",
      q4: "Blue",
      q5: "28",
      q6: "Engineer",
      timestamp: "2025-09-23T09:15:00"
    },
    {
      q1: "No",
      q2: "",
      q3: "Never",
      q4: "Red",
      q5: "22",
      q6: "Student",
      timestamp: "2025-09-23T10:30:00"
    },
    {
      q1: "Yes",
      q2: "Honda",
      q3: "Weekly",
      q4: "Green",
      q5: "35",
      q6: "Teacher",
      timestamp: "2025-09-23T11:45:00"
    }
  ];

  const handleExport = () => {
    exportToCsv(fields, responses);
  };

  return <button onClick={handleExport}>Export to CSV</button>;
};

export default ExampleComponent;
