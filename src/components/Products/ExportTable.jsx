import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Printer } from "lucide-react";

export default function ExportTable({ title, columns, data }) {
  // 🔹 PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(title || "Exported Data", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [columns.map((col) => col.label)],
      body: data.map((row) => columns.map((col) => row[col.key])),
      styles: {
        fontSize: 8,
      },
    });

    doc.save(`${title || "table-data"}.pdf`);
  };

  // 🔹 Print
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    const tableHTML = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          <table>
            <thead>
              <tr>
                ${columns.map((col) => `<th>${col.label}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                  <tr>
                    ${columns.map((col) => `<td>${row[col.key] || ""}</td>`).join("")}
                  </tr>
                `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-white hover:text-black hover:bg-white dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black dark:border-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/20"
      >
        <Printer className="h-4 w-4" />
        Print
      </button>
    </div>
  );
}
