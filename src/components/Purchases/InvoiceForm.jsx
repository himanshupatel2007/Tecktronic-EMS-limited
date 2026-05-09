import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, FileText, X, Printer, Save } from "lucide-react";
import { createPortal } from "react-dom";

// ── Product catalogue ─────────────────────────────────────────────────────────
const PRODUCT_CATALOGUE = [
  { productName: "Arduino Uno R3",      poCode: "ARD-UNO-R3",   hsn: "85340000", unitPrice: 450,   unit: "Pcs" },
  { productName: "Raspberry Pi 4B 4GB", poCode: "RPI-4B-4G",    hsn: "84713000", unitPrice: 4200,  unit: "Pcs" },
  { productName: "16x2 LCD Display",    poCode: "LCD-16X2",      hsn: "90131000", unitPrice: 120,   unit: "Pcs" },
  { productName: "DHT22 Sensor",        poCode: "SEN-DHT22",     hsn: "90189000", unitPrice: 280,   unit: "Pcs" },
  { productName: "10K Resistor Pack",   poCode: "RES-10K-PKT",   hsn: "85334000", unitPrice: 35,    unit: "Box" },
  { productName: "Jumper Wires (M-M)",  poCode: "WIR-JMP-MM",    hsn: "85444200", unitPrice: 60,    unit: "Pcs" },
  { productName: "9V DC Adapter",       poCode: "PSU-9V-DC",     hsn: "85044000", unitPrice: 199,   unit: "Pcs" },
  { productName: "PCB Prototype Board", poCode: "PCB-PROTO-SM",  hsn: "85340090", unitPrice: 95,    unit: "Pcs" },
  { productName: "Servo Motor SG90",    poCode: "MOT-SG90",      hsn: "85013200", unitPrice: 175,   unit: "Pcs" },
  { productName: "OLED Display 0.96\"", poCode: "DISP-OLED096",  hsn: "90131000", unitPrice: 320,   unit: "Pcs" },
  { productName: "Bubble Wrap Roll",    poCode: "PKG-BWR-50M",   hsn: "39211990", unitPrice: 850,   unit: "Meter" },
  { productName: "Corrugated Box A4",   poCode: "PKG-BOX-A4",    hsn: "48191000", unitPrice: 22,    unit: "Pcs" },
];

const labelStyle = {
  display: "block", marginBottom: 5, fontSize: 11,
  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#3a3c44",
};
const inputStyle = {
  width: "100%", padding: "9px 11px", borderRadius: 8,
  border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
  boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000", transition: "border-color 0.15s",
};

// ── FIX: Centralized style object S used in Payment Mode section ──────────────
const S = {
  card: {
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 18px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #e2e8f0",
  },
  dot: {
    width: 8, height: 8, borderRadius: "50%", backgroundColor: "#44a83e",
  },
  cardTitle: {
    fontSize: 13, fontWeight: 800, color: "#30333e", textTransform: "uppercase", letterSpacing: ".06em",
  },
  cardBody: {
    padding: "18px 18px",
  },
  formLabel: {
    display: "block", fontSize: 11, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.06em", color: "#3a3c44",
  },
  formControl: {
    width: "100%", padding: "9px 11px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
    boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000",
  },
};

// ── Invoice Preview Modal ─────────────────────────────────────────────────────
function InvoicePreviewModal({ invoice, onClose, onSave }) {
  const sup    = invoice.supplier   || {};
  const items  = invoice.items      || [];
  const taxableAmount = invoice.subtotal - (invoice.discountAmount || 0);

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoice.invoiceNumber}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',sans-serif;color:#30333e;background:#fff;font-size:12px}
      .page{max-width:850px;margin:0 auto;padding:32px}
      .header-band{background:#30333e;color:#fff;padding:18px 28px;display:flex;justify-content:space-between;align-items:center;border-radius:8px 8px 0 0}
      .sub-header{background:#f5f5f5;padding:14px 28px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;border-bottom:1px solid #e2e8f0}
      .sub-header-item label{font-size:9px;text-transform:uppercase;color:#888;font-weight:700;letter-spacing:.06em;display:block;margin-bottom:3px}
      .sub-header-item span{font-size:12px;font-weight:600;color:#30333e}
      .parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:18px 28px;border-bottom:1px solid #e2e8f0}
      .party-label{font-size:9px;text-transform:uppercase;font-weight:700;color:#44a83e;letter-spacing:.06em;margin-bottom:6px}
      .party-name{font-size:14px;font-weight:800;color:#30333e;margin-bottom:3px}
      .party-detail{font-size:11px;color:#3a3c44;line-height:1.6}
      table{width:100%;border-collapse:collapse;margin:0 28px;width:calc(100% - 56px)}
      th{background:#30333e;color:#fff;padding:9px 12px;font-size:10px;text-transform:uppercase;text-align:left;font-weight:700;letter-spacing:.05em}
      td{padding:9px 12px;border-bottom:1px solid #f1f5f9;font-size:12px}
      tr:nth-child(even) td{background:#fafafa}
      .totals{display:flex;justify-content:flex-end;padding:16px 28px 0}
      .totals-box{width:280px}
      .total-row{display:flex;justify-content:space-between;padding:5px 0;font-size:12px;border-bottom:1px solid #f1f5f9}
      .grand-row{display:flex;justify-content:space-between;padding:10px 14px;background:#30333e;border-radius:6px;margin-top:8px}
      .bank-box{margin:18px 28px 0;padding:14px;background:#f0fdf4;border:1px solid #b9f0b4;border-radius:8px;font-size:11px}
      .irn-box{margin:12px 28px 0;padding:10px;background:#f5f5f5;border-radius:6px;font-size:10px;color:#888;word-break:break-all}
      .footer{margin:18px 28px 0;display:flex;justify-content:space-between;font-size:10px;color:#888}
    </style></head><body><div class="page">
    <div class="header-band">
      <div>
        <div style="font-size:22px;font-weight:900;letter-spacing:-1px">TAX INVOICE</div>
        <div style="font-size:11px;opacity:.7;margin-top:3px">${invoice.supplierGstin || sup.gstin || ""} &nbsp;|&nbsp; Original Copy</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:13px;font-weight:700">Invoice No: ${invoice.invoiceNumber}</div>
        <div style="font-size:11px;opacity:.8;margin-top:2px">Dated: ${invoice.invoiceDate || "-"}</div>
        ${invoice.eWayBillNo ? `<div style="font-size:10px;opacity:.7">E-Way: ${invoice.eWayBillNo}</div>` : ""}
      </div>
    </div>
    <div class="sub-header">
      <div class="sub-header-item"><label>Station</label><span>${invoice.station || "-"}</span></div>
      <div class="sub-header-item"><label>PO No. / Date</label><span>${invoice.poRef || "-"} &nbsp; ${invoice.poDate || ""}</span></div>
      <div class="sub-header-item"><label>Transport</label><span>${invoice.transport || "-"}</span></div>
      <div class="sub-header-item"><label>Vehicle No.</label><span>${invoice.vehicleNo || "-"}</span></div>
    </div>
    <div class="parties">
      <div><div class="party-label">Billed To</div>
        <div class="party-name">${sup.partyName || "-"}</div>
        <div class="party-detail">${sup.address || ""}<br>${sup.city || ""} ${sup.pincode || ""}<br>GSTIN: ${sup.gstin || "-"}</div>
      </div>
      <div><div class="party-label">Shipped To</div>
        <div class="party-name">${invoice.shipToName || sup.partyName || "-"}</div>
        <div class="party-detail">${invoice.shipToAddress || sup.address || ""}<br>${invoice.shipToCity || sup.city || ""} ${invoice.shipToPincode || sup.pincode || ""}<br>GSTIN: ${invoice.shipToGstin || sup.gstin || "-"}</div>
      </div>
    </div>
    ${invoice.irn ? `<div class="irn-box"><strong>IRN:</strong> ${invoice.irn} &nbsp; <strong>Ack.No.:</strong> ${invoice.ackNo || ""} &nbsp; <strong>Ack.Date:</strong> ${invoice.ackDate || ""}</div>` : ""}
    ${invoice.totalBox || invoice.totalWeight ? `<div style="padding:8px 28px;font-size:11px;font-weight:700;color:#30333e">TOTAL BOX: ${invoice.totalBox || "-"} &nbsp;&nbsp; TOTAL WEIGHT: ${invoice.totalWeight || "-"}</div>` : ""}
    <table>
      <thead><tr><th>#</th><th>Description of Goods</th><th>HSN/SAC</th><th>Packing</th><th>Qty</th><th>Unit</th><th>Price</th><th>Amount (₹)</th></tr></thead>
      <tbody>
      ${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.productName||"-"}</td><td>${it.hsn||"-"}</td><td>${it.packing||"-"}</td><td>${it.quantity||0}</td><td>${it.unit||"Pcs"}</td><td>${Number(it.unitPrice||0).toFixed(2)}</td><td>${((Number(it.quantity||0))*(Number(it.unitPrice||0))).toFixed(2)}</td></tr>`).join("")}
      </tbody>
    </table>
    <div class="totals"><div class="totals-box">
      <div class="total-row"><span>Subtotal</span><span>₹ ${invoice.subtotal?.toFixed(2)||"0.00"}</span></div>
      ${(invoice.discountAmount||0)>0?`<div class="total-row"><span>Discount</span><span>- ₹ ${Number(invoice.discountAmount).toFixed(2)}</span></div>`:""}
      <div class="total-row"><span>Taxable Amount</span><span>₹ ${taxableAmount?.toFixed(2)||"0.00"}</span></div>
      ${(invoice.cgst||0)>0?`<div class="total-row"><span>CGST @ ${invoice.cgstPercent||0}%</span><span>₹ ${Number(invoice.cgst).toFixed(2)}</span></div>`:""}
      ${(invoice.sgst||0)>0?`<div class="total-row"><span>SGST @ ${invoice.sgstPercent||0}%</span><span>₹ ${Number(invoice.sgst).toFixed(2)}</span></div>`:""}
      ${(invoice.igst||0)>0?`<div class="total-row"><span>IGST @ ${invoice.igstPercent||0}%</span><span>₹ ${Number(invoice.igst).toFixed(2)}</span></div>`:""}
      <div class="grand-row"><span style="color:#fff;font-weight:700;font-size:13px">Grand Total</span><span style="color:#44a83e;font-weight:900;font-size:15px">₹ ${Number(invoice.finalTotal||0).toFixed(2)}</span></div>
    </div></div>
    <div class="bank-box">
      <strong>Bank Details:</strong> ${invoice.bankName||"-"} &nbsp;|&nbsp; A/C: ${invoice.accountNo||"-"} &nbsp;|&nbsp; IFSC: ${invoice.ifscCode||"-"}
    </div>
    ${invoice.notes?`<div style="margin:14px 28px 0;padding:12px;background:#fef9c3;border:1px solid #fde047;border-radius:6px;font-size:11px"><strong>Terms & Conditions:</strong> ${invoice.notes}</div>`:""}
    <div class="footer"><span>This is a computer generated invoice</span><span>for ${invoice.supplierCompany||""} &nbsp; Authorised Signatory</span></div>
    </div></body></html>`);
    win.document.close(); win.print();
  };

  return createPortal(
    <div style={{ position:"fixed", inset:0, zIndex:2000, backgroundColor:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"20px 16px", overflowY:"auto" }}
      onClick={onClose}>
      <div style={{ width:"100%", maxWidth:900, backgroundColor:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.5)", marginBottom:24 }}
        onClick={(e) => e.stopPropagation()}>

        {/* Toolbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 24px", background:"linear-gradient(135deg,#30333e 0%,#3a3c44 100%)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <FileText size={16} style={{ color:"#44a83e" }} />
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Invoice Preview</span>
            <span style={{ fontSize:11, fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.1)", color:"#86efac", padding:"3px 8px", borderRadius:4 }}>{invoice.invoiceNumber}</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={handlePrint}
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:8, border:"none", backgroundColor:"#44a83e", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <Printer size={13} /> Print
            </button>
            <button onClick={onSave}
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:8, border:"none", backgroundColor:"#3b82f6", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <Save size={13} /> Save
            </button>
            <button onClick={onClose}
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.2)", backgroundColor:"transparent", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>
              <X size={13} /> Cancel
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding:"0 0 28px" }}>

          {/* Header band */}
          <div style={{ background:"#30333e", color:"#fff", padding:"20px 36px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:26, fontWeight:900, letterSpacing:"-1px" }}>TAX INVOICE</div>
              <div style={{ fontSize:11, opacity:.65, marginTop:4 }}>{invoice.supplierCompany || invoice.supplier?.companyName || ""}</div>
              <div style={{ fontSize:10, opacity:.55, marginTop:2 }}>GSTIN: {invoice.supplierGstin || ""}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, fontWeight:800 }}>Invoice No.: {invoice.invoiceNumber}</div>
              <div style={{ fontSize:11, opacity:.8, marginTop:4 }}>Dated: {invoice.invoiceDate || "-"}</div>
              {invoice.eWayBillNo && <div style={{ fontSize:10, opacity:.65, marginTop:2 }}>E-Way Bill: {invoice.eWayBillNo}</div>}
              <div style={{ fontSize:10, opacity:.65, marginTop:2 }}>PO No.: {invoice.poRef || "-"} | PO Date: {invoice.poDate || "-"}</div>
            </div>
          </div>

          {/* Sub-header meta row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0, borderBottom:"2px solid #e2e8f0", backgroundColor:"#f5f5f5" }}>
            {[
              ["Station",       invoice.station    || "-"],
              ["Transport",     invoice.transport  || "-"],
              ["Vehicle No.",   invoice.vehicleNo  || "-"],
              ["Reverse Chg.",  invoice.reverseCharge || "N"],
              ["GR/RR No.",     invoice.grNo       || "-"],
            ].map(([label, val]) => (
              <div key={label} style={{ padding:"10px 16px", borderRight:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", color:"#888", letterSpacing:".06em", marginBottom:3 }}>{label}</div>
                <div style={{ fontSize:12, fontWeight:600, color:"#30333e" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Parties */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:"2px solid #e2e8f0" }}>
            {[
              { label:"Billed To", name: invoice.supplier?.partyName, addr: invoice.supplier?.address, city: invoice.supplier?.city, pin: invoice.supplier?.pincode, gstin: invoice.supplier?.gstin },
              { label:"Shipped To", name: invoice.shipToName || invoice.supplier?.partyName, addr: invoice.shipToAddress || invoice.supplier?.address, city: invoice.shipToCity || invoice.supplier?.city, pin: invoice.shipToPincode || invoice.supplier?.pincode, gstin: invoice.shipToGstin || invoice.supplier?.gstin },
            ].map((p) => (
              <div key={p.label} style={{ padding:"16px 24px", borderRight:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", color:"#44a83e", letterSpacing:".06em", marginBottom:6 }}>{p.label}</div>
                <div style={{ fontSize:14, fontWeight:800, color:"#30333e", marginBottom:3 }}>{p.name || "-"}</div>
                <div style={{ fontSize:11, color:"#3a3c44", lineHeight:1.7 }}>
                  {p.addr}<br/>{p.city} {p.pin}<br/>
                  <span style={{ fontWeight:700 }}>GSTIN:</span> {p.gstin || "-"}
                </div>
              </div>
            ))}
          </div>

          {/* IRN */}
          {invoice.irn && (
            <div style={{ padding:"8px 24px", backgroundColor:"#f0fdf4", borderBottom:"1px solid #e2e8f0", fontSize:10, color:"#3a3c44", wordBreak:"break-all" }}>
              <strong>IRN:</strong> {invoice.irn} &nbsp;&nbsp; <strong>Ack.No.:</strong> {invoice.ackNo} &nbsp;&nbsp; <strong>Ack.Date:</strong> {invoice.ackDate}
            </div>
          )}

          {/* Box/Weight info */}
          {(invoice.totalBox || invoice.totalWeight) && (
            <div style={{ padding:"8px 24px", fontSize:11, fontWeight:700, color:"#30333e", borderBottom:"1px solid #e2e8f0", backgroundColor:"#fefce8" }}>
              TOTAL BOX: {invoice.totalBox || "-"} &nbsp;&nbsp;&nbsp; TOTAL WEIGHT: {invoice.totalWeight || "-"}
            </div>
          )}

          {/* Items table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ backgroundColor:"#30333e" }}>
                  {["S.N.","Description of Goods","HSN/SAC","Packing","Qty.","Unit","Price","Amount (₹)"].map(h => (
                    <th key={h} style={{ padding:"10px 12px", fontSize:10, textAlign:"left", color:"#fff", fontWeight:700, textTransform:"uppercase", whiteSpace:"nowrap", letterSpacing:".04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id || i} style={{ borderBottom:"1px solid #f1f5f9", backgroundColor: i%2===0?"#fff":"#fafafa" }}>
                    <td style={{ padding:"9px 12px", fontSize:12, color:"#888" }}>{i+1}</td>
                    <td style={{ padding:"9px 12px", fontSize:12, fontWeight:600, color:"#30333e" }}>{item.productName || "-"}</td>
                    <td style={{ padding:"9px 12px", fontSize:11, color:"#3a3c44", fontFamily:"monospace" }}>{item.hsn || "-"}</td>
                    <td style={{ padding:"9px 12px", fontSize:11, color:"#3a3c44" }}>{item.packing || "-"}</td>
                    <td style={{ padding:"9px 12px", fontSize:12, fontWeight:700, color:"#30333e" }}>{Number(item.quantity||0).toLocaleString("en-IN")}</td>
                    <td style={{ padding:"9px 12px", fontSize:11, color:"#3a3c44" }}>{item.unit || "Pcs"}</td>
                    <td style={{ padding:"9px 12px", fontSize:12, color:"#30333e" }}>{Number(item.unitPrice||0).toFixed(2)}</td>
                    <td style={{ padding:"9px 12px", fontSize:12, fontWeight:700, color:"#30333e" }}>
                      {(Number(item.quantity||0)*Number(item.unitPrice||0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ display:"flex", justifyContent:"flex-end", padding:"16px 24px 0" }}>
            <div style={{ width:300 }}>
              {[
                ["Subtotal",         `₹ ${(invoice.subtotal||0).toFixed(2)}`,           false],
                (invoice.discountAmount||0)>0 ? ["Discount", `-₹ ${Number(invoice.discountAmount).toFixed(2)}`, true] : null,
                ["Taxable Amount",   `₹ ${taxableAmount.toFixed(2)}`,                   false],
                (invoice.cgst||0)>0 ? [`CGST @ ${invoice.cgstPercent||0}%`, `₹ ${Number(invoice.cgst).toFixed(2)}`, false] : null,
                (invoice.sgst||0)>0 ? [`SGST @ ${invoice.sgstPercent||0}%`, `₹ ${Number(invoice.sgst).toFixed(2)}`, false] : null,
                (invoice.igst||0)>0 ? [`IGST @ ${invoice.igstPercent||0}%`, `₹ ${Number(invoice.igst).toFixed(2)}`, false] : null,
              ].filter(Boolean).map(([label, val, red]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #f1f5f9", fontSize:12, color: red ? "#ef4444":"#3a3c44" }}>
                  <span>{label}</span><span style={{ fontWeight:700 }}>{val}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 16px", background:"#30333e", borderRadius:8, marginTop:10 }}>
                <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Grand Total</span>
                <span style={{ fontSize:16, fontWeight:900, color:"#44a83e" }}>₹ {Number(invoice.finalTotal||0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div style={{ margin:"16px 24px 0", padding:"12px 16px", backgroundColor:"#f0fdf4", border:"1px solid #b9f0b4", borderRadius:8, fontSize:12 }}>
            <strong style={{ color:"#166534" }}>Bank Details:</strong>&nbsp;
            {invoice.bankName || "-"} &nbsp;|&nbsp; A/C: {invoice.accountNo || "-"} &nbsp;|&nbsp; IFSC: {invoice.ifscCode || "-"}
          </div>

          {/* Terms */}
          {invoice.notes && (
            <div style={{ margin:"12px 24px 0", padding:"10px 14px", backgroundColor:"#fefce8", border:"1px solid #fde047", borderRadius:8, fontSize:11, color:"#92400e" }}>
              <strong>Terms & Conditions:</strong> {invoice.notes}
            </div>
          )}

          {/* Footer action bar */}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", padding:"20px 24px 0" }}>
            <button onClick={onClose}
              style={{ padding:"10px 24px", borderRadius:8, border:"1.5px solid #e2e8f0", backgroundColor:"#f5f5f5", color:"#3a3c44", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={handlePrint}
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 24px", borderRadius:8, border:"none", backgroundColor:"#44a83e", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              <Printer size={14} /> Print
            </button>
            <button onClick={onSave}
              style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 28px", borderRadius:8, border:"none", backgroundColor:"#30333e", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              <Save size={14} /> Save Invoice
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── TaxRow ────────────────────────────────────────────────────────────────────
function TaxRow({ label, percent, setPercent, amount, setAmount, base }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"90px 1fr 1fr", gap:10, alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f1f5f9" }}>
      <span style={{ fontSize:13, fontWeight:700, color:"#30333e" }}>{label}</span>
      <input type="number" value={percent} placeholder="%" style={{ ...inputStyle, padding:"7px 10px" }}
        onChange={(e) => { const p=parseFloat(e.target.value)||0; setPercent(p); setAmount((base*p)/100); }} />
      <input type="number" value={amount} placeholder="₹" style={{ ...inputStyle, padding:"7px 10px" }}
        onChange={(e) => { const a=parseFloat(e.target.value)||0; setAmount(a); setPercent(base?(a/base)*100:0); }} />
    </div>
  );
}

// ── ProductSearch autocomplete ────────────────────────────────────────────────
function ProductSearch({ item, idx, errors, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(item.productName || "");
  const [dropdownPos, setDropdownPos] = useState({ top:0, left:0, width:0 });
  const ref = useRef(null);

  useEffect(() => { setQuery(item.productName || ""); }, [item.productName]);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const matches = query.trim()
    ? PRODUCT_CATALOGUE.filter(p =>
        p.productName.toLowerCase().includes(query.toLowerCase()) ||
        p.poCode.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (prod) => {
    setQuery(prod.productName); setOpen(false);
    onChange(item.id, { productName:prod.productName, poCode:prod.poCode, hsn:prod.hsn, unitPrice:prod.unitPrice, unit:prod.unit });
  };

  return (
    <div ref={ref} style={{ position:"relative", minWidth:160 }}>
      <input type="text" placeholder="Product name" value={query}
        onChange={(e) => {
          const val=e.target.value; setQuery(val); onChange(item.id, { productName:val });
          const rect=e.target.getBoundingClientRect();
          setDropdownPos({ top:rect.bottom+window.scrollY, left:rect.left+window.scrollX, width:rect.width });
          setOpen(true);
        }}
        onFocus={(e) => {
          const rect=e.target.getBoundingClientRect();
          setDropdownPos({ top:rect.bottom+window.scrollY, left:rect.left+window.scrollX, width:rect.width });
          if (query) setOpen(true);
        }}
        style={{ ...inputStyle, padding:"8px 10px", border:"1.5px solid "+(errors[`product_${idx}`]?"#f87171":"#e2e8f0"), backgroundColor:errors[`product_${idx}`]?"#fff5f5":"#f5f5f5" }}
      />
      {errors[`product_${idx}`] && <p style={{ margin:"2px 0 0", fontSize:10, color:"#ef4444" }}>Required</p>}
      {open && matches.length > 0 && createPortal(
        <div style={{ position:"absolute", top:dropdownPos.top, left:dropdownPos.left, width:Math.max(dropdownPos.width,240), zIndex:9999, backgroundColor:"#fff", border:"1px solid #e2e8f0", borderRadius:8, boxShadow:"0 12px 32px rgba(0,0,0,0.12)", maxHeight:240, overflowY:"auto" }}>
          {matches.map(prod => (
            <div key={prod.poCode} onMouseDown={() => handleSelect(prod)}
              style={{ padding:"9px 14px", borderBottom:"1px solid #f1f5f9", cursor:"pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor="#f0fdf4"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor="#fff"}>
              <div style={{ fontSize:13, fontWeight:600, color:"#30333e" }}>{prod.productName}</div>
              <div style={{ fontSize:11, color:"#888" }}>{prod.poCode} · HSN {prod.hsn} · ₹{prod.unitPrice}</div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHead({ icon: Icon, title, color="#44a83e" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
      {Icon && <Icon size={15} style={{ color }} />}
      <h3 style={{ margin:0, fontSize:14, fontWeight:800, color:"#30333e" }}>{title}</h3>
    </div>
  );
}

// ── Main InvoiceForm ──────────────────────────────────────────────────────────
export default function InvoiceForm({ sourcePO, onBack, onSubmit, existingInvoice, isEdit }) {

  const [invoiceNumber,   setInvoiceNumber]   = useState(existingInvoice?.invoiceNumber   || `INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate,     setInvoiceDate]     = useState(existingInvoice?.invoiceDate     || new Date().toISOString().split("T")[0]);
  const [dueDate,         setDueDate]         = useState(existingInvoice?.dueDate         || "");
  const [poRef,           setPoRef]           = useState(existingInvoice?.poRef           || sourcePO?.poNumber || "");
  const [poDate,          setPoDate]          = useState(existingInvoice?.poDate          || sourcePO?.poDate   || "");

  // FIX: Split into two distinct state variables — "station" and "placeOfSupply"
  const [station,         setStation]         = useState(existingInvoice?.station         || "");
  const [placeOfSupply,   setPlaceOfSupply]   = useState(existingInvoice?.placeOfSupply   || "");

  const [eWayBillNo,      setEWayBillNo]      = useState(existingInvoice?.eWayBillNo      || "");
  const [transport,       setTransport]       = useState(existingInvoice?.transport       || "");
  const [vehicleNo,       setVehicleNo]       = useState(existingInvoice?.vehicleNo       || "");
  const [reverseCharge,   setReverseCharge]   = useState(existingInvoice?.reverseCharge   || "N");
  const [grNo,            setGrNo]            = useState(existingInvoice?.grNo            || "");
  const [totalBox,        setTotalBox]        = useState(existingInvoice?.totalBox        || "");
  const [totalWeight,     setTotalWeight]     = useState(existingInvoice?.totalWeight     || "");

  // Supplier GSTIN (our company)
  const [supplierGstin,   setSupplierGstin]   = useState(existingInvoice?.supplierGstin   || "");
  const [supplierCompany, setSupplierCompany] = useState(existingInvoice?.supplierCompany || "");

  // IRN
  const [irn,    setIrn]    = useState(existingInvoice?.irn    || "");
  const [ackNo,  setAckNo]  = useState(existingInvoice?.ackNo  || "");
  const [ackDate,setAckDate]= useState(existingInvoice?.ackDate|| "");

  // Shipped-to (separate from billed-to)
  const [shipToName,    setShipToName]    = useState(existingInvoice?.shipToName    || "");
  const [shipToAddress, setShipToAddress] = useState(existingInvoice?.shipToAddress || "");
  const [shipToCity,    setShipToCity]    = useState(existingInvoice?.shipToCity    || "");
  const [shipToPincode, setShipToPincode] = useState(existingInvoice?.shipToPincode || "");
  const [shipToGstin,   setShipToGstin]   = useState(existingInvoice?.shipToGstin   || "");

  // Bank details
  const [bankName,  setBankName]  = useState(existingInvoice?.bankName  || "");
  const [accountNo, setAccountNo] = useState(existingInvoice?.accountNo || "");
  const [ifscCode,  setIfscCode]  = useState(existingInvoice?.ifscCode  || "");

  const [paymentTerms, setPaymentTerms] = useState(existingInvoice?.paymentTerms || sourcePO?.supplier?.paymentTerms || "");
  const [notes,        setNotes]        = useState(existingInvoice?.notes        || "");

  // FIX: Declare payMode, chequeRef, utrRef states that were missing
  const [payMode,    setPayMode]    = useState(existingInvoice?.payMode    || "");
  const [chequeRef,  setChequeRef]  = useState(existingInvoice?.chequeRef  || "");
  const [utrRef,     setUtrRef]     = useState(existingInvoice?.utrRef     || "");
  const [transferMode, setTransferMode] = useState(existingInvoice?.transferMode || "NEFT");

  // Tax
  const [cgstPercent, setCgstPercent] = useState(existingInvoice?.cgstPercent || sourcePO?.cgstPercent || 0);
  const [cgstAmount,  setCgstAmount]  = useState(existingInvoice?.cgst        || sourcePO?.cgst        || 0);
  const [sgstPercent, setSgstPercent] = useState(existingInvoice?.sgstPercent || sourcePO?.sgstPercent || 0);
  const [sgstAmount,  setSgstAmount]  = useState(existingInvoice?.sgst        || sourcePO?.sgst        || 0);
  const [igstPercent, setIgstPercent] = useState(existingInvoice?.igstPercent || sourcePO?.igstPercent || 0);
  const [igstAmount,  setIgstAmount]  = useState(existingInvoice?.igst        || sourcePO?.igst        || 0);

  // Supplier (billed-to)
  const initSup = existingInvoice?.supplier || sourcePO?.supplier || {};
  const [formData, setFormData] = useState({
    partyName:    initSup.partyName    || "",
    companyName:  initSup.companyName  || "",
    code:         initSup.code         || "",
    address:      initSup.address      || "",
    city:         initSup.city         || "",
    country:      initSup.country      || "India",
    gstin:        initSup.gstin        || "",
    paymentTerms: initSup.paymentTerms || "",
    pincode:      initSup.pincode      || "",
    email:        initSup.email        || "",
  });

  // Items — with packing field
  const [items, setItems] = useState(
    existingInvoice?.items || sourcePO?.items ||
    [{ id:1, productName:"", poCode:"", hsn:"", packing:"", quantity:"", unitPrice:"", unit:"Pcs" }]
  );

  const [discountPercent, setDiscountPercent] = useState(existingInvoice?.discountPercent || sourcePO?.discountPercent || 0);
  const [discountAmount,  setDiscountAmount]  = useState(existingInvoice?.discountAmount  || sourcePO?.discountAmount  || 0);

  const [errors,      setErrors]      = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [builtInvoice,setBuiltInvoice]= useState(null);

  // helpers
  const handleAddItem    = () => setItems([...items, { id:Date.now(), productName:"", poCode:"", hsn:"", packing:"", quantity:"", unitPrice:"", unit:"Pcs" }]);
  const handleRemoveItem = (id) => { if (items.length > 1) setItems(items.filter(i => i.id !== id)); };
  const handleItemChange = (id, fieldOrObj, value) => {
    if (typeof fieldOrObj === "object") setItems(items.map(i => i.id===id ? { ...i, ...fieldOrObj } : i));
    else setItems(items.map(i => i.id===id ? { ...i, [fieldOrObj]:value } : i));
  };

  const calcItemTotal = (item) => (parseFloat(item.quantity)||0) * (parseFloat(item.unitPrice)||0);
  const subtotal      = items.reduce((s,i) => s + calcItemTotal(i), 0);
  const finalDiscount = discountPercent > 0 ? (subtotal * discountPercent)/100 : discountAmount;
  const taxableAmount = subtotal - finalDiscount;
  const totalTax      = cgstAmount + sgstAmount + igstAmount;
  const finalTotal    = taxableAmount + totalTax;

  const buildInvoiceObject = () => ({
    invoiceNumber, invoiceDate, dueDate, poRef, poDate,
    station, placeOfSupply,
    eWayBillNo, transport, vehicleNo, reverseCharge, grNo,
    totalBox, totalWeight,
    supplierGstin, supplierCompany, irn, ackNo, ackDate,
    shipToName, shipToAddress, shipToCity, shipToPincode, shipToGstin,
    bankName, accountNo, ifscCode,
    paymentTerms, payMode, chequeRef, utrRef, transferMode,
    notes,
    supplier: formData, items,
    discountPercent, discountAmount:finalDiscount, subtotal,
    cgst:cgstAmount, cgstPercent,
    sgst:sgstAmount, sgstPercent,
    igst:igstAmount, igstPercent,
    totalTax, finalTotal, total:finalTotal,
    createdAt: new Date().toISOString(),
    id: existingInvoice?.id || Date.now(),
    status: existingInvoice?.status || "Unpaid",
  });

  const validate = () => {
    const e = {};
    if (!dueDate) e.dueDate = "Due date is required";
    items.forEach((item, idx) => {
      if (!item.productName)                                 e[`product_${idx}`] = "Required";
      if (!item.quantity || parseFloat(item.quantity) <= 0) e[`qty_${idx}`]     = "Required";
      if (!item.unitPrice|| parseFloat(item.unitPrice)<= 0) e[`price_${idx}`]   = "Required";
    });
    return e;
  };

  const handlePreview = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setBuiltInvoice(buildInvoiceObject());
    setShowPreview(true);
  };

  const handleSave = () => {
    const inv = builtInvoice || buildInvoiceObject();
    setShowPreview(false);
    onSubmit(inv);
  };

  const fd = (field) => (val) => setFormData(p => ({ ...p, [field]:val }));

  const Field = ({ label, children, col }) => (
    <div style={{ gridColumn: col }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  const inp = (val, set, opts={}) => (
    <input type={opts.type||"text"} value={val}
      onChange={(e) => set(e.target.value)}
      placeholder={opts.placeholder||""}
      style={{ ...inputStyle, ...(opts.mono && { fontFamily:"monospace" }), ...(opts.style||{}) }} />
  );

  const sec = (style={}) => ({
    borderRadius:12, border:"1px solid #e2e8f0",
    padding:"18px 20px", marginBottom:20, ...style
  });

  return (
    <div style={{ padding:"24px 28px" }}>

      {/* Header */}
      <div style={{ marginBottom:24, display:"flex", alignItems:"center", gap:14 }}>
        <button onClick={onBack} style={{ width:38, height:38, borderRadius:10, border:"1.5px solid #e2e8f0", backgroundColor:"#f5f5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <ArrowLeft style={{ width:16, height:16, color:"#3a3c44" }} />
        </button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <FileText size={18} style={{ color:"#44a83e" }} />
            <h2 style={{ margin:0, fontSize:19, fontWeight:800, color:"#30333e" }}>
              {isEdit ? "Edit Invoice" : "Create Invoice"}
            </h2>
          </div>
          <p style={{ margin:"3px 0 0", fontSize:12, color:"#3a3c44" }}>
            {formData.partyName}
            {poRef && <span style={{ marginLeft:8, fontSize:10, fontFamily:"monospace", backgroundColor:"#f0fdf4", color:"#44a83e", padding:"2px 7px", borderRadius:4, fontWeight:600 }}>PO: {poRef}</span>}
          </p>
        </div>
      </div>

      {/* ── Section 1: Supplier Company Info ── */}
      <div style={sec()}>
        <SectionHead title="Supplier / Vendor Info" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          <Field label="Supplier Company Name">
            {inp(supplierCompany, setSupplierCompany, { placeholder:"e.g. Manik Printpack India Pvt Ltd" })}
          </Field>
          <Field label="Supplier GSTIN">
            {inp(supplierGstin, setSupplierGstin, { placeholder:"e.g. 06AAGCM2579P1ZT", mono:true })}
          </Field>
          <Field label="Supplier Email">
            {inp(formData.email, fd("email"), { placeholder:"accounts@example.com" })}
          </Field>
        </div>
      </div>

      {/* ── Section 2: Invoice Header Details ── */}
      <div style={sec()}>
        <SectionHead title="Invoice Details" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:14 }}>
          <Field label="Invoice No.">
            {inp(invoiceNumber, setInvoiceNumber, { mono:true })}
          </Field>
          <Field label="Invoice Date">
            {inp(invoiceDate, setInvoiceDate, { type:"date" })}
          </Field>
          <Field label="Due Date *">
            <input type="date" value={dueDate}
              onChange={(e) => { setDueDate(e.target.value); setErrors(p => ({ ...p, dueDate:"" })); }}
              style={{ ...inputStyle, border:"1.5px solid "+(errors.dueDate?"#f87171":"#e2e8f0"), backgroundColor:errors.dueDate?"#fff5f5":"#f5f5f5" }} />
            {errors.dueDate && <p style={{ margin:"3px 0 0", fontSize:10, color:"#ef4444" }}>{errors.dueDate}</p>}
          </Field>
          {/* FIX: Use dedicated placeOfSupply state, not station */}
          <Field label="Place of Supply">
            {inp(placeOfSupply, setPlaceOfSupply, { placeholder:"e.g. Madhya Pradesh (23)" })}
          </Field>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:14 }}>
          <Field label="PO No.">
            {inp(poRef, setPoRef, { placeholder:"e.g. 09", mono:true })}
          </Field>
          <Field label="PO Date">
            {inp(poDate, setPoDate, { type:"date" })}
          </Field>
          <Field label="E-Way Bill No.">
            {inp(eWayBillNo, setEWayBillNo, { placeholder:"e.g. 332241165805", mono:true })}
          </Field>
          <Field label="Reverse Charge">
            <select value={reverseCharge} onChange={(e)=>setReverseCharge(e.target.value)} style={inputStyle}>
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </Field>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          <Field label="Transport">
            {inp(transport, setTransport, { placeholder:"e.g. Yashika Road Line" })}
          </Field>
          <Field label="Vehicle No.">
            {inp(vehicleNo, setVehicleNo, { placeholder:"e.g. UP14JT0911", mono:true })}
          </Field>
          <Field label="GR / RR No.">
            {inp(grNo, setGrNo, { placeholder:"GR/RR number" })}
          </Field>
          {/* FIX: Use dedicated station state here */}
          <Field label="Station">
            {inp(station, setStation, { placeholder:"e.g. Food Park Maneri" })}
          </Field>
        </div>
      </div>

      {/* ── Section 3: Billed To / Shipped To ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        {/* Billed To */}
        <div style={sec({ marginBottom:0 })}>
          <SectionHead title="Billed To" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Party / Company Name">
              {inp(formData.partyName, fd("partyName"), { placeholder:"e.g. Tektronics EMS Limited" })}
            </Field>
            <Field label="GSTIN">
              {inp(formData.gstin, fd("gstin"), { placeholder:"e.g. 23AADCT9240K1Z7", mono:true })}
            </Field>
            <Field label="Address" col="1 / -1">
              {inp(formData.address, fd("address"), { placeholder:"Street / Plot / Area" })}
            </Field>
            <Field label="City">
              {inp(formData.city, fd("city"), { placeholder:"City" })}
            </Field>
            <Field label="Pincode">
              {inp(formData.pincode, fd("pincode"), { placeholder:"e.g. 481885" })}
            </Field>
          </div>
        </div>

        {/* Shipped To */}
        <div style={sec({ marginBottom:0 })}>
          <SectionHead title="Shipped To" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Name">
              {inp(shipToName, setShipToName, { placeholder:"Same as Billed To or different" })}
            </Field>
            <Field label="GSTIN">
              {inp(shipToGstin, setShipToGstin, { placeholder:"e.g. 23AADCT9240K1Z7", mono:true })}
            </Field>
            <Field label="Address" col="1 / -1">
              {inp(shipToAddress, setShipToAddress, { placeholder:"Street / Plot / Area" })}
            </Field>
            <Field label="City">
              {inp(shipToCity, setShipToCity, { placeholder:"City" })}
            </Field>
            <Field label="Pincode">
              {inp(shipToPincode, setShipToPincode, { placeholder:"e.g. 481885" })}
            </Field>
          </div>
        </div>
      </div>

      {/* ── Section 4: IRN Details ── */}
      <div style={sec()}>
        <SectionHead title="E-Invoice / IRN Details (optional)" />
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:14 }}>
          <Field label="IRN">
            {inp(irn, setIrn, { placeholder:"e.g. 0da64b1688a0d347...", mono:true })}
          </Field>
          <Field label="Ack. No.">
            {inp(ackNo, setAckNo, { placeholder:"e.g. 132626823965580", mono:true })}
          </Field>
          <Field label="Ack. Date">
            {inp(ackDate, setAckDate, { type:"date" })}
          </Field>
        </div>
      </div>

      {/* ── Section 5: Box / Weight ── */}
      <div style={sec()}>
        <SectionHead title="Shipment Info" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          <Field label="Total Boxes">
            {inp(totalBox, setTotalBox, { placeholder:"e.g. 382" })}
          </Field>
          <Field label="Total Weight">
            {inp(totalWeight, setTotalWeight, { placeholder:"e.g. 5000 KGS" })}
          </Field>
        </div>
      </div>

      {/* ── Section 6: PAYMENT MODE ── */}
      <div style={sec()}>
        <div style={S.card}>
          <div style={S.cardHead}>
            <div style={S.dot} />
            <span style={S.cardTitle}>Payment Mode</span>
          </div>

          <div style={S.cardBody}>

            {/* Payment Mode Dropdown */}
            <div style={{ marginBottom: 24 }}>
              <label style={S.formLabel}>Payment Mode *</label>
              <select
                value={payMode}
                onChange={(e) => {
                  setPayMode(e.target.value);
                  // Reset payment-specific fields on mode change
                  setBankName("");
                  setChequeRef("");
                  setUtrRef("");
                  setPaymentTerms("");
                }}
                style={{ ...S.formControl, marginTop: 6, background: "#fff", cursor: "pointer", fontWeight: 600 }}
              >
                <option value="">-- Select Payment Mode --</option>
                <option value="Cash">💵 Cash</option>
                <option value="Credit">💳 Credit</option>
                <option value="Bank">🏦 Bank Transfer</option>
              </select>
            </div>

            {/* Cash Mode */}
            {payMode === "Cash" && (
              <div style={{ backgroundColor:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:24 }}>✅</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#166534" }}>Cash Payment Selected</div>
                  <div style={{ fontSize:12, color:"#4b5563", marginTop:3 }}>Payment will be collected in cash.</div>
                </div>
              </div>
            )}

            {/* Credit Mode */}
            {payMode === "Credit" && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
                <div>
                  <label style={S.formLabel}>Credit Terms</label>
                  <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} style={{ ...S.formControl, marginTop:6 }}>
                    <option value="">-- Select Terms --</option>
                    <option value="Net 7">Net 7</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Net 90">Net 90</option>
                  </select>
                </div>
                <div>
                  <label style={S.formLabel}>Reference / Purchase Ref</label>
                  <input type="text" value={poRef} onChange={(e) => setPoRef(e.target.value)}
                    placeholder="e.g. PUR-2024-101"
                    style={{ ...S.formControl, marginTop:6, fontFamily:"monospace" }} />
                </div>
                <div style={{ gridColumn:"1 / -1", background:"#fef9c3", border:"1.5px solid #fde047", borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#92400e" }}>💳 Credit Terms Applied</div>
                  <div style={{ marginTop:4, fontSize:12, color:"#a16207" }}>Payment is due according to selected credit terms.</div>
                </div>
              </div>
            )}

            {/* Bank Transfer Mode */}
            {payMode === "Bank" && (
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                <div>
                  <label style={S.formLabel}>Bank Name *</label>
                  <select value={bankName} onChange={(e) => setBankName(e.target.value)}
                    style={{ ...S.formControl, marginTop:6, borderColor:!bankName?"#fbbf24":"#e2e8f0", background:!bankName?"#fffbeb":"#fff" }}>
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
                  {!bankName && <div style={{ marginTop:5, fontSize:11, color:"#f59e0b" }}>Please select a bank</div>}
                </div>

                {bankName && (
                  <>
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:"#eff6ff", border:"1.5px solid #bfdbfe", borderRadius:12 }}>
                      <div style={{ fontSize:24 }}>🏦</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#1d4ed8" }}>{bankName}</div>
                        <div style={{ marginTop:2, fontSize:11, color:"#3b82f6" }}>Selected for purchase payment</div>
                      </div>
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
                      <div>
                        <label style={S.formLabel}>Transfer Mode</label>
                        <select value={transferMode} onChange={(e) => setTransferMode(e.target.value)} style={{ ...S.formControl, marginTop:6 }}>
                          <option>NEFT</option>
                          <option>RTGS</option>
                          <option>IMPS</option>
                          <option>UPI</option>
                          <option>Cheque</option>
                          <option>DD</option>
                        </select>
                      </div>
                      <div>
                        <label style={S.formLabel}>UTR / Reference No.</label>
                        <input type="text" value={utrRef} onChange={(e) => setUtrRef(e.target.value)}
                          placeholder="e.g. SBIN00012345"
                          style={{ ...S.formControl, marginTop:6, fontFamily:"monospace" }} />
                      </div>
                      <div>
                        <label style={S.formLabel}>Cheque / DD No.</label>
                        <input type="text" value={chequeRef} onChange={(e) => setChequeRef(e.target.value)}
                          placeholder="e.g. 123456"
                          style={{ ...S.formControl, marginTop:6, fontFamily:"monospace" }} />
                      </div>
                      <div>
                        <label style={S.formLabel}>Account No.</label>
                        <input type="text" value={accountNo} onChange={(e) => setAccountNo(e.target.value)}
                          placeholder="e.g. 001234567890"
                          style={{ ...S.formControl, marginTop:6, fontFamily:"monospace" }} />
                      </div>
                      <div>
                        <label style={S.formLabel}>IFSC Code</label>
                        <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)}
                          placeholder="e.g. ICIC0001234"
                          style={{ ...S.formControl, marginTop:6, fontFamily:"monospace" }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* No Selection */}
            {!payMode && (
              <div style={{ textAlign:"center", padding:"22px 18px", borderRadius:12, background:"#f8fafc", border:"1.5px dashed #cbd5e1" }}>
                <div style={{ fontSize:13, color:"#94a3b8" }}>Select a payment mode to continue</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 7: Line Items ── */}
      <div style={sec()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <SectionHead title="Line Items" />
          <button onClick={handleAddItem}
            style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:"none", backgroundColor:"#30333e", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            <Plus size={13} /> Add Row
          </button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:860 }}>
            <thead>
              <tr style={{ backgroundColor:"#30333e" }}>
                {["#","Product Name","HSN/SAC","Packing","Qty","Unit","Unit Price (₹)","Amount (₹)",""].map(h => (
                  <th key={h} style={{ padding:"9px 10px", fontSize:10, textAlign:"left", color:"#fff", fontWeight:700, textTransform:"uppercase", whiteSpace:"nowrap", letterSpacing:".04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom:"1px solid #f1f5f9", backgroundColor: idx%2===0?"#fff":"#fafafa" }}>
                  <td style={{ padding:"8px 10px", fontSize:12, color:"#888", width:28 }}>{idx+1}</td>
                  <td style={{ padding:"8px 10px", minWidth:180 }}>
                    <ProductSearch item={item} idx={idx} errors={errors} onChange={handleItemChange} />
                  </td>
                  <td style={{ padding:"8px 10px", minWidth:90 }}>
                    <input type="text" placeholder="HSN" value={item.hsn}
                      onChange={(e) => handleItemChange(item.id, "hsn", e.target.value)}
                      style={{ ...inputStyle, padding:"7px 8px", fontFamily:"monospace", fontSize:11 }} />
                  </td>
                  <td style={{ padding:"8px 10px", minWidth:100 }}>
                    <input type="text" placeholder="e.g. 10X1200" value={item.packing||""}
                      onChange={(e) => handleItemChange(item.id, "packing", e.target.value)}
                      style={{ ...inputStyle, padding:"7px 8px", fontSize:11 }} />
                  </td>
                  <td style={{ padding:"8px 10px", minWidth:80 }}>
                    <input type="number" placeholder="0" value={item.quantity}
                      onChange={(e) => { handleItemChange(item.id,"quantity",e.target.value); setErrors(p=>({...p,[`qty_${idx}`]:""})); }}
                      style={{ ...inputStyle, padding:"7px 8px", border:"1.5px solid "+(errors[`qty_${idx}`]?"#f87171":"#e2e8f0"), backgroundColor:errors[`qty_${idx}`]?"#fff5f5":"#f5f5f5" }} />
                    {errors[`qty_${idx}`] && <p style={{ margin:"2px 0 0", fontSize:10, color:"#ef4444" }}>Req.</p>}
                  </td>
                  <td style={{ padding:"8px 10px", minWidth:70 }}>
                    <select value={item.unit} onChange={(e) => handleItemChange(item.id,"unit",e.target.value)} style={{ ...inputStyle, padding:"7px 8px" }}>
                      {["Pcs","Kg","Meter","Box","Unit"].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"8px 10px", minWidth:100 }}>
                    <input type="number" placeholder="0.00" value={item.unitPrice}
                      onChange={(e) => { handleItemChange(item.id,"unitPrice",e.target.value); setErrors(p=>({...p,[`price_${idx}`]:""})); }}
                      style={{ ...inputStyle, padding:"7px 8px", border:"1.5px solid "+(errors[`price_${idx}`]?"#f87171":"#e2e8f0"), backgroundColor:errors[`price_${idx}`]?"#fff5f5":"#f5f5f5" }} />
                    {errors[`price_${idx}`] && <p style={{ margin:"2px 0 0", fontSize:10, color:"#ef4444" }}>Req.</p>}
                  </td>
                  <td style={{ padding:"8px 10px", fontSize:13, fontWeight:700, color:"#30333e", whiteSpace:"nowrap" }}>
                    ₹ {calcItemTotal(item).toFixed(2)}
                  </td>
                  <td style={{ padding:"8px 10px" }}>
                    <button onClick={() => handleRemoveItem(item.id)} disabled={items.length===1}
                      style={{ padding:"5px 9px", borderRadius:6, border:"1px solid #fecaca", backgroundColor:items.length===1?"#f5f5f5":"#fff5f5", color:items.length===1?"#cbd5e1":"#ef4444", cursor:items.length===1?"not-allowed":"pointer", display:"flex", alignItems:"center" }}>
                      <Trash2 style={{ width:12, height:12 }} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor:"#f5f5f5", borderTop:"2px solid #e2e8f0" }}>
                <td colSpan={7} style={{ padding:"10px 10px", textAlign:"right", fontWeight:700, fontSize:13, color:"#30333e" }}>Subtotal</td>
                <td style={{ padding:"10px 10px", fontWeight:800, fontSize:14, color:"#30333e" }}>₹ {subtotal.toFixed(2)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 8: Discount + Tax + Summary ── */}
      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 320px", gap:20, marginBottom:20 }}>
        <div style={sec({ marginBottom:0 })}>
          <SectionHead title="Discount & Tax" />
          <div style={{ display:"grid", gridTemplateColumns:"90px 1fr 1fr", gap:10, marginBottom:16 }}>
            <span style={{ fontSize:13, fontWeight:700, color:"#30333e", alignSelf:"center" }}>Discount</span>
            <input type="number" value={discountPercent} placeholder="%"
              onChange={(e) => { const p=parseFloat(e.target.value)||0; setDiscountPercent(p); setDiscountAmount((subtotal*p)/100); }}
              style={inputStyle} />
            <input type="number" value={discountAmount} placeholder="₹"
              onChange={(e) => { const a=parseFloat(e.target.value)||0; setDiscountAmount(a); setDiscountPercent(subtotal?(a/subtotal)*100:0); }}
              style={inputStyle} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"90px 1fr 1fr", gap:10, marginBottom:4 }}>
            {["Tax","Percent (%)","Amount (₹)"].map(h => (
              <span key={h} style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#888", letterSpacing:".06em" }}>{h}</span>
            ))}
          </div>
          <TaxRow label="CGST" percent={cgstPercent} setPercent={setCgstPercent} amount={cgstAmount} setAmount={setCgstAmount} base={taxableAmount} />
          <TaxRow label="SGST" percent={sgstPercent} setPercent={setSgstPercent} amount={sgstAmount} setAmount={setSgstAmount} base={taxableAmount} />
          <TaxRow label="IGST" percent={igstPercent} setPercent={setIgstPercent} amount={igstAmount} setAmount={setIgstAmount} base={taxableAmount} />
        </div>

        {/* Summary */}
        <div style={{ borderRadius:12, border:"2px solid #86efac", padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <FileText size={15} style={{ color:"#44a83e" }} />
            <h3 style={{ margin:0, fontSize:14, fontWeight:800, color:"#1a2a1a" }}>Invoice Summary</h3>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:9, fontSize:12, color:"#1a2a1a" }}>
            {[
              ["Subtotal",       `₹ ${subtotal.toFixed(2)}`,       false],
              ["Discount",       `-₹ ${finalDiscount.toFixed(2)}`, true],
              ["Taxable Amount", `₹ ${taxableAmount.toFixed(2)}`,  false],
              cgstAmount > 0 ? [`CGST (${cgstPercent}%)`, `₹ ${cgstAmount.toFixed(2)}`, false] : null,
              sgstAmount > 0 ? [`SGST (${sgstPercent}%)`, `₹ ${sgstAmount.toFixed(2)}`, false] : null,
              igstAmount > 0 ? [`IGST (${igstPercent}%)`, `₹ ${igstAmount.toFixed(2)}`, false] : null,
            ].filter(Boolean).map(([label, val, red]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", paddingBottom:7, borderBottom:"1px solid #b9f0b4" }}>
                <span style={{ color:"#44a83e" }}>{label}</span>
                <span style={{ fontWeight:600, color:red?"#ef4444":"#1a2a1a" }}>{val}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 14px", background:"#30333e", borderRadius:8, marginTop:4 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Grand Total</span>
              <span style={{ fontSize:16, fontWeight:800, color:"#44a83e" }}>₹ {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={sec()}>
        <label style={labelStyle}>Terms & Conditions / Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any payment terms, notes, or conditions..."
          rows={2}
          style={{ ...inputStyle, resize:"vertical", fontFamily:"inherit", lineHeight:1.6 }} />
      </div>

      {/* Action Buttons */}
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <button onClick={onBack} style={{ padding:"11px 26px", borderRadius:10, border:"1.5px solid #e2e8f0", backgroundColor:"#f5f5f5", color:"#3a3c44", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          Cancel
        </button>
        <button onClick={handlePreview} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"11px 30px", borderRadius:10, border:"none", backgroundColor:"#30333e", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
          <FileText size={14} /> Preview & Submit
        </button>
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && builtInvoice && (
        <InvoicePreviewModal
          invoice={builtInvoice}
          onClose={() => setShowPreview(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}