import { Eye, Pencil, Trash2, Boxes, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function GroupPreview({ groups, onDelete }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    industry: "",
    sector: "",
    status: "",
  });

  // Derive unique filter options from data
  const uniqueValues = (key) => [...new Set(groups.map((g) => g[key]).filter(Boolean))];

  // Apply filters
  const filteredGroups = groups.filter((group) => {
    return (
      (filters.type === "" || group.type === filters.type) &&
      (filters.industry === "" || group.industry === filters.industry) &&
      (filters.sector === "" || group.sector === filters.sector) &&
      (filters.status === "" || group.status === filters.status)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ type: "", industry: "", sector: "", status: "" });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

        {/* Header */}
        <div
          className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Product Group List</h2>
              <p className="text-xs text-white/60">
                {filteredGroups.length} Group{filteredGroups.length !== 1 ? "s" : ""} Available
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {[
            { key: "type", label: "Type" },
            { key: "industry", label: "Industry" },
            { key: "sector", label: "Sector" },
            { key: "status", label: "Status" },
          ].map(({ key, label }) => (
            <select
              key={key}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-blue-400 dark:border-[#1b2740] dark:bg-[#0d1528] dark:text-slate-300"
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
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#162033]">
                {["Group Name", "Type", "Industry", "Sector", "Status", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
              {paginatedGroups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                    No groups match the selected filters
                  </td>
                </tr>
              ) : (
                paginatedGroups.map((group) => (
                  <tr
                    key={group.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-[#11182b]"
                  >
                    {/* Group Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-[#44a83e] dark:bg-green-900/20 dark:text-green-400">
                          <Boxes className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {group.groupName}
                          </p>
                          <p className="text-xs text-slate-400">{group.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{group.type}</td>

                    {/* Industry */}
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{group.industry}</td>

                    {/* Sector */}
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{group.sector}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                          group.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            group.status === "active" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {group.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedGroup(group)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/20">
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          onClick={() => onDelete(group.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredGroups.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {filteredGroups.length}
              </span>{" "}
              groups
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
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
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}