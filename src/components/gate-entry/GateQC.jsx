import { useRef, useState } from "react";
import {
  Plus,
  Calendar,
  ClipboardList,
  Package,
  Hash,
  CheckCircle2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from "lucide-react";
import ExportTable from "../ExportTable";

// =========================
// DUMMY CHECKLISTS
// =========================

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

const ITEMS_PER_PAGE = 10;

export default function GateQC() {
  const dateRef = useRef(null);

  // =========================
  // FORM STATE
  // =========================

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    grn: "",
    product: "",
    checklistId: "",
  });

  const [items, setItems] = useState([]);

  const [qcList, setQcList] = useState([]);

  const [status, setStatus] = useState("");

  const [grnLoading, setGrnLoading] =
    useState(false);

  // =========================
  // TABLE STATES
  // =========================

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({});

  const [currentPage, setCurrentPage] =
    useState(1);

  // =========================
  // CHECKLIST CHANGE
  // =========================

  const handleChecklistChange = (id) => {
    const selected = checklistTemplates.find(
      (c) => c.id == id,
    );

    setForm((prev) => ({
      ...prev,
      checklistId: id,
      product:
        selected?.applicableProduct || "",
    }));

    const mappedItems =
      selected?.items.map((item) => ({
        ...item,
        value: "",
        result: "",
      })) || [];

    setItems(mappedItems);
  };

  // =========================
  // VALUE CHANGE
  // =========================

  const handleValueChange = (
    index,
    value,
  ) => {
    const updated = [...items];

    const item = updated[index];

    item.value = value;

    if (item.valueType === "Numeric") {
      const num = Number(value);

      item.result =
        num >= item.min && num <= item.max
          ? "PASS"
          : "FAIL";
    } else {
      item.result =
        value.toLowerCase() ===
        item.same.toLowerCase()
          ? "PASS"
          : "FAIL";
    }

    setItems(updated);
  };

  // =========================
  // SUMMARY
  // =========================

  const total = items.length;

  const passed = items.filter(
    (i) => i.result === "PASS",
  ).length;

  const failed = total - passed;

  const percentage = total
    ? ((passed / total) * 100).toFixed(2)
    : 0;

  // =========================
  // SAVE QC
  // =========================

  const handleSave = () => {
    if (!form.grn || !status) {
      alert("Please fill GRN and Status");

      return;
    }

    const newEntry = {
      id: Date.now(),

      date: form.date,

      grn: form.grn,

      product: form.product,

      percentage: `${percentage}%`,

      status,
    };

    setQcList((prev) => [
      newEntry,
      ...prev,
    ]);

    setItems([]);

    setStatus("");

    setForm({
      date: new Date()
        .toISOString()
        .split("T")[0],

      grn: "",

      product: "",

      checklistId: "",
    });
  };

  // =========================
  // VALIDATE GRN
  // =========================

  const validateGRN = async () => {
    if (!form.grn) {
      alert("Enter GRN first");

      return;
    }

    try {
      setGrnLoading(true);

      const res = await fetch(
        `/api/grn/${form.grn}`,
      );

      const data = await res.json();

      if (!data.success) {
        alert("Invalid GRN");

        return;
      }

      setForm((prev) => ({
        ...prev,

        product: data.product,
      }));
    } catch (err) {
      console.error(err);

      // MOCK
      setForm((prev) => ({
        ...prev,

        product: "Mobile",
      }));

      alert("Mock: GRN Validated");
    } finally {
      setGrnLoading(false);
    }
  };

  // =========================
  // FILTERS
  // =========================

  const uniqueValues = (key) => [
    ...new Set(qcList.map((d) => d[key])),
  ];

  const filteredData = qcList
    .filter(
      (item) =>
        (!filters.product ||
          item.product ===
            filters.product) &&
        (!filters.status ||
          item.status === filters.status),
    )
    .filter((item) => {
      if (!search) return true;

      return Object.values(item).some((val) =>
        String(val)
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredData.length / ITEMS_PER_PAGE,
  );

  const paginated = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6 p-6 dark:text-white">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Gate QC Entry
        </h2>

        <p className="text-sm text-slate-500">
          Perform quality checks on incoming
          material
        </p>
      </div>

      {/* ========================= */}
      {/* FORM CARD */}
      {/* ========================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        {/* CARD HEADER */}
        <div
          className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                QC Form
              </h2>

              <p className="text-xs text-white/60">
                Enter inspection details
              </p>
            </div>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-4">
          {/* DATE */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Date
            </label>

            <div
              className="relative cursor-pointer"
              onClick={() =>
                dateRef.current?.showPicker()
              }
            >
              <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                ref={dateRef}
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,

                    date: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none dark:border-[#1b2740] dark:bg-[#11182b]"
              />
            </div>
          </div>

          {/* GRN */}
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
                  onChange={(e) =>
                    setForm({
                      ...form,

                      grn: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                />
              </div>

              <button
                onClick={validateGRN}
                className="rounded-xl bg-[#44a83e] px-3 py-1 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-[#3c9437]"
              >
                {grnLoading ? "..." : "Check"}
              </button>
            </div>
          </div>

          {/* PRODUCT */}
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

          {/* CHECKLIST */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Select Checklist
            </label>

            <div className="relative">
              <CheckCircle2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={form.checklistId}
                onChange={(e) =>
                  handleChecklistChange(
                    e.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
              >
                <option value="">
                  Choose Template
                </option>

                {checklistTemplates.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.checklistName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* INSPECTION TABLE */}
        {/* ========================= */}

        {items.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-6 dark:border-[#1b2740]">
            <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">
              Inspection Parameters
            </h3>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#1b2740]">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-[#11182b]">
                  <tr className="text-slate-500">
                    <th className="p-3 font-semibold">
                      S.No
                    </th>

                    <th className="p-3 font-semibold">
                      Parameter
                    </th>

                    <th className="p-3 font-semibold">
                      Ideal Value
                    </th>

                    <th className="p-3 font-semibold">
                      Tool
                    </th>

                    <th className="p-3 text-center font-semibold">
                      Observed Value
                    </th>

                    <th className="p-3 text-center font-semibold">
                      Result
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[#1b2740]">
                  {items.map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/5"
                    >
                      <td className="p-3">
                        {i + 1}
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {item.name}
                        </div>

                        <div className="text-xs text-slate-400">
                          {item.subName}
                        </div>
                      </td>

                      <td className="p-3 text-slate-600">
                        {item.valueType ===
                        "Numeric"
                          ? `${item.min}-${item.max}`
                          : item.same}
                      </td>

                      <td className="p-3 text-xs italic text-slate-500">
                        {item.tool}
                      </td>

                      <td className="p-3 text-center">
                        <input
                          className="w-24 rounded-lg border border-slate-200 p-1.5 text-center text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#0d1528]"
                          value={item.value}
                          onChange={(e) =>
                            handleValueChange(
                              i,
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="p-3 text-center">
                        {item.result ===
                        "PASS" ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold uppercase text-green-600">
                            Pass
                          </span>
                        ) : item.result ===
                          "FAIL" ? (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold uppercase text-red-600">
                            Fail
                          </span>
                        ) : (
                          <span className="text-slate-300">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-6 dark:border-[#1b2740]">
              <div className="flex gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Pass %
                  </p>

                  <p className="text-xl font-bold text-[#44a83e]">
                    {percentage}%
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                >
                  <option value="">
                    Final Status
                  </option>

                  <option value="Selected">
                    Selected
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-[#3c9437]"
                >
                  <Plus size={18} />
                  Save QC Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* HISTORY TABLE */}
      {/* ========================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        {/* HEADER */}
        <div
          className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Boxes className="h-5 w-5 text-white" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  QC Inspection History
                </h2>

                <p className="text-xs text-white/60">
                  {filteredData.length} entries
                </p>
              </div>
            </div>

            {/* SEARCH */}
            
            <div className="ml-auto flex items-center gap-2">
  <ExportTable
    data={filteredData}
    fileName="gate-qc-history"
  />

  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);

      setCurrentPage(1);
    }}
    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
  />
</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {["product", "status"].map((key) => (
            <select
              key={key}
              value={filters[key] || ""}
              onChange={(e) => {
                setFilters({
                  ...filters,

                  [key]: e.target.value,
                });

                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
            >
              <option value="">
                All {key}
              </option>

              {uniqueValues(key).map((val) => (
                <option key={val}>
                  {val}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  "Date",
                  "GRN",
                  "Product",
                  "Result %",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    No QC history found
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      {row.date}
                    </td>

                    <td className="px-6 py-4">
                      {row.grn}
                    </td>

                    <td className="px-6 py-4">
                      {row.product}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {row.percentage}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          row.status ===
                          "Selected"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.max(p - 1, 1),
                )
              }
            >
              <ChevronLeft />
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages),
                )
              }
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}