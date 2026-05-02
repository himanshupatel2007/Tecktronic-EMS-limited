import { useLocation } from "react-router-dom";
import { useRef } from "react";
import logo from "../../assets/TektronicsLogo.png";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ChecklistReceipt() {
  const { state } = useLocation();
  const data = state?.checklist;
  const printRef = useRef();
  const navigate = useNavigate();

  if (!data)
    return (
      <div className="p-10 text-center text-slate-400">
        No checklist data found.
      </div>
    );

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>QC Report - ${data.checklistName}</title>
          <style>
            @page { size: A4 landscape; margin: 8mm; }
            body { font-family: Arial, sans-serif; font-size: 10px; color: #000; margin: 0; padding: 0; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #000; }
            td { border: 1px solid #000; padding: 4px; vertical-align: middle; word-wrap: break-word; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            img { max-height: 50px; object-fit: contain; display: block; margin: 0 auto; }
            .bg-gray { background-color: #f2f2f2 !important; -webkit-print-color-adjust: exact; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  const cell = {
    border: "1px solid #000",
    padding: "6px 8px",
    fontSize: "12px",
    color: "#000",
    verticalAlign: "middle",
  };

  const labelCell = {
    ...cell,
    fontWeight: "bold",
    backgroundColor: "#f9fafb",
    whiteSpace: "nowrap",
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* TOOLBAR */}
      <div className="max-w-[1100px] mx-auto flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Checklist Preview</h2>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-green-700 shadow-lg flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-green-700 shadow-lg flex items-center gap-2"
          >
            <span>🖨</span> Generate Report
          </button>
        </div>
      </div>

      {/* REPORT */}
      <div className="overflow-x-auto">
        <div
          ref={printRef}
          className="bg-white mx-auto shadow-sm"
          style={{
            width: "1050px",
            border: "1px solid #000",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              {Array.from({ length: 12 }).map((_, i) => (
                <col key={i} style={{ width: `${100 / 12}%` }} />
              ))}
            </colgroup>
            <tbody>
              {/* ── HEADER: Logo | Title | Doc info ── */}
              <tr>
                <td
                  colSpan={3}
                  rowSpan={2}
                  style={{ ...cell, textAlign: "center" }}
                >
                  <img
                    src={logo}
                    alt="Tektronics Logo"
                    style={{ maxHeight: "55px", margin: "0 auto" }}
                  />
                </td>
                <td
                  colSpan={6}
                  rowSpan={2}
                  style={{
                    ...cell,
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Items of {data.applicableProduct || "Product"}
                </td>
                <td
                  colSpan={3}
                  style={{ ...cell, fontWeight: "bold", fontSize: "11px" }}
                >
                  DOC No: TKTQA015FR
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  style={{ ...cell, fontWeight: "bold", fontSize: "11px" }}
                >
                  PAGE 1 OF 1
                </td>
              </tr>

              {/* ── CHECKLIST INFO ONLY ── */}
              <tr>
                <td colSpan={2} style={labelCell}>
                  ITEM NAME:
                </td>
                <td colSpan={4} style={{ ...cell, fontWeight: "bold" }}>
                  {data.checklistName}
                </td>
                <td colSpan={2} style={labelCell}>
                  ITEM CODE:
                </td>
                <td colSpan={4} style={cell}>
                  {data.checklistCode}
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={labelCell}>
                  PRODUCT:
                </td>
                <td colSpan={4} style={cell}>
                  {data.applicableProduct}
                </td>
                <td colSpan={2} style={labelCell}>
                  GROUP:
                </td>
                <td colSpan={4} style={cell}>
                  {data.groupName}
                </td>
              </tr>

              {/* ── SECTION HEADING ── */}
              <tr>
                <td
                  colSpan={12}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    backgroundColor: "#f2f2f2",
                    padding: "8px",
                  }}
                >
                  Items List
                </td>
              </tr>

              {/* ── COLUMN HEADERS ── */}
              <tr style={{ backgroundColor: "#f9fafb", fontWeight: "bold" }}>
                <td style={{ ...cell, textAlign: "center" }}>S.No</td>
                <td colSpan={3} style={{ ...cell, textAlign: "center" }}>
                  Name
                </td>
                <td colSpan={2} style={{ ...cell, textAlign: "center" }}>
                  Sub Name
                </td>
                <td style={{ ...cell, textAlign: "center" }}>Type</td>
                <td colSpan={3} style={{ ...cell, textAlign: "center" }}>
                  Ideal Value
                </td>
                <td colSpan={2} style={{ ...cell, textAlign: "center" }}>
                  Tool
                </td>
              </tr>

              {/* ── ITEMS ── */}
              {data.items.map((item, i) => {
                const isFirst = i === 0 || data.items[i - 1].name !== item.name;
                const groupSize = data.items.filter(
                  (x) => x.name === item.name,
                ).length;
                return (
                  <tr key={i}>
                    <td style={{ ...cell, textAlign: "center" }}>{i + 1}</td>
                    {isFirst && (
                      <td
                        colSpan={3}
                        rowSpan={groupSize}
                        style={{
                          ...cell,
                          textAlign: "center",
                          fontWeight: "bold",
                          verticalAlign: "middle",
                        }}
                      >
                        {item.name}
                      </td>
                    )}
                    <td colSpan={2} style={cell}>
                      {item.subName}
                    </td>
                    <td style={{ ...cell, textAlign: "center" }}>
                      {item.valueType}
                    </td>
                    <td colSpan={3} style={{ ...cell, textAlign: "center" }}>
                      {item.valueType === "Numeric"
                        ? `${item.min || "-"} - ${item.max || "-"}`
                        : item.same || "-"}
                    </td>
                    <td colSpan={2} style={{ ...cell, textAlign: "center" }}>
                      {item.tool}
                    </td>
                  </tr>
                );
              })}
              {/* ── FOOTER ── */}
              <tr style={{ fontWeight: "bold" }}>
                <td
                  colSpan={3}
                  style={{ ...cell, height: "60px", verticalAlign: "top" }}
                >
                  Prepared By:
                </td>
                <td colSpan={3} style={{ ...cell, verticalAlign: "top" }}>
                  Reviewed By:
                </td>
                <td colSpan={3} style={{ ...cell, verticalAlign: "top" }}>
                  Approved By:
                </td>
                <td colSpan={3} style={{ ...cell, verticalAlign: "top" }}>
                  Date: {today}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
