import React from "react";
import { exportToCsv } from "../utils/exportCsv";

const ExampleComponent = () => {
  const fields = [
    { id: "q1", label: "Do you have a car?" },
    { id: "q2", label: "What is your car?" },
    { id: "q3", label: "How often do you drive?" },
  ];

  const responses = [
    { q1: "Yes", q3: "Daily", q2: "Toyota" },
    { q1: "No" },
    { q1: "Yes", q3: "Weekly", q2: "Honda City" }
  ];

  const handleExport = () => {
    exportToCsv(fields, responses);
  };

  return <button onClick={handleExport}>Export to CSV</button>;
};

export default ExampleComponent;
