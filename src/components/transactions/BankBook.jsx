import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExportTable from "../ExportTable";
import {
  Plus,
  Calendar,
  FileText,
  IndianRupee,
  Building2,
  Trash2,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from "lucide-react";

// How many rows to show per page
const ROWS_PER_PAGE = 10;

export default function BankBook() {
  // Is the "Add Transaction" form open or closed?
  const [showForm, setShowForm] = useState(false);

  // All saved transactions
  const [transactionList, setTransactionList] = useState([]);

  // List of available banks
  const [bankOptions] = useState(["SBI", "HDFC", "UNION", "ICICI", "PUNJAB"]);

  // What the user is typing in the form right now
  const [formValues, setFormValues] = useState({
    date: "",
    particular: "",
    amount: "",
    bank: "SBI",
    type: "entry",
  });


  // Which bank is selected in the filter dropdown
  const [filterBank, setFilterBank] = useState("");

  // Which type is selected in the filter dropdown
  const [filterType, setFilterType] = useState("");

  // Text the user types in the search box
  const [searchText, setSearchText] = useState("");

  // Which page the user is on (starts at 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Read the "?bank=SBI" value from the URL (if any)
  // This lets other pages link directly to a specific bank's transactions
  const [searchParams] = useSearchParams();
  const bankFromUrl = searchParams.get("bank");

  // ── FORM HANDLERS ──────────────────────────────────────────────────────────

  // When the user types in any input, update the matching field in formValues
  function handleFormChange(e) {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  }

  // When the user clicks "Create", add the new transaction to the list
  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading

    const newTransaction = {
      ...formValues,
      id: Date.now(), // unique id based on current timestamp
    };

    // Add the new transaction to the top of the list
    setTransactionList([newTransaction, ...transactionList]);

    // Close the form
    setShowForm(false);

    // Clear the form fields for next time
    setFormValues({
      date: "",
      particular: "",
      amount: "",
      bank: bankOptions[0],
      type: "entry",
    });
  }

  // When the user clicks "Delete", remove that transaction from the list
  function handleDelete(id) {
    const updatedList = transactionList.filter((t) => t.id !== id);
    setTransactionList(updatedList);
  }

  // ── CSV IMPORT ─────────────────────────────────────────────────────────────

  // When the user uploads a CSV file, read it and add all rows to the list
  function handleImport(e) {
    const file = e.target.files[0];

    if (!file) return; // do nothing if no file was picked

    const reader = new FileReader();

    // This runs after the file is read
    reader.onload = (event) => {
      const csvText = event.target.result;

      // Split the CSV into rows, then split each row by comma
      const allRows = csvText.split("\n").map((row) => row.split(","));

      // The first row is the headers (column names)
      const headers = allRows[0];

      // Every row after the first is a data row
      const dataRows = allRows.slice(1);

      // Turn each data row into an object using the headers as keys
      const importedTransactions = dataRows.map((row) => {
        const transaction = {};

        headers.forEach((header, index) => {
          transaction[header.trim()] = row[index]?.trim();
        });

        // Give each imported row a unique id
        transaction.id = Date.now() + Math.random();

        return transaction;
      });

      // Add all imported rows to the top of the list
      setTransactionList([...importedTransactions, ...transactionList]);
    };

    reader.readAsText(file);
  }

  // ── FILTERING & SEARCHING ──────────────────────────────────────────────────

  // Start with the full list
  let visibleTransactions = transactionList;

  // If the URL has ?bank=SBI, only show transactions for that bank
  if (bankFromUrl) {
    visibleTransactions = visibleTransactions.filter(
      (t) => t.bank === bankFromUrl,
    );
  }

  // If a bank filter is selected in the dropdown, apply it
  if (filterBank !== "") {
    visibleTransactions = visibleTransactions.filter(
      (t) => t.bank === filterBank,
    );
  }
 

  // If a type filter is selected in the dropdown, apply it
  if (filterType !== "") {
    visibleTransactions = visibleTransactions.filter(
      (t) => t.type === filterType,
    );
  }

  // If the user typed something in search, keep only rows where any field matches
  if (searchText !== "") {
    visibleTransactions = visibleTransactions.filter((t) => {
      return Object.values(t).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase()),
      );
    });
  }

  // ── PAGINATION ─────────────────────────────────────────────────────────────

  const totalPages = Math.ceil(visibleTransactions.length / ROWS_PER_PAGE);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const rowsOnThisPage = visibleTransactions.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  // Get all unique values for a field (used to build filter dropdowns)
  function getUniqueValues(fieldName) {
    return [
      ...new Set(transactionList.map((t) => t[fieldName]).filter(Boolean)),
    ];
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Add Transaction button */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Bank Transaction
        </button>
      </div>

      <div className="space-y-8">
        {/* ── ADD TRANSACTION FORM (only shown when showForm is true) ── */}
        {showForm && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
            {/* Form header */}
            <div
              className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
              style={{ backgroundColor: "#3a3c44" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Bank Transaction
                  </h2>
                  <p className="text-xs text-white/60">Add bank entry</p>
                </div>
              </div>

              {/* CSV Import button — clicking it opens a hidden file input */}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white hover:bg-white/10">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      name="date"
                      value={formValues.date}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* Particular (description of the transaction) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Particular
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="particular"
                      value={formValues.particular}
                      onChange={handleFormChange}
                      placeholder="Details"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      name="amount"
                      value={formValues.amount}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* Bank */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Bank
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      name="bank"
                      value={formValues.bank}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      {bankOptions.map((bank) => (
                        <option key={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Type
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      name="type"
                      value={formValues.type}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      <option value="entry">entry</option>
                      <option value="drawing">drawing</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="px-6 pb-6">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3c9437]"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TRANSACTIONS TABLE ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
          {/* Table header */}
          <div
            className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
            style={{ backgroundColor: "#3a3c44" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Boxes className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Bank Book
                  </h2>
                  <p className="text-xs text-white/60">
                    {visibleTransactions.length} items
                  </p>
                </div>
              </div>

              {/* Search box + Export button */}
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1); // reset to page 1 on new search
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
                />

                <ExportTable
                  title="Bank Book"
                  columns={[
                    { label: "Date", key: "date" },
                    { label: "Particular", key: "particular" },
                    { label: "Amount", key: "amount" },
                    { label: "Bank", key: "bank" },
{ label: "Type", key: "type" },
                  ]}
                  data={visibleTransactions}
                />
              </div>
            </div>
          </div>

          {/* Filter bar — two separate dropdowns instead of a loop */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </div>

            {/* Filter by bank */}
            <select
              value={filterBank}
              onChange={(e) => {
                setFilterBank(e.target.value);
                setCurrentPage(1); // reset to page 1 when filter changes
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">All bank</option>
              {getUniqueValues("bank").map((bank) => (
                <option key={bank}>{bank}</option>
              ))}
            </select>

            {/* Filter by type */}
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1); // reset to page 1 when filter changes
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">All type</option>
              {getUniqueValues("type").map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {[
                    "Date",
                    "Particular",
                    "Amount",
                    "Bank",
                    "Type",
                    "Actions",
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

              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {/* If no rows match, show an empty state message */}
                {rowsOnThisPage.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  // Otherwise render one row per transaction
                  rowsOnThisPage.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                    >
                      <td className="px-6 py-4">{row.date}</td>
                      <td className="px-6 py-4">{row.particular}</td>
                      <td className="px-6 py-4">{row.amount}</td>
                      <td className="px-6 py-4">{row.bank}</td>
                      <td className="px-6 py-4">{row.type}</td>
                      <td className="px-6 py-4">
                        {/* Remove this transaction */}
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (only shown when there is more than one page) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                <ChevronLeft />
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
