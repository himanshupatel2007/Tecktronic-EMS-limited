import { useRef, useState } from "react";
import {
  Plus, Calendar, ClipboardList, Package,
  Hash, CheckCircle2, Filter,
  ChevronLeft, ChevronRight, Boxes,
} from "lucide-react";
import ExportTable from "../ExportTable";


// -------------------------------------------------------
// STEP 1 - Our checklist data (like a mini database)
// -------------------------------------------------------

const checklistTemplates = [
  {
    id: 1,
    checklistName: "Mobile QC",
    applicableProduct: "Mobile",
    items: [
      {
        name: "Display",
        subName: "Brightness",
        valueType: "Numeric",  // check if value is between min and max
        min: 10,
        max: 100,
        tool: "Lux Meter",
      },
      {
        name: "Display",
        subName: "Dead Pixel",
        valueType: "Character", // check if value matches the word exactly
        same: "No",
        tool: "Visual",
      },
    ],
  },
];

// How many rows to show at a time in the history table
const ITEMS_PER_PAGE = 10;


// -------------------------------------------------------
// STEP 2 - Helper functions (small reusable logic)
// -------------------------------------------------------

// This function checks if a single item PASSES or FAILS
// based on what the user typed in the "Observed Value" column
function getResult(item, value) {
  // If nothing is typed yet, return empty
  if (value === "") return "";

  if (item.valueType === "Numeric") {
    // Convert the typed value to a number
    const numberValue = Number(value);

    // Check if it is inside the allowed range
    if (numberValue >= item.min && numberValue <= item.max) {
      return "PASS";
    } else {
      return "FAIL";
    }
  } else {
    // For character type, check if the word matches exactly
    if (value.toLowerCase() === item.same.toLowerCase()) {
      return "PASS";
    } else {
      return "FAIL";
    }
  }
}

// This function counts how many items passed and failed
function getSummary(items) {
  const total = items.length;
  const passed = items.filter((item) => item.result === "PASS").length;
  const failed = total - passed;
  const percentage = total === 0 ? 0 : ((passed / total) * 100).toFixed(2);
  return { total, passed, failed, percentage };
}


// -------------------------------------------------------
// STEP 3 - Main Component
// -------------------------------------------------------

export default function GateQC() {

  // This ref is used to open the date picker when clicking the field
  const dateRef = useRef(null);

  // --- Form fields (date, GRN number, product name, which checklist) ---
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0], // today's date
    grn: "",
    product: "",
    checklistId: "",
  });

  // The list of inspection items currently shown (loaded from a checklist)
  const [items, setItems] = useState([]);

  // The final status the user picks: "Selected" or "Rejected"
  const [status, setStatus] = useState("");

  // Shows "..." on the Check button while GRN is being validated
  const [grnLoading, setGrnLoading] = useState(false);

  // All the saved QC reports (history table data)
  const [qcList, setQcList] = useState([]);

  // Search text typed in the history table
  const [search, setSearch] = useState("");

  // Dropdown filter values for the history table
  const [filters, setFilters] = useState({ product: "", status: "" });

  // Which page we are on in the history table
  const [currentPage, setCurrentPage] = useState(1);


  // -------------------------------------------------------
  // When user picks a checklist from the dropdown
  // -------------------------------------------------------
  function handleChecklistChange(selectedId) {
    // Find the matching checklist from our data
    const found = checklistTemplates.find((c) => c.id == selectedId);

    // Update the form with the checklist id and its product name
    setForm({
      ...form,
      checklistId: selectedId,
      product: found ? found.applicableProduct : "",
    });

    // Load the checklist items and add empty value and result fields
    if (found) {
      const freshItems = found.items.map((item) => ({
        ...item,
        value: "",   // user hasn't typed anything yet
        result: "",  // no result yet
      }));
      setItems(freshItems);
    }
  }


  // -------------------------------------------------------
  // When user types a value in the "Observed Value" input
  // -------------------------------------------------------
  function handleValueChange(index, typedValue) {
    // Copy the items array so we don't modify state directly
    const updatedItems = [...items];

    // Update the value the user typed
    updatedItems[index].value = typedValue;

    // Calculate PASS or FAIL for that item
    updatedItems[index].result = getResult(updatedItems[index], typedValue);

    // Save the updated items back to state
    setItems(updatedItems);
  }


  // -------------------------------------------------------
  // When user clicks the "Check" button to validate GRN
  // -------------------------------------------------------
  async function handleValidateGRN() {
    if (!form.grn) {
      alert("Please enter a GRN number first");
      return;
    }

    try {
      setGrnLoading(true);

      const response = await fetch(`/api/grn/${form.grn}`);
      const data = await response.json();

      if (!data.success) {
        alert("Invalid GRN");
        return;
      }

      // Auto-fill the product name from the API response
      setForm((prev) => ({ ...prev, product: data.product }));

    } catch (error) {
      console.error(error);

      // If API fails, use mock data for testing
      setForm((prev) => ({ ...prev, product: "Mobile" }));
      alert("Mock: GRN Validated");

    } finally {
      setGrnLoading(false);
    }
  }


  // -------------------------------------------------------
  // When user clicks "Save QC Report"
  // -------------------------------------------------------
  function handleSave() {
    // Don't save if GRN or status is missing
    if (!form.grn || !status) {
      alert("Please fill GRN and Status before saving");
      return;
    }

    // Get the pass percentage from our helper
    const { percentage } = getSummary(items);

    // Build the new history row
    const newRow = {
      id: Date.now(), // unique id using current timestamp
      date: form.date,
      grn: form.grn,
      product: form.product,
      percentage: `${percentage}%`,
      status: status,
    };

    // Add the new row to the top of the history list
    setQcList([newRow, ...qcList]);

    // Reset the form back to empty
    setItems([]);
    setStatus("");
    setForm({
      date: new Date().toISOString().split("T")[0],
      grn: "",
      product: "",
      checklistId: "",
    });
  }


  // -------------------------------------------------------
  // Filter the history table based on search and dropdowns
  // -------------------------------------------------------
  const filteredList = qcList.filter((row) => {
    // Check if product filter matches
    const productMatches = filters.product === "" || row.product === filters.product;

    // Check if status filter matches
    const statusMatches = filters.status === "" || row.status === filters.status;

    // Check if search text matches anything in the row
    const searchMatches =
      search === "" ||
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );

    return productMatches && statusMatches && searchMatches;
  });

  // Split filtered list into pages
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const currentPageRows = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get unique values for the filter dropdowns
  function getUniqueValues(key) {
    return [...new Set(qcList.map((row) => row[key]))];
  }

  // Get pass/fail summary for the footer
  const { passed, failed, percentage } = getSummary(items);


  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="space-y-6 p-6 dark:text-white">

      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Gate QC Entry
        </h2>
        <p className="text-sm text-slate-500">
          Perform quality checks on incoming material
        </p>
      </div>

      {/* ========================= */}
      {/* FORM CARD                 */}
      {/* ========================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

        {/* Card Header */}
        <div
          className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">QC Form</h2>
            <p className="text-xs text-white/60">Enter inspection details</p>
          </div>
        </div>

        {/* Form Fields Row */}
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-4">

          {/* Date Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">Date</label>
            <div className="relative cursor-pointer" onClick={() => dateRef.current?.showPicker()}>
              <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={dateRef}
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none dark:border-[#1b2740] dark:bg-[#11182b]"
              />
            </div>
          </div>

          {/* GRN Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">GRN Number</label>
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
              {/* Check button - validates the GRN via API */}
              <button
                onClick={handleValidateGRN}
                className="rounded-xl bg-[#44a83e] px-3 py-1 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-[#3c9437]"
              >
                {grnLoading ? "..." : "Check"}
              </button>
            </div>
          </div>

          {/* Product Field (read-only, filled by GRN check or checklist) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">Product</label>
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

          {/* Checklist Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-500">Select Checklist</label>
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

        {/* ========================= */}
        {/* INSPECTION TABLE          */}
        {/* Only shows if items exist */}
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
                    <th className="p-3 font-semibold">S.No</th>
                    <th className="p-3 font-semibold">Parameter</th>
                    <th className="p-3 font-semibold">Ideal Value</th>
                    <th className="p-3 font-semibold">Tool</th>
                    <th className="p-3 text-center font-semibold">Observed Value</th>
                    <th className="p-3 text-center font-semibold">Result</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[#1b2740]">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-white/5">

                      {/* Row number */}
                      <td className="p-3">{index + 1}</td>

                      {/* Parameter name and sub-name */}
                      <td className="p-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.subName}</div>
                      </td>

                      {/* Show the allowed range or expected word */}
                      <td className="p-3 text-slate-600">
                        {item.valueType === "Numeric"
                          ? `${item.min} - ${item.max}`
                          : item.same}
                      </td>

                      {/* Tool used for measurement */}
                      <td className="p-3 text-xs italic text-slate-500">{item.tool}</td>

                      {/* Input where inspector types the observed value */}
                      <td className="p-3 text-center">
                        <input
                          className="w-24 rounded-lg border border-slate-200 p-1.5 text-center text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#0d1528]"
                          value={item.value}
                          onChange={(e) => handleValueChange(index, e.target.value)}
                        />
                      </td>

                      {/* Show PASS or FAIL badge based on the value typed */}
                      <td className="p-3 text-center">
                        {item.result === "PASS" && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-600">
                            Pass
                          </span>
                        )}
                        {item.result === "FAIL" && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                            Fail
                          </span>
                        )}
                        {item.result === "" && (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-6 dark:border-[#1b2740]">

              {/* Pass % and Pass/Fail count */}
              <div className="flex gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pass %</p>
                  <p className="text-xl font-bold text-[#44a83e]">{percentage}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Items (P/F)</p>
                  <p className="text-xl font-bold text-slate-700 dark:text-slate-200">
                    {passed} / {failed}
                  </p>
                </div>
              </div>

              {/* Final Status dropdown and Save button */}
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
      {/* HISTORY TABLE             */}
      {/* ========================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

        {/* History Card Header */}
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
                <h2 className="text-lg font-semibold text-white">QC Inspection History</h2>
                <p className="text-xs text-white/60">{filteredList.length} entries</p>
              </div>
            </div>

            {/* Export and Search */}
            <div className="ml-auto flex items-center gap-2">
              <ExportTable data={filteredList} fileName="gate-qc-history" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // go back to page 1 when searching
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {/* Product filter */}
          <select
            value={filters.product}
            onChange={(e) => {
              setFilters({ ...filters, product: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All product</option>
            {getUniqueValues("product").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All status</option>
            {getUniqueValues("status").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">GRN</th>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Result %</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Show message if no rows */}
              {currentPageRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-slate-400">
                    No QC history found
                  </td>
                </tr>
              ) : (
                // Show each row
                currentPageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{row.date}</td>
                    <td className="px-6 py-4">{row.grn}</td>
                    <td className="px-6 py-4">{row.product}</td>
                    <td className="px-6 py-4 font-semibold">{row.percentage}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          row.status === "Selected"
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

        {/* Pagination - only shows if there is more than 1 page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">

            {/* Go to previous page */}
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
              <ChevronLeft />
            </button>

            {/* Current page out of total */}
            <span>{currentPage} / {totalPages}</span>

            {/* Go to next page */}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
              <ChevronRight />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}