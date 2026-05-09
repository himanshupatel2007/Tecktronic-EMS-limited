import { useState } from "react";
import {
  Eye,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExportTable from "../ExportTable";

const ITEMS_PER_PAGE = 10;

export default function QCChecklistHistory() {
  const navigate = useNavigate();

  // SAMPLE DATA
  const [history, setHistory] = useState([]);

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // DELETE
  const handleDelete = (id) => {
    setHistory((prev) =>
      prev.filter((item) => item.id !== id),
    );
  };

  // FILTERED DATA
  const filteredHistory = history
    .filter((item) => {
      return (
        (!filters.groupName ||
          item.groupName ===
            filters.groupName) &&
        (!filters.status ||
          item.status === filters.status)
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
    filteredHistory.length / ITEMS_PER_PAGE,
  );

  const paginated = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const uniqueValues = (key) => [
    ...new Set(
      history.map((d) => d[key]).filter(Boolean),
    ),
  ];

  return (
    <div className="space-y-8">
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
          QC Checklist History
        </h2>

        <p className="text-xs text-white/60">
          {filteredHistory.length} items
        </p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex flex-wrap items-center gap-2 ml-auto">

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
        title="QC Checklist History"
        columns={[
          {
            label: "Checklist Code",
            key: "checklistCode",
          },
          {
            label: "Checklist Name",
            key: "checklistName",
          },
          {
            label: "Product",
            key: "applicableProduct",
          },
          {
            label: "Group",
            key: "groupName",
          },
          {
            label: "Status",
            key: "status",
          },
          {
            label: "Date",
            key: "date",
          },
        ]}
        data={filteredHistory}
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

          {/* GROUP FILTER */}
          <select
            value={filters.groupName || ""}
            onChange={(e) => {
              setFilters({
                ...filters,
                groupName: e.target.value,
              });

              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
          >
            <option value="">
              All Groups
            </option>

            {uniqueValues("groupName").map(
              (val) => (
                <option key={val}>
                  {val}
                </option>
              ),
            )}
          </select>

          {/* STATUS FILTER */}
          <select
            value={filters.status || ""}
            onChange={(e) => {
              setFilters({
                ...filters,
                status: e.target.value,
              });

              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
          >
            <option value="">
              All Status
            </option>

            {uniqueValues("status").map(
              (val) => (
                <option key={val}>
                  {val}
                </option>
              ),
            )}
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#162033]">
                {[
                  "Checklist Code",
                  "Checklist Name",
                  "Product",
                  "Group",
                  "Status",
                  "Date",
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
                    colSpan={7}
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
                      {row.checklistCode}
                    </td>

                    <td className="px-6 py-4">
                      {row.checklistName}
                    </td>

                    <td className="px-6 py-4">
                      {row.applicableProduct}
                    </td>

                    <td className="px-6 py-4">
                      {row.groupName}
                    </td>

                    <td className="px-6 py-4">
                      {row.status}
                    </td>

                    <td className="px-6 py-4">
                      {row.date}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">

                        {/* VIEW */}
                        <button
                          onClick={() =>
                            navigate(
                              "/quality/checklist-report",
                              {
                                state: {
                                  checklist: row,
                                },
                              },
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(row.id)
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
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
  );
}