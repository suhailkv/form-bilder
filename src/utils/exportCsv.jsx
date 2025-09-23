import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// CSV export
export const exportToCsv = (fields, responses) => {
  const headers = fields.map(f => f.label);
  const rows = responses.map(resp => fields.map(f => resp[f.id] || ""));
  
  const csvContent =
    [headers, ...rows].map(e => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "responses.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Excel export
export const exportToExcel = (fields, responses) => {
  const headers = fields.map(f => f.label);
  const rows = responses.map(resp => fields.map(f => resp[f.id] || ""));

  const worksheet = utils.aoa_to_sheet([headers, ...rows]);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Responses");

  writeFile(workbook, "responses.xlsx");
};

// PDF export
export const exportToPdf = (fields, responses) => {
  const doc = new jsPDF();

  const headers = [fields.map(f => f.label)];
  const rows = responses.map(resp => fields.map(f => resp[f.id] || ""));

  doc.text("Responses", 14, 10);
  autoTable(doc, { head: headers, body: rows, startY: 20 }); // ✅ Use autoTable(doc, {...})
  doc.save("responses.pdf");
};
