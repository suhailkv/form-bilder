export const exportToCsv = (fields, responses, fileName = "responses.csv") => {
  if (!responses || responses.length === 0) {
    alert("No responses to export!");
    return;
  }

  // Prepare CSV header
  const header = fields.map(f => f.label);

  // Prepare rows
  const rows = responses.map(res =>
    fields.map(f => res[f.id] || "") // keep order of fields
  );

  const csvContent =
    [header, ...rows].map(e => e.join(",")).join("\n");

  // Create Blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
