

import { useLocation } from "react-router-dom";
import { useRef } from "react";
import logo from "../../assets/TektronicsLogo.png";

export default function ChecklistReceipt() {
  const { state } = useLocation();
  const data = state?.checklist;
  const printRef = useRef();

  if (!data) return <div className="p-10 text-center text-slate-400">No checklist data found.</div>;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "2-digit", year: "numeric",
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
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; font-size: 9px; color: #000; }
            .report-container { width: 100%; border: 2px solid black; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            td { border: 1px solid black !important; padding: 3px 5px; vertical-align: middle; overflow: hidden; }
            input { border: none; width: 100%; font-size: 9px; text-align: center; background: transparent; }
            @media print {
              .no-print { display: none; }
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="report-container">${content}</div>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 250);
  };

  const samples = Array.from({ length: 10 }, (_, i) => i + 1);

  // Helper: base td style — all borders explicit so Tailwind reset can't strip them
  const td = (extra = {}) => ({
    border: "1px solid #000",
    padding: "3px 5px",
    verticalAlign: "middle",
    overflow: "hidden",
    fontSize: 11,
    ...extra,
  });
  const tdBold = (extra = {}) => td({ fontWeight: "bold", ...extra });

  return (
    <div className="p-4 bg-slate-100 min-h-screen">
      <div className="flex justify-end mb-4 no-print">
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 shadow-lg"
        >
          🖨 Generate Professional Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          ref={printRef}
          className="bg-white mx-auto shadow-2xl"
          style={{ minWidth: 900, width: "100%" }}
        >
          <table style={{ border: "2px solid #000", borderCollapse: "collapse", tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "3%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "5%" }} />
              {samples.map(n => <col key={n} style={{ width: "5.8%" }} />)}
            </colgroup>
            <tbody>

              {/* ── HEADER ── */}
              <tr>
                <td colSpan={2} rowSpan={2} style={td({ textAlign: "center" })}>
                  <img src={logo} alt="Logo" style={{ maxWidth: "100%", maxHeight: 40, objectFit: "contain" }} />
                </td>
                <td colSpan={9} style={tdBold({ textAlign: "center", fontSize: 13, textTransform: "uppercase" })}>
                  TEST REPORT OF {(data.applicableProduct || "UNKNOWN").toUpperCase()}
                </td>
                <td colSpan={4} style={tdBold({ fontSize: 10 })}>
                  DOC. No.: TKTQA015FR<br />
                  PAGE 1 OF 1
                </td>
              </tr>
              <tr>
                <td colSpan={4} style={tdBold()}>E - WAY BILL NO :</td>
                <td colSpan={5} style={tdBold()}>IIR No.</td>
                <td colSpan={4} style={td()}></td>
              </tr>

              {/* ── META ── */}
              <tr>
                <td colSpan={2} style={tdBold()}>REC. DATE :</td>
                <td colSpan={13} style={td()}></td>
              </tr>
              <tr>
                <td colSpan={2} style={tdBold()}>INV. NO. :</td>
                <td colSpan={13} style={td()}>ITEM NAME : {data.checklistName}</td>
              </tr>
              <tr>
                <td colSpan={2} style={tdBold()}>INV. DATE :</td>
                <td colSpan={13} style={td()}>ITEM CODE : {data.checklistCode}</td>
              </tr>
              <tr>
                <td colSpan={2} style={tdBold()}>P.O. NO. :</td>
                <td colSpan={13} style={td()}>TECHNICAL PARAMETER AND DIMENSION SAMPLE QTY : 10 Nos</td>
              </tr>
              <tr>
                <td colSpan={2} style={tdBold()}>LOT QTY. :</td>
                <td colSpan={13} style={td()}>SUPP. NAME:</td>
              </tr>

              {/* ── SECTION HEADER ── */}
              <tr>
                <td colSpan={15} style={tdBold({ backgroundColor: "#f2f2f2" })}>
                  DIMENSIONAL CHARACTERISTICS IN mm:-
                </td>
              </tr>

              {/* ── COLUMN HEADERS ── */}
              <tr>
                <td style={tdBold({ textAlign: "center" })}>S. No.</td>
                <td colSpan={2} style={tdBold({ textAlign: "center" })}>PARAMETER TO BE INSPECTED</td>
                <td style={tdBold({ textAlign: "center" })}>Specification</td>
                <td style={tdBold({ textAlign: "center" })}>TOL.</td>
                {samples.map(n => (
                  <td key={n} style={tdBold({ textAlign: "center" })}>{n}</td>
                ))}
              </tr>

              {/* ── DYNAMIC ITEM ROWS ── */}
              {data.items.map((item, i) => {
                const isFirst = i === 0 || data.items[i - 1].name !== item.name;
                const groupSize = data.items.filter(x => x.name === item.name).length;
                return (
                  <tr key={i}>
                    <td style={td({ textAlign: "center" })}>{i + 1}</td>
                    {isFirst ? (
                      <td rowSpan={groupSize} style={tdBold({ textAlign: "center", verticalAlign: "middle" })}>
                        {item.name.toUpperCase()}
                      </td>
                    ) : null}
                    <td style={td()}>{item.subName}</td>
                    <td style={td({ textAlign: "center" })}>{item.tool}</td>
                    <td style={td({ textAlign: "center" })}>
                      {item.same || (item.min ? `${item.min}-${item.max}` : "")}
                    </td>
                    {samples.map(n => (
                      <td key={n} style={td({ padding: "2px" })}>
                        <input type="text" style={{ border: "none", width: "100%", fontSize: 9, textAlign: "center", background: "transparent" }} />
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* ── ACCEPTANCE CRITERIA ── */}
              <tr>
                <td style={tdBold({ textAlign: "center" })}>Sr no</td>
                <td colSpan={2} style={tdBold({ textAlign: "center" })}>ACCEPTENCE CRITERIA | QL CRITERIA</td>
                <td colSpan={7} rowSpan={5} style={td()}></td>
                <td colSpan={5} rowSpan={5} style={td({ verticalAlign: "top", padding: 8 })}>
                  <div style={{ fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>STATUS (✓)</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: "bold", letterSpacing: 2 }}>A C C E P T</span>
                    <div style={{ width: 60, height: 20, border: "1px solid #000" }}></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: "bold", letterSpacing: 2 }}>R E J E C T</span>
                    <div style={{ width: 60, height: 20, border: "1px solid #000" }}></div>
                  </div>
                  <div style={{ fontWeight: "bold", marginTop: 16 }}>Revision: 0</div>
                </td>
              </tr>
              <tr>
                <td style={td({ textAlign: "center" })}>1</td>
                <td style={tdBold({ textAlign: "center" })}>CRITICAL</td>
                <td style={td({ textAlign: "center" })}>0.00</td>
              </tr>
              <tr>
                <td style={td({ textAlign: "center" })}>2</td>
                <td rowSpan={2} style={tdBold({ textAlign: "center", verticalAlign: "middle" })}>MAJOR</td>
                <td style={td({ textAlign: "center" })}>0.65</td>
              </tr>
              <tr>
                <td style={td({ textAlign: "center" })}>3</td>
                <td style={td({ textAlign: "center" })}></td>
              </tr>
              <tr>
                <td style={td({ textAlign: "center" })}>4</td>
                <td style={tdBold({ textAlign: "center" })}>MINOR</td>
                <td style={td({ textAlign: "center" })}>1.50</td>
              </tr>

              {/* ── SIGNATURES ── */}
              <tr>
                <td colSpan={3} style={tdBold({ height: 50, verticalAlign: "bottom" })}>Prepared By:</td>
                <td colSpan={4} style={tdBold({ verticalAlign: "bottom" })}>Reviewed By:</td>
                <td colSpan={3} style={tdBold({ verticalAlign: "bottom" })}>Approved By:</td>
                <td colSpan={5} style={{ border: "1px solid #000", padding: 0 }}>
                  <table style={{ width: "100%", height: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ border: "none", borderRight: "1px solid #000", padding: "3px 5px", fontWeight: "bold", textAlign: "center" }}>
                          Status: 01
                        </td>
                        <td style={{ border: "none", padding: "3px 5px", fontWeight: "bold", textAlign: "center" }}>
                          Date: {today}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}