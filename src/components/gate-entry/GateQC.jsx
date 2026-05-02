import { useState, useRef } from "react";
import {
  Plus,
  Calendar,
  ClipboardList,
  Package,
  Hash,
  CheckCircle2,
} from "lucide-react";
import CreateTable from "../CreateTable";

// Dummy checklist templates
const checklistTemplates = [
  {
    id: 1,
    checklistName: "Mobile QC",
    applicableProduct: "Mobile",
    items: [
      {
        name: "Display",
        subName: "Brightness",
        valueType: "Numeric",
        min: 10,
        max: 100,
        tool: "Lux Meter",
      },
      {
        name: "Display",
        subName: "Dead Pixel",
        valueType: "Character",
        same: "No",
        tool: "Visual",
      },
    ],
  },
];

export default function GateQC() {
  const dateRef = useRef(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    grn: "",
    product: "",
    checklistId: "",
  });

  const [items, setItems] = useState([]);
  const [qcList, setQcList] = useState([]);
  const [status, setStatus] = useState("");

  const handleChecklistChange = (id) => {
    const selected = checklistTemplates.find((c) => c.id == id);
    setForm((prev) => ({
      ...prev,
      checklistId: id,
      product: selected?.applicableProduct || "",
    }));

    const mappedItems =
      selected?.items.map((item) => ({
        ...item,
        value: "",
        result: "",
      })) || [];

    setItems(mappedItems);
  };

  const handleValueChange = (index, value) => {
    const updated = [...items];
    const item = updated[index];
    item.value = value;

    if (item.valueType === "Numeric") {
      const num = Number(value);
      item.result = num >= item.min && num <= item.max ? "PASS" : "FAIL";
    } else {
      item.result =
        value.toLowerCase() === item.same.toLowerCase() ? "PASS" : "FAIL";
    }
    setItems(updated);
  };

  const total = items.length;
  const passed = items.filter((i) => i.result === "PASS").length;
  const failed = total - passed;
  const percentage = total ? ((passed / total) * 100).toFixed(2) : 0;

  const handleSave = () => {
    if (!form.grn || !status) return alert("Please fill GRN and Status");

    const newEntry = {
      id: Date.now(),
      date: form.date,
      grn: form.grn,
      product: form.product,
      percentage: `${percentage}%`,
      status,
    };

    setQcList((prev) => [newEntry, ...prev]);
    setItems([]);
    setStatus("");
    setForm({
      date: new Date().toISOString().split("T")[0],
      grn: "",
      product: "",
      checklistId: "",
    });
  };

  const columns = [
    { label: "Date", key: "date" },
    { label: "GRN", key: "grn" },
    { label: "Product", key: "product" },
    { label: "Result %", key: "percentage" },
    { label: "Status", key: "status" },
  ];

  const [grnLoading, setGrnLoading] = useState(false);

  const validateGRN = async () => {
    if (!form.grn) {
      alert("Enter GRN first");
      return;
    }

    try {
      setGrnLoading(true);

      // 🔥 Replace with your real API
      const res = await fetch(`/api/grn/${form.grn}`);
      const data = await res.json();

      if (!data.success) {
        alert("Invalid GRN");
        return;
      }

      // ✅ Example response handling
      setForm((prev) => ({
        ...prev,
        product: data.product, // auto fill
      }));
    } catch (err) {
      console.error(err);

      // 🧪 Mock fallback (remove later)
      setForm((prev) => ({
        ...prev,
        product: "Mobile",
      }));

      alert("Mock: GRN Validated");
    } finally {
      setGrnLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 dark:text-white">
      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Gate QC Entry
          </h2>
          <p className="text-sm text-slate-500">
            Perform quality checks on incoming material
          </p>
        </div>
      </div>

      {/* 🔹 STYLIZED FORM CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        {/* CARD HEADER */}
        <div
          className="border-b border-slate-200 px-6 py-5 flex items-center justify-between dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">QC Form</h2>
              <p className="text-xs text-white/60">Enter inspection details</p>
            </div>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-4">
          {/* Date Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Date
            </label>

            <div
              className="relative cursor-pointer"
              onClick={() => dateRef.current?.showPicker()} // 🔥 opens picker on click
            >
              <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />

              <input
                ref={dateRef}
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all dark:border-[#1b2740] dark:bg-[#11182b]"
              />
            </div>
          </div>

          {/* GRN Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">
              GRN Number
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Enter GRN"
                  value={form.grn}
                  onChange={(e) => setForm({ ...form, grn: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                />
              </div>

              {/* 🔥 VALIDATE BUTTON */}
              <button
                onClick={validateGRN}
                className="flex items-center  rounded-xl bg-[#44a83e] px-3 py-1 text-sm font-semibold text-white transition-all hover:bg-[#3c9437] active:scale-95 shadow-lg shadow-green-500/20"
              >
                {grnLoading ? "..." : "Check"}
              </button>
            </div>
          </div>

          {/* Product Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Product
            </label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={form.product}
                readOnly
                placeholder="Product auto-fills"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm dark:border-[#1b2740] dark:bg-[#11182b]"
              />
            </div>
          </div>

          {/* Checklist Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Select Checklist
            </label>
            <div className="relative">
              <CheckCircle2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={form.checklistId}
                onChange={(e) => handleChecklistChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
              >
                <option value="">Choose Template</option>
                {checklistTemplates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.checklistName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 🔹 INSPECTION TABLE SECTION */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-6 dark:border-[#1b2740]">
            <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">
              Inspection Parameters
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#1b2740]">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-[#11182b]">
                  <tr className="text-slate-500">
                    <th className="p-3 font-semibold">S.No</th>
                    <th className="p-3 font-semibold">Parameter</th>
                    <th className="p-3 font-semibold">Ideal Value</th>
                    <th className="p-3 font-semibold">Tool</th>
                    <th className="p-3 font-semibold text-center">
                      Observed Value
                    </th>
                    <th className="p-3 font-semibold text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1b2740]">
                  {items.map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/5"
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.subName}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.valueType === "Numeric"
                          ? `${item.min}-${item.max}`
                          : item.same}
                      </td>
                      <td className="p-3 text-slate-500 italic text-xs">
                        {item.tool}
                      </td>
                      <td className="p-3 text-center">
                        <input
                          className="w-24 rounded-lg border border-slate-200 p-1.5 text-center text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#0d1528]"
                          value={item.value}
                          onChange={(e) => handleValueChange(i, e.target.value)}
                        />
                      </td>
                      <td className="p-3 text-center">
                        {item.result === "PASS" ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-600 uppercase">
                            Pass
                          </span>
                        ) : item.result === "FAIL" ? (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600 uppercase">
                            Fail
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔻 FOOTER SUMMARY */}
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-6 dark:border-[#1b2740]">
              <div className="flex gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    Pass %
                  </p>
                  <p className="text-xl font-bold text-[#44a83e]">
                    {percentage}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    Items (P/F)
                  </p>
                  <p className="text-xl font-bold text-slate-700 dark:text-slate-200">
                    {passed} / {failed}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                >
                  <option value="">Final Status</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3c9437] active:scale-95 shadow-lg shadow-green-500/20"
                >
                  <Plus size={18} />
                  Save QC Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 RESULT TABLE */}
      <CreateTable
        title="QC Inspection History"
        data={qcList}
        columns={columns}
      />
    </div>
  );
}
