import {
  Trash2,
  Layers,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import ExportTable from "./ExportTable";

const ITEMS_PER_PAGE = 1;

export default function HSNPreview({ hsnGroups, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ name: "", code: "" });

  // Derive unique filter options from data
  const uniqueValues = (key) => [
    ...new Set(hsnGroups.map((g) => g[key]).filter(Boolean)),
  ];

  // Apply filters
  const filteredGroups = hsnGroups.filter((item) => {
    return (
      (filters.name === "" || item.name === filters.name) &&
      (filters.code === "" || item.code === filters.code)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ name: "", code: "" });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#3a3c44] p-4 text-white">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <Layers className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">HSN Group List</h2>
            <p className="text-xs text-slate-400">
              {filteredGroups.length} Group
              {filteredGroups.length !== 1 ? "s" : ""} Available
            </p>
          </div>
        </div>

        {/* ✅ RIGHT SIDE (ADD THIS) */}
        <ExportTable
          title="HSN Groups"
          columns={[
            { label: "Group Name", key: "name" },
            { label: "HSN Code", key: "code" },
          ]}
          data={filteredGroups} // important: use filtered data
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </div>

        {[
          { key: "name", label: "Group Name" },
          { key: "code", label: "HSN Code" },
        ].map(({ key, label }) => (
          <select
            key={key}
            value={filters[key]}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-blue-400"
          >
            <option value="">All {label}s</option>
            {uniqueValues(key).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        ))}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Group Name</th>
              <th className="px-6 py-4">HSN Code</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedGroups.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-10 text-center text-slate-400">
                  {hasActiveFilters
                    ? "No groups match the selected filters"
                    : "No HSN Groups added yet"}
                </td>
              </tr>
            ) : (
              paginatedGroups.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                      {item.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(item.id)}
                      className="rounded-md p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredGroups.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {filteredGroups.length}
            </span>{" "}
            groups
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  page === currentPage
                    ? "bg-[#2563eb] text-white"
                    : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
