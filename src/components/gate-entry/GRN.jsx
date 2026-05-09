import { useState, useRef } from "react";

// ── Dummy PO Database ─────────────────────────────────────
const PO_DB = {
  "PO-2024-001": {
    poNumber: "PO-2024-001",
    supplierName: "Ravi Electronics Pvt Ltd",
    contact: "+91 98765 43210",
    email: "ravi.elec@example.com",
    poDate: "2024-10-15",
    items: [
      { id: 1, productCode: "MCU-001", productName: "Microcontroller Unit", hsn: "8542.31", bookedQty: 500, receivedQty: 200, unit: "Pcs" },
      { id: 2, productCode: "CAP-100", productName: "Capacitor 100uF",     hsn: "8532.24", bookedQty: 1000, receivedQty: 400, unit: "Pcs" },
    ],
  },
  "PO-2024-002": {
    poNumber: "PO-2024-002",
    supplierName: "Mehta Polymers Ltd",
    contact: "+91 77654 21098",
    email: "procurement@mehta.com",
    poDate: "2024-11-03",
    items: [
      { id: 1, productCode: "PVC-WHT", productName: "PVC Granules White", hsn: "3904.10", bookedQty: 2000, receivedQty: 800, unit: "Kg" },
      { id: 2, productCode: "PVC-BLK", productName: "PVC Granules Black", hsn: "3904.10", bookedQty: 1500, receivedQty: 0, unit: "Kg" },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
const fmtMoney = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const todayStr = () => new Date().toISOString().split("T")[0];
const nowTime = () => new Date().toTimeString().slice(0, 5);

// ── Styles ────────────────────────────────────────────────
const S = {
  page: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: 0 },
  header: {
    background: "#fff", borderBottom: "1px solid #e2e8f0",
    padding: "16px 28px", display: "flex", alignItems: "center", gap: 12,
    position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,.06)",
  },
  headerIcon: {
    width: 38, height: 38, background: "#2e7d32", borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  container: { maxWidth: 1200, margin: "0 auto", padding: "24px 18px 64px" },
  card: {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
    boxShadow: "0 1px 3px rgba(0,0,0,.07)", overflow: "hidden", marginBottom: 18,
  },
  cardHead: {
    padding: "14px 20px", borderBottom: "1px solid #e2e8f0",
    display: "flex", alignItems: "center", gap: 10, background: "#fafbfc",
  },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#2e7d32" },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 },
  cardBody: { padding: 20 },

  // Search
  searchRow: { display: "flex", gap: 10 },
  searchInput: {
    flex: 1, padding: "11px 16px", border: "1.5px solid #e2e8f0",
    borderRadius: 10, fontFamily: "monospace", fontSize: 14,
    color: "#1e293b", outline: "none", background: "#fff",
  },

  // Buttons
  btnPrimary: {
    padding: "11px 22px", borderRadius: 10, border: "none",
    background: "#2e7d32", color: "#fff", fontSize: 13, fontWeight: 600,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
  },
  btnOutline: {
    padding: "11px 22px", borderRadius: 10, border: "1.5px solid #e2e8f0",
    background: "#fff", color: "#334155", fontSize: 13, fontWeight: 600,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
  },
  btnAdd: {
    padding: "7px 14px", borderRadius: 8, border: "1.5px solid #c8e6c9",
    background: "#f1f8f1", color: "#2e7d32", fontSize: 12, fontWeight: 600,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
  },
  btnGenerate: {
    padding: "14px 40px", borderRadius: 12, border: "none",
    background: "#2e7d32", color: "#fff", fontSize: 15, fontWeight: 700,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
  },

  // PO grid
  poGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14 },
  fieldLabel: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#64748b", marginBottom: 4 },
  fieldValue: { fontSize: 14, fontWeight: 600, color: "#1e293b" },
  mono: { fontFamily: "monospace" },

  // Table
  tblWrap: { overflowX: "auto", borderRadius: 10, border: "1px solid #e2e8f0" },
  th: {
    padding: "10px 13px", textAlign: "left", fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: ".06em", color: "#64748b",
    borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap", background: "#f8fafc",
  },
  thHighlight: {
    padding: "10px 13px", textAlign: "left", fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: ".06em", color: "#1565c0",
    borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap", background: "#eff6ff",
  },
  td: { padding: "9px 13px", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" },

  // Form
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))", gap: 14 },
  formGroup: { display: "flex", flexDirection: "column", gap: 5 },
  formLabel: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "#64748b" },
  formControl: {
    padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: 9,
    fontFamily: "sans-serif", fontSize: 13, color: "#1e293b", outline: "none", background: "#fff",
  },

  // Inline table input
  tblInput: {
    padding: "6px 9px", border: "1.5px solid #e2e8f0", borderRadius: 7,
    fontFamily: "monospace", fontSize: 13, textAlign: "center", outline: "none",
    background: "#fff",
  },

  // Payment
  payRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  payLabel: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 20px", border: "2px solid #e2e8f0", borderRadius: 10,
    cursor: "pointer", fontSize: 13, fontWeight: 500, background: "#fff",
    userSelect: "none", transition: "all .15s",
  },
  payLabelActive: {
    borderColor: "#2e7d32", background: "#f1f8f1", color: "#2e7d32", fontWeight: 700,
  },

  // Summary
  summaryCard: {
    background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)",
    borderRadius: 16, color: "#fff", padding: 28, marginBottom: 20, position: "relative", overflow: "hidden",
  },
  grnBadge: {
    display: "inline-block", padding: "8px 24px",
    background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)",
    borderRadius: 30, fontFamily: "monospace", fontSize: 22, margin: "12px 0",
  },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginTop: 20 },
  summaryItem: { background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "12px 14px" },
  summaryLabel: { fontSize: 10, opacity: 0.7, textTransform: "uppercase", letterSpacing: ".06em" },
  summaryVal: { fontSize: 14, fontWeight: 700, marginTop: 4 },

  alertRed: {
    padding: "10px 14px", background: "#fff5f5", color: "#dc2626",
    border: "1px solid #fca5a5", borderRadius: 9, fontSize: 13, fontWeight: 500, marginTop: 10,
  },
};

// ── Main Component ────────────────────────────────────────
export default function CreateGRN() {
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");
  const [selectedPO, setSelectedPO] = useState(null);
  const [rows, setRows] = useState([]);
  const [vehicle, setVehicle] = useState({ no: "", type: "", builty: "" });
  const [receivingDate, setReceivingDate] = useState(todayStr());
  const [receivingTime, setReceivingTime] = useState(nowTime());
  const [grn, setGrn] = useState(null);
  const summaryRef = useRef(null);
  const [bankName, setBankName] = useState("");
const [utrRef, setUtrRef] = useState("");
const [chequeRef, setChequeRef] = useState("");
const [paymentTerms, setPaymentTerms] = useState("");
const [poRef, setPoRef] = useState("");
const [payMode, setPayMode] = useState("");

  // ── Search ──────────────────────────────────────────────
  const handleSearch = () => {
    const key = Object.keys(PO_DB).find((k) => k.toUpperCase() === searchInput.trim().toUpperCase());
    if (!key) {
      setSearchError("Purchase Order not found. Please check the PO number.");
      setSelectedPO(null);
      return;
    }
    setSearchError("");
    const po = PO_DB[key];
    setSelectedPO(po);
    setGrn(null);
    setRows(
      po.items.map((it) => ({
        id: it.id,
        productCode: it.productCode,
        hsn: it.hsn,
        productName: it.productName,
        bookedQty: it.bookedQty,       // kitna manga tha — read-only
        receivedQty: it.receivedQty,   // kitna mila (already) — auto-filled, read-only
        inputQty: "",                   // kitna aur chahiye — user input
        unit: it.unit,
        price: "",
        locked: true,
      }))
    );
    setReceivingDate(todayStr());
    setReceivingTime(nowTime());
  };

  // ── Row changes ─────────────────────────────────────────
  const updateRow = (idx, field, value) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(), productCode: "", hsn: "", productName: "",
        bookedQty: "", receivedQty: "", inputQty: "",
        unit: "Pcs", price: "", locked: false,
      },
    ]);
  };

  const removeRow = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));

  // ── Totals — based on inputQty ──────────────────────────
  const grandTotal = rows.reduce((s, r) => s + (parseFloat(r.inputQty) || 0) * (parseFloat(r.price) || 0), 0);
  const totalInputQty = rows.reduce((s, r) => s + (parseFloat(r.inputQty) || 0), 0);

  // ── Generate GRN ────────────────────────────────────────
  const generateGRN = () => {
    const num = `GRN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    setGrn(num);
    setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const resetAll = () => {
    setSearchInput("");
    setSearchError("");
    setSelectedPO(null);
    setRows([]);
    setGrn(null);
    setVehicle({ no: "", type: "", builty: "" });
    setPayMode("Cash");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header, {zIndex:"-10"}}>
        <div style={S.headerIcon}>
          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1e293b" }}>Gate Entry — Create GRN</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Goods Receipt Note · Inward Management</div>
        </div>
      </div>

      <div style={S.container}>

        {/* ── STEP 1: Search PO ── */}
        <div style={S.card}>
          <div style={S.cardHead}>
            <div style={S.dot} />
            <span style={S.cardTitle}>Search Purchase Order</span>
          </div>
          <div style={S.cardBody}>
            <div style={S.searchRow}>
              <input
                style={S.searchInput}
                type="text"
                placeholder="Enter PO Number e.g. PO-2024-001"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setSearchError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button style={S.btnPrimary} onClick={handleSearch}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search PO
              </button>
            </div>
            {searchError && <div style={S.alertRed}>✗ {searchError}</div>}
          </div>
        </div>

        {selectedPO && (
          <>
            {/* ── STEP 2: PO + Supplier Details ── */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <div style={S.dot} />
                <span style={S.cardTitle}>Purchase Order &amp; Supplier Details</span>
              </div>
              <div style={S.cardBody}>
                <div style={S.poGrid}>
                  {[
                    ["PO Number",    <span style={S.mono}>{selectedPO.poNumber}</span>],
                    ["Supplier",     selectedPO.supplierName],
                    ["Contact",      selectedPO.contact],
                    ["Email",        selectedPO.email],
                    ["PO Date",      fmtDate(selectedPO.poDate)],
                    ["GRN Date",     fmtDate(todayStr())],
                    ["Line Items",   `${selectedPO.items.length} items`],
                    ["Status",       <span style={{ padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:"#fffbeb", color:"#d97706", border:"1px solid #fde68a" }}>Pending GRN</span>],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={S.fieldLabel}>{label}</div>
                      <div style={S.fieldValue}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── STEP 3: Stock Receipt Table ── */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <div style={S.dot} />
                <span style={S.cardTitle}>Stock Receipt — Enter Quantities &amp; Pricing</span>
               
              </div>
              <div style={S.cardBody}>
                <div style={S.tblWrap}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th style={S.th}>#</th>
                        <th style={S.th}>Product Code</th>
                        <th style={S.th}>HSN</th>
                        <th style={S.th}>Product Name</th>
                        {/* 3 qty columns */}
                        <th style={{ ...S.th, background: "#f0fdf4", color: "#15803d", textAlign: "center" }}>
                          Booked Qty
                        </th>
                        <th style={{ ...S.th, background: "#fff7ed", color: "#c2410c", textAlign: "center" }}>
                          Received Qty
                        </th>
                        <th style={{ ...S.th, background: "#eff6ff", color: "#1565c0", textAlign: "center" }}>
                          Quantity
                        </th>
                        {/* rest */}
                        <th style={S.th}>Unit</th>
                        <th style={S.th}>Unit Price ₹ *</th>
                        <th style={S.th}>Total ₹</th>
                        <th style={S.th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => {
                        const total = (parseFloat(row.inputQty) || 0) * (parseFloat(row.price) || 0);
                        const pending = (parseFloat(row.bookedQty) || 0) - (parseFloat(row.receivedQty) || 0);
                        const overReceived = row.inputQty && parseFloat(row.inputQty) > pending && pending >= 0;

                        return (
                          <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ ...S.td, color: "#94a3b8", fontSize: 12 }}>{idx + 1}</td>

                            {/* Product Code */}
                            <td style={S.td}>
                              <input style={{ ...S.tblInput, width: 90, fontFamily: "monospace" }}
                                value={row.productCode} readOnly={row.locked}
                                onChange={(e) => updateRow(idx, "productCode", e.target.value)}
                                placeholder="Code"
                              />
                            </td>

                            {/* HSN */}
                            <td style={S.td}>
                              <input style={{ ...S.tblInput, width: 80, fontFamily: "monospace" }}
                                value={row.hsn} readOnly={row.locked}
                                onChange={(e) => updateRow(idx, "hsn", e.target.value)}
                                placeholder="HSN"
                              />
                            </td>

                            {/* Product Name */}
                            <td style={S.td}>
                              <input style={{ ...S.tblInput, width: 160, textAlign: "left" }}
                                value={row.productName} readOnly={row.locked}
                                onChange={(e) => updateRow(idx, "productName", e.target.value)}
                                placeholder="Product name"
                              />
                            </td>

                            {/* ── Col 1: Booked Qty (read-only, green bg) ── */}
                            <td style={{ ...S.td, background: "#f0fdf4", textAlign: "center" }}>
                              <span style={{
                                display: "inline-block", padding: "5px 14px",
                                background: "#dcfce7", borderRadius: 7,
                                fontFamily: "monospace", fontWeight: 700,
                                fontSize: 13, color: "#15803d",
                              }}>
                                {row.bookedQty || "—"}
                              </span>
                            </td>

                            {/* ── Col 2: Received Qty (read-only, orange bg) ── */}
                            <td style={{ ...S.td, background: "#fff7ed", textAlign: "center" }}>
                              <span style={{
                                display: "inline-block", padding: "5px 14px",
                                background: "#ffedd5", borderRadius: 7,
                                fontFamily: "monospace", fontWeight: 700,
                                fontSize: 13, color: "#c2410c",
                              }}>
                                {row.locked ? (row.receivedQty ?? "—") : "—"}
                              </span>
                            </td>

                            {/* ── Col 3: Input Quantity (user types here, blue bg) ── */}
                            <td style={{ ...S.td, background: "#eff6ff", textAlign: "center" }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                <input
                                  style={{
                                    ...S.tblInput, width: 80,
                                    borderColor: overReceived ? "#ef4444" : "#3b82f6",
                                    background: "#fff",
                                    boxShadow: "0 0 0 2px rgba(59,130,246,.15)",
                                  }}
                                  type="number" min="0"
                                  value={row.inputQty}
                                  onChange={(e) => updateRow(idx, "inputQty", e.target.value)}
                                  placeholder="0"
                                />
                                {/* Show pending hint for PO-linked rows */}
                                {row.locked && pending >= 0 && (
                                  <span style={{ fontSize: 9, color: "#64748b", fontWeight: 500 }}>
                                    Pending: {pending}
                                  </span>
                                )}
                                {overReceived && (
                                  <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 600 }}>
                                    Exceeds pending!
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Unit */}
                            <td style={S.td}>
                              <input style={{ ...S.tblInput, width: 65 }}
                                value={row.unit}
                                onChange={(e) => updateRow(idx, "unit", e.target.value)}
                                placeholder="Pcs"
                              />
                            </td>

                            {/* Unit Price */}
                            <td style={S.td}>
                              <input style={{ ...S.tblInput, width: 90 }}
                                type="number" min="0" step="0.01"
                                value={row.price}
                                onChange={(e) => updateRow(idx, "price", e.target.value)}
                                placeholder="0.00"
                              />
                            </td>

                            {/* Row Total */}
                            <td style={{ ...S.td, fontFamily: "monospace", fontWeight: 600, color: "#334155" }}>
                              {total > 0 ? `₹${fmtMoney(total)}` : "—"}
                            </td>

                            {/* Remove */}
                            <td style={S.td}>
                              {!row.locked && (
                                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 16 }}
                                  onClick={() => removeRow(idx)}>✕</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Grand Total row */}
                      {grandTotal > 0 && (
                        <tr style={{ background: "#f0fdf4" }}>
                          <td colSpan={9} style={{ padding: "10px 13px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#2e7d32" }}>
                            Grand Total
                          </td>
                          <td style={{ padding: "10px 13px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: "#2e7d32", borderTop: "2px solid #c8e6c9" }}>
                            ₹{fmtMoney(grandTotal)}
                          </td>
                          <td />
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 12 }}>
                  <button style={S.btnAdd} onClick={addRow}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Row
                  </button>
                </div>
              </div>
            </div>

            {/* ── STEP 4: Vehicle & Logistics ── */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <div style={S.dot} />
                <span style={S.cardTitle}>Vehicle &amp; Logistics Details</span>
              </div>
              <div style={S.cardBody}>
                <div style={S.formGrid}>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>Vehicle No.</label>
                    <input style={S.formControl} placeholder="e.g. MP09 AB 1234"
                      value={vehicle.no} onChange={(e) => setVehicle((v) => ({ ...v, no: e.target.value }))} />
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>Vehicle Type</label>
                    <select style={S.formControl} value={vehicle.type}
                      onChange={(e) => setVehicle((v) => ({ ...v, type: e.target.value }))}>
                      <option value="">Select type</option>
                      {["Truck","Tempo","Mini Truck","Container","Two Wheeler","Other"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>Builty No. (LR No.)</label>
                    <input style={S.formControl} placeholder="e.g. LR-2024-5678"
                      value={vehicle.builty} onChange={(e) => setVehicle((v) => ({ ...v, builty: e.target.value }))} />
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>Receiving Date</label>
                    <input style={S.formControl} type="date"
                      value={receivingDate} onChange={(e) => setReceivingDate(e.target.value)} />
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>Receiving Time</label>
                    <input style={S.formControl} type="time"
                      value={receivingTime} onChange={(e) => setReceivingTime(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

           {/* ── STEP 5: Payment Mode ── */}
<div style={S.card}>
  <div style={S.cardHead}>
    <div style={S.dot} />
    <span style={S.cardTitle}>Payment Mode</span>
  </div>

  <div style={S.cardBody}>

    {/* ── Payment Mode Dropdown ── */}
    <div style={{ marginBottom: 24 }}>
      <label style={S.formLabel}>Payment Mode *</label>

      <select
        value={payMode}
        onChange={(e) => {
          setPayMode(e.target.value);

          // reset fields when changing mode
          setBankName("");
          setChequeRef("");
          setUtrRef("");
          setPaymentTerms("");
          setPoRef("");
        }}
        style={{
          ...S.formControl,
          marginTop: 6,
          background: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        <option value="">-- Select Payment Mode --</option>
        <option value="Cash">💵 Cash</option>
        <option value="Credit">💳 Credit</option>
        <option value="Bank">🏦 Bank Transfer</option>
      </select>
    </div>

    {/* ── Cash Mode ── */}
    {payMode === "Cash" && (
      <div
        style={{
          backgroundColor: "#f0fdf4",
          border: "1.5px solid #86efac",
          borderRadius: 12,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 24 }}>✅</div>

        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#166534",
            }}
          >
            Cash Payment Selected
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#4b5563",
              marginTop: 3,
            }}
          >
            Payment will be collected in cash during delivery.
          </div>
        </div>
      </div>
    )}

    {/* ── Credit Mode ── */}
    {payMode === "Credit" && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
        }}
      >
        {/* Credit Terms */}
        <div>
          <label style={S.formLabel}>Credit Terms</label>

          <select
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            style={{ ...S.formControl, marginTop: 6 }}
          >
            <option value="">-- Select Terms --</option>
            <option value="Net 7">Net 7</option>
            <option value="Net 15">Net 15</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 45">Net 45</option>
            <option value="Net 60">Net 60</option>
            <option value="Net 90">Net 90</option>
          </select>
        </div>

        {/* Reference */}
        <div>
          <label style={S.formLabel}>Reference / PO Ref</label>

          <input
            type="text"
            value={poRef}
            onChange={(e) => setPoRef(e.target.value)}
            placeholder="e.g. PO-2024-101"
            style={{
              ...S.formControl,
              marginTop: 6,
              fontFamily: "monospace",
            }}
          />
        </div>

        {/* Credit Note */}
        <div
          style={{
            gridColumn: "1 / -1",
            background: "#fef9c3",
            border: "1.5px solid #fde047",
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#92400e",
            }}
          >
            💳 Credit Terms Applied
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#a16207",
            }}
          >
            Payment is due according to selected credit terms.
          </div>
        </div>
      </div>
    )}

    {/* ── Bank Transfer Mode ── */}
    {payMode === "Bank" && (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Bank Name */}
        <div>
          <label style={S.formLabel}>Bank Name *</label>

          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            style={{
              ...S.formControl,
              marginTop: 6,
              borderColor: !bankName ? "#fbbf24" : "#e2e8f0",
              background: !bankName ? "#fffbeb" : "#fff",
            }}
          >
            <option value="">-- Select Bank --</option>

            <optgroup label="Public Sector Banks">
              <option>State Bank of India (SBI)</option>
              <option>Punjab National Bank</option>
              <option>Bank of Baroda</option>
              <option>Canara Bank</option>
              <option>Union Bank of India</option>
            </optgroup>

            <optgroup label="Private Sector Banks">
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra Bank</option>
              <option>IndusInd Bank</option>
            </optgroup>

            <optgroup label="Small Finance Banks">
              <option>AU Small Finance Bank</option>
              <option>Equitas Small Finance Bank</option>
            </optgroup>
          </select>

          {!bankName && (
            <div
              style={{
                marginTop: 5,
                fontSize: 11,
                color: "#f59e0b",
              }}
            >
              Please select a bank
            </div>
          )}
        </div>

        {/* Show details only after bank selection */}
        {bankName && (
          <>
            {/* Selected Bank Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: "#eff6ff",
                border: "1.5px solid #bfdbfe",
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 24 }}>🏦</div>

              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1d4ed8",
                  }}
                >
                  {bankName}
                </div>

                <div
                  style={{
                    marginTop: 2,
                    fontSize: 11,
                    color: "#3b82f6",
                  }}
                >
                  Selected for invoice payment
                </div>
              </div>
            </div>

            {/* Transfer Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 16,
              }}
            >
              {/* Transfer Mode */}
              <div>
                <label style={S.formLabel}>Transfer Mode</label>

                <select
                  style={{ ...S.formControl, marginTop: 6 }}
                >
                  <option>NEFT</option>
                  <option>RTGS</option>
                  <option>IMPS</option>
                  <option>UPI</option>
                  <option>Cheque</option>
                  <option>DD</option>
                </select>
              </div>

              {/* UTR */}
              <div>
                <label style={S.formLabel}>UTR / Reference No.</label>

                <input
                  type="text"
                  value={utrRef}
                  onChange={(e) => setUtrRef(e.target.value)}
                  placeholder="e.g. SBIN00012345"
                  style={{
                    ...S.formControl,
                    marginTop: 6,
                    fontFamily: "monospace",
                  }}
                />
              </div>

              {/* Cheque */}
              <div>
                <label style={S.formLabel}>Cheque / DD No.</label>

                <input
                  type="text"
                  value={chequeRef}
                  onChange={(e) => setChequeRef(e.target.value)}
                  placeholder="e.g. 123456"
                  style={{
                    ...S.formControl,
                    marginTop: 6,
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    )}

    {/* No Selection */}
    {!payMode && (
      <div
        style={{
          textAlign: "center",
          padding: "22px 18px",
          borderRadius: 12,
          background: "#f8fafc",
          border: "1.5px dashed #cbd5e1",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#94a3b8",
          }}
        >
          Select a payment mode to continue
        </div>
      </div>
    )}
  </div>
</div>
            {/* ── Generate Button ── */}
            <div style={{ textAlign: "center", margin: "12px 0 28px" }}>
              <button style={S.btnGenerate} onClick={generateGRN}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Generate GRN
              </button>
            </div>
          </>
        )}

        {/* ── GRN Summary ── */}
        {grn && (
          <div ref={summaryRef} style={{ animation: "fadeInUp .3s ease" }}>
            <div style={S.summaryCard}>
              <div style={{ fontSize: 11, opacity: .7, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>
                Goods Receipt Note Generated ✓
              </div>
              <div style={S.grnBadge}>{grn}</div>
              <div style={{ fontSize: 13, opacity: .8 }}>Receipt recorded successfully</div>

              <div style={S.summaryGrid}>
                {[
                  ["PO Number",     selectedPO.poNumber],
                  ["Supplier",      selectedPO.supplierName],
                  ["Vehicle No.",   vehicle.no || "—"],
                  ["Vehicle Type",  vehicle.type || "—"],
                  ["Builty No.",    vehicle.builty || "—"],
                  ["Received On",   `${fmtDate(receivingDate)} ${receivingTime}`],
                  ["Total Items",   rows.length],
                  ["Total Qty",     totalInputQty],
                  ["Payment Mode",  payMode],
                  ["Grand Total",   `₹${fmtMoney(grandTotal)}`],
                ].map(([label, val]) => (
                  <div key={label} style={S.summaryItem}>
                    <div style={S.summaryLabel}>{label}</div>
                    <div style={S.summaryVal}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Receipt items table */}
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 11, opacity: .7, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700, marginBottom: 8 }}>
                  Items Received
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Product","HSN","Booked","Prev. Received","This Receipt","Unit","Unit Price","Total"].map((h) => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.7)", borderBottom: "1px solid rgba(255,255,255,.15)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const total = (parseFloat(r.inputQty) || 0) * (parseFloat(r.price) || 0);
                      return (
                        <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                          <td style={{ padding: "9px 12px" }}>{r.productName} <span style={{ opacity: .6, fontSize: 11 }}>{r.productCode}</span></td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace" }}>{r.hsn}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right" }}>{r.bookedQty || "—"}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right" }}>{r.locked ? (r.receivedQty ?? "—") : "—"}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700 }}>{r.inputQty || 0}</td>
                          <td style={{ padding: "9px 12px" }}>{r.unit}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace" }}>₹{fmtMoney(r.price)}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontWeight: 700 }}>₹{fmtMoney(total)}</td>
                        </tr>
                      );
                    })}
                    <tr style={{ borderTop: "1px solid rgba(255,255,255,.3)" }}>
                      <td colSpan={7} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, opacity: .85 }}>Grand Total</td>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700, fontSize: 16 }}>₹{fmtMoney(grandTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button style={S.btnOutline} onClick={() => window.print()}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print GRN
              </button>
              <button style={{ ...S.btnPrimary, padding: "11px 28px" }} onClick={resetAll}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-4.7"/>
                </svg>
                New GRN Entry
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        input[readonly] { background: #f8fafc !important; color: #64748b; }
        input:focus, select:focus { border-color: #43a047 !important; }
        button:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}