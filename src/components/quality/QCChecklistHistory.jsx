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

// How many rows to show per page
const ROWS_PER_PAGE = 10;

export default function QCChecklistHistory() {
  const navigate = useNavigate();

  // List of all checklist history records
  const [historyList, setHistoryList] = useState([]);

  // Text the user types in the search box
  const [searchText, setSearchText] = useState("");

  // Which group name the user picked in the filter dropdown
  const [filterGroup, setFilterGroup] = useState("");

  // Which status the user picked in the filter dropdown
  const [filterStatus, setFilterStatus] = useState("");

  // Which page the user is on (starts at 1)
  const [currentPage, setCurrentPage] = useState(1);

  // ── DELETE ─────────────────────────────────────────────────────────────────

  // When the user clicks "Delete", remove that row from the list
  function handleDelete(id) {
    const updatedList = historyList.filter((item) => item.id !== id);
    setHistoryList(updatedList);
  }

  // ── FILTERING & SEARCHING ──────────────────────────────────────────────────

  // Start with the full list
  let visibleHistory = historyList;

  // If a group filter is selected, keep only rows that match it
  if (filterGroup !== "") {
    visibleHistory = visibleHistory.filter(
      (item) => item.groupName === filterGroup,
    );
  }

  // If a status filter is selected, keep only rows that match it
  if (filterStatus !== "") {
    visibleHistory = visibleHistory.filter(
      (item) => item.status === filterStatus,
    );
  }

  // If the user typed something in search, keep only rows where any field matches
  if (searchText !== "") {
    visibleHistory = visibleHistory.filter((item) => {
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase()),
      );
    });
  }

  // ── PAGINATION ─────────────────────────────────────────────────────────────

  // How many pages do we need in total?
  const totalPages = Math.ceil(visibleHistory.length / ROWS_PER_PAGE);

  // Slice out only the rows that belong on the current page
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const rowsOnThisPage = visibleHistory.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  // Get all unique values for a field (used to build filter dropdowns)
  function getUniqueValues(fieldName) {
    return [
      ...new Set(historyList.map((item) => item[fieldName]).filter(Boolean)),
    ];
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
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
                  QC Checklist History
                </h2>
                <p className="text-xs text-white/60">
                  {visibleHistory.length} items
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
                title="QC Checklist History"
                columns={[
                  { label: "Checklist Code", key: "checklistCode" },
                  { label: "Checklist Name", key: "checklistName" },
                  { label: "Product", key: "applicableProduct" },
                  { label: "Group", key: "groupName" },
                  { label: "Status", key: "status" },
                  { label: "Date", key: "date" },
                ]}
                data={visibleHistory}
              />
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {/* Filter by group name */}
          <select
            value={filterGroup}
            onChange={(e) => {
              setFilterGroup(e.target.value);
              setCurrentPage(1); // reset to page 1 when filter changes
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
          >
            <option value="">All Groups</option>
            {/* Only show group names that actually exist in the list */}
            {getUniqueValues("groupName").map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>

          {/* Filter by status */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1); // reset to page 1 when filter changes
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
          >
            <option value="">All Status</option>
            {/* Only show statuses that actually exist in the list */}
            {getUniqueValues("status").map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Table */}
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
                    colSpan={7}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                // Otherwise render one row per history item
                rowsOnThisPage.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                  >
                    <td className="px-6 py-4">{row.checklistCode}</td>
                    <td className="px-6 py-4">{row.checklistName}</td>
                    <td className="px-6 py-4">{row.applicableProduct}</td>
                    <td className="px-6 py-4">{row.groupName}</td>
                    <td className="px-6 py-4">{row.status}</td>
                    <td className="px-6 py-4">{row.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Go to the report page for this checklist */}
                        <button
                          onClick={() =>
                            navigate("/quality/checklist-report", {
                              state: { checklist: row },
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        {/* Remove this row from the list */}
                        <button
                          onClick={() => handleDelete(row.id)}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
