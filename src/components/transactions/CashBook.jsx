import { useState } from "react";
import {
  Plus,
  Calendar,
  FileText,
  IndianRupee,
  Trash2,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from "lucide-react";

import ExportTable from "../ExportTable";

/* =========================================================
   CONSTANTS
========================================================= */
const ITEMS_PER_PAGE = 10;
const date = Date.now()

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function CashBook() {
  /* =========================================================
     STATE
  ========================================================= */

  // Show / hide transaction form
  const [showForm, setShowForm] = useState(false);

  // All transactions
  const [transactions, setTransactions] = useState([]);

  // Search text
  const [searchText, setSearchText] = useState("");

  // Current page number
  const [currentPage, setCurrentPage] = useState(1);

  // Filter values
  const [filters, setFilters] = useState({
    type: "",
  });

  // Form data
  const [formData, setFormData] = useState({
    date: "",
    particular: "",
    amount: "",
    type: "entry",
  });

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     ADD TRANSACTION
  ========================================================= */
  
  const addTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: date,
    };

    setTransactions((prev) => [
      newTransaction,
      ...prev,
    ]);

    // Reset form
    resetForm();

    // Close form
    setShowForm(false);
  };

  /* =========================================================
     RESET FORM
  ========================================================= */
  const resetForm = () => {
    setFormData({
      date: "",
      particular: "",
      amount: "",
      type: "entry",
    });
  };

  /* =========================================================
     FORM SUBMIT
  ========================================================= */
  const handleSubmit = (event) => {
    event.preventDefault();

    addTransaction(formData);
  };

  /* =========================================================
     DELETE TRANSACTION
  ========================================================= */
  const deleteTransaction = (id) => {
    const updatedTransactions =
      transactions.filter(
        (transaction) => transaction.id !== id,
      );

    setTransactions(updatedTransactions);
  };

  /* =========================================================
     IMPORT CSV
  ========================================================= */
  const handleImport = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const csvText = e.target.result;

      // Convert CSV into rows
      const rows = csvText
        .split("\n")
        .map((row) => row.split(","));

      // First row = headers
      const headers = rows[0];

      // Remaining rows = data
      const importedTransactions = rows
        .slice(1)
        .map((row) => {
          const transaction = {};

          headers.forEach((header, index) => {
            transaction[header.trim()] =
              row[index]?.trim();
          });

          return {
            ...transaction,
            id: Date.now() + Math.random(),
          };
        });

      setTransactions((prev) => [
        ...importedTransactions,
        ...prev,
      ]);
    };

    reader.readAsText(file);
  };

  /* =========================================================
     FILTER TRANSACTIONS
  ========================================================= */
  const filteredTransactions = transactions
    .filter((transaction) => {
      // Filter by type
      if (
        filters.type &&
        transaction.type !== filters.type
      ) {
        return false;
      }

      return true;
    })
    .filter((transaction) => {
      // Search filter
      if (!searchText) return true;

      return Object.values(transaction).some(
        (value) =>
          String(value)
            .toLowerCase()
            .includes(searchText.toLowerCase()),
      );
    });

  /* =========================================================
     PAGINATION
  ========================================================= */
  const totalPages = Math.ceil(
    filteredTransactions.length /
      ITEMS_PER_PAGE,
  );

  const paginatedTransactions =
    filteredTransactions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );

  /* =========================================================
     GET UNIQUE VALUES FOR FILTERS
  ========================================================= */
  const getUniqueValues = (key) => {
    return [
      ...new Set(
        transactions
          .map((item) => item[key])
          .filter(Boolean),
      ),
    ];
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <>
      {/* =====================================================
          TOP BUTTON
      ====================================================== */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      <div className="space-y-8">

        {/* =====================================================
            FORM SECTION
        ====================================================== */}
        {showForm && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

            {/* HEADER */}
            <div
              className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
              style={{
                backgroundColor: "#3a3c44",
              }}
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Plus className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Cash Transaction
                  </h2>

                  <p className="text-xs text-white/60">
                    Add cash entry
                  </p>
                </div>
              </div>

              {/* IMPORT BUTTON */}
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

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

                {/* DATE */}
                <InputField
                  label="Date"
                  icon={
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>

                {/* PARTICULAR */}
                <InputField
                  label="Particular"
                  icon={
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="text"
                    name="particular"
                    placeholder="Details"
                    value={formData.particular}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>

                {/* AMOUNT */}
                <InputField
                  label="Amount"
                  icon={
                    <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="number"
                    name="amount"
                    placeholder="1000"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>

                {/* TYPE */}
                <InputField
                  label="Type"
                  icon={
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="entry">
                      entry
                    </option>

                    <option value="drawing">
                      drawing
                    </option>
                  </select>
                </InputField>
              </div>

              {/* SUBMIT BUTTON */}
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

        {/* =====================================================
            TABLE SECTION
        ====================================================== */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

          {/* HEADER */}
          <div
            className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
            style={{
              backgroundColor: "#3a3c44",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">

              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Boxes className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Cash Book
                  </h2>

                  <p className="text-xs text-white/60">
                    {
                      filteredTransactions.length
                    }{" "}
                    items
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="ml-auto flex flex-wrap items-center gap-2">

                {/* SEARCH */}
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(
                      e.target.value,
                    );

                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
                />

                {/* EXPORT */}
                <ExportTable
                  title="Cash Book"
                  columns={[
                    {
                      label: "Date",
                      key: "date",
                    },
                    {
                      label: "Particular",
                      key: "particular",
                    },
                    {
                      label: "Amount",
                      key: "amount",
                    },
                    {
                      label: "Type",
                      key: "type",
                    },
                  ]}
                  data={filteredTransactions}
                />
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">

            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </div>

            <select
              value={filters.type}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  type: e.target.value,
                });

                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">
                All type
              </option>

              {getUniqueValues("type").map(
                (value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* TABLE HEADER */}
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {[
                    "Date",
                    "Particular",
                    "Amount",
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

              {/* TABLE BODY */}
              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">

                {/* NO DATA */}
                {paginatedTransactions.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map(
                    (transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                      >
                        <td className="px-6 py-4">
                          {transaction.date}
                        </td>

                        <td className="px-6 py-4">
                          {
                            transaction.particular
                          }
                        </td>

                        <td className="px-6 py-4">
                          {transaction.amount}
                        </td>

                        <td className="px-6 py-4">
                          {transaction.type}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              deleteTransaction(
                                transaction.id,
                              )
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-[#162033]">

              {/* PREVIOUS */}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1),
                  )
                }
              >
                <ChevronLeft />
              </button>

              {/* PAGE INFO */}
              <span>
                {currentPage} / {totalPages}
              </span>

              {/* NEXT */}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      totalPages,
                    ),
                  )
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

/* =========================================================
   REUSABLE INPUT FIELD COMPONENT
========================================================= */
function InputField({
  label,
  icon,
  children,
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>

      <div className="relative">
        {icon}
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   COMMON INPUT CLASS
========================================================= */
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]";