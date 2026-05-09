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

const ITEMS_PER_PAGE = 10;

export default function BankBook() {
  const [activeForm, setActiveForm] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [banks] = useState([
    "SBI",
    "HDFC",
    "UNION",
    "ICICI",
    "PUNJAB",
  ]);

  const [formData, setFormData] = useState({
    date: "",
    particular: "",
    amount: "",
    bank: "SBI",
    type: "entry",
  });

  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [searchParams] = useSearchParams();
  const selectedBank = searchParams.get("bank");

  const handleAdd = (data) => {
    setTransactions((prev) => [
      { ...data, id: Date.now() },
      ...prev,
    ]);

    setActiveForm(false);

    setFormData({
      date: "",
      particular: "",
      amount: "",
      bank: banks[0],
      type: "entry",
    });
  };

  const handleDelete = (id) => {
    setTransactions((prev) =>
      prev.filter((t) => t.id !== id),
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd(formData);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text
        .split("\n")
        .map((r) => r.split(","));

      const headers = rows[0];

      const imported = rows.slice(1).map((row) => {
        const obj = {};

        headers.forEach((h, i) => {
          obj[h.trim()] = row[i]?.trim();
        });

        return {
          ...obj,
          id: Date.now() + Math.random(),
        };
      });

      setTransactions((prev) => [
        ...imported,
        ...prev,
      ]);
    };

    reader.readAsText(file);
  };

  const filteredTransactions = (
    selectedBank
      ? transactions.filter(
          (t) => t.bank === selectedBank,
        )
      : transactions
  )
    .filter((item) => {
      return (
        (!filters.bank ||
          item.bank === filters.bank) &&
        (!filters.type ||
          item.type === filters.type)
      );
    })
    .filter((item) => {
      if (!search) return true;

      return Object.values(item).some((val) =>
        String(val)
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    });

  const totalPages = Math.ceil(
    filteredTransactions.length / ITEMS_PER_PAGE,
  );

  const paginated = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const uniqueValues = (key) => [
    ...new Set(
      transactions
        .map((d) => d[key])
        .filter(Boolean),
    ),
  ];

  return (
    <>
      {/* TOP BUTTON */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => setActiveForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Bank Transaction
        </button>
      </div>

      <div className="space-y-8">
        {/* FORM */}
        {activeForm && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
            {/* HEADER */}
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

                  <p className="text-xs text-white/60">
                    Add bank entry
                  </p>
                </div>
              </div>

              {/* IMPORT */}
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

            {/* FORM BODY */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {/* DATE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Date
                  </label>

                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* PARTICULAR */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Particular
                  </label>

                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="particular"
                      value={formData.particular}
                      onChange={handleChange}
                      placeholder="Details"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* AMOUNT */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Amount
                  </label>

                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* BANK */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Bank
                  </label>

                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <select
                      name="bank"
                      value={formData.bank}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      {banks.map((bank) => (
                        <option key={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* TYPE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Type
                  </label>

                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      <option value="entry">
                        entry
                      </option>

                      <option value="drawing">
                        drawing
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
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

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
         {/* HEADER */}
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
          {filteredTransactions.length} items
        </p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="ml-auto flex flex-wrap items-center gap-2">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
      />

      {/* EXPORT */}
      <ExportTable
        title="Bank Book"
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
            label: "Bank",
            key: "bank",
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

            {["bank", "type"].map((key) => (
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
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
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
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {[
                    "Date",
                    "Particular",
                    "Amount",
                    "Bank",
                    "Type",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginated.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                    >
                      <td className="px-6 py-4">
                        {row.date}
                      </td>

                      <td className="px-6 py-4">
                        {row.particular}
                      </td>

                      <td className="px-6 py-4">
                        {row.amount}
                      </td>

                      <td className="px-6 py-4">
                        {row.bank}
                      </td>

                      <td className="px-6 py-4">
                        {row.type}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleDelete(row.id)
                          }
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

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
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
    </>
  );
}