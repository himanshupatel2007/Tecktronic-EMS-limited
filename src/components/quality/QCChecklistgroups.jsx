import { useState } from "react";
import {
  Hash,
  Boxes,
  Package,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExportTable from "../ExportTable";

// How many rows to show per page
const ROWS_PER_PAGE = 10;

export default function QCChecklistGroups() {
  const navigate = useNavigate();

  // Is the "Add Group" form visible?
  const [showForm, setShowForm] = useState(false);

  // List of all QC groups the user has added
  const [groupList, setGroupList] = useState([]);

  // What the user is currently typing in the form
  const [formValues, setFormValues] = useState({
    iqcGroupId: "",
    iqcGroupName: "",
    iqcType: "",
    remarks: "",
  });

  // Text the user types in the search box
  const [searchText, setSearchText] = useState("");

  // Which IQC type the user picked in the filter dropdown
  const [filterType, setFilterType] = useState("");

  // Which page the user is on (starts at 1)
  const [currentPage, setCurrentPage] = useState(1);

  // ── FORM HANDLERS ──────────────────────────────────────────────────────────

  // When the user types in any input, update the matching field in formValues
  function handleFormChange(e) {
    setFormValues({
      ...formValues,                    // keep all other fields the same
      [e.target.name]: e.target.value,  // update only the field that changed
    });
  }

  // When the user clicks "Create", add the new group to the list
  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading

    const newGroup = {
      id: Date.now(), // use current timestamp as a unique id
      ...formValues,  // spread all the form fields in
    };

    // Put the new group at the top of the list
    setGroupList([newGroup, ...groupList]);

    // Hide the form
    setShowForm(false);

    // Clear the form so it's ready for next time
    setFormValues({
      iqcGroupId: "",
      iqcGroupName: "",
      iqcType: "",
      remarks: "",
    });
  }

  // When the user clicks "Delete", remove that group from the list
  function handleDelete(id) {
    const updatedList = groupList.filter((group) => group.id !== id);
    setGroupList(updatedList);
  }

  // ── FILTERING & SEARCHING ──────────────────────────────────────────────────

  // Start with the full list
  let visibleGroups = groupList;

  // If a filter type is selected, keep only groups that match it
  if (filterType !== "") {
    visibleGroups = visibleGroups.filter((group) => group.iqcType === filterType);
  }

  // If the user typed something in search, keep only groups where any field matches
  if (searchText !== "") {
    visibleGroups = visibleGroups.filter((group) => {
      return Object.values(group).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  // ── PAGINATION ─────────────────────────────────────────────────────────────

  // How many pages do we need in total?
  const totalPages = Math.ceil(visibleGroups.length / ROWS_PER_PAGE);

  // Slice out only the rows that belong on the current page
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const rowsOnThisPage = visibleGroups.slice(startIndex, startIndex + ROWS_PER_PAGE);

  // Get all unique values for a field (used to build the filter dropdown)
  function getUniqueValues(fieldName) {
    return [...new Set(groupList.map((group) => group[fieldName]).filter(Boolean))];
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* TOP BUTTONS */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          + Add IQC Group
        </button>

        {/* Only show "Close" button when the form is open */}
        {showForm && (
          <button
            onClick={() => setShowForm(false)}
            className="rounded-xl border px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>

      <div className="space-y-8">

        {/* ── ADD GROUP FORM (only shown when showForm is true) ── */}
        {showForm && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

            {/* Form header */}
            <div
              className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
              style={{ backgroundColor: "#3a3c44" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Add IQC Group</h2>
                  <p className="text-xs text-white/60">Create QC checklist group</p>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

                {/* IQC Group ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    IQC Group ID
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="iqcGroupId"
                      value={formValues.iqcGroupId}
                      onChange={handleFormChange}
                      placeholder="IQC001"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* IQC Group Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    IQC Group Name
                  </label>
                  <div className="relative">
                    <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="iqcGroupName"
                      value={formValues.iqcGroupName}
                      onChange={handleFormChange}
                      placeholder="Incoming Material Check"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* IQC Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    IQC Type
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      name="iqcType"
                      value={formValues.iqcType}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      <option value="">Select Type</option>
                      <option value="Raw Material">Raw Material</option>
                      <option value="In Process">In Process</option>
                      <option value="Finished Goods">Finished Goods</option>
                    </select>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Remarks
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <textarea
                      name="remarks"
                      value={formValues.remarks}
                      onChange={handleFormChange}
                      placeholder="Optional notes..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="px-6 pb-6">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3c9437]"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── GROUP LIST TABLE ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

          {/* Table header */}
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
                  <h2 className="text-lg font-semibold text-white">IQC Group List</h2>
                  <p className="text-xs text-white/60">{visibleGroups.length} items</p>
                </div>
              </div>

              {/* Search box + Export button */}
              <div className="ml-auto flex items-center gap-2">
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
                <ExportTable data={visibleGroups} fileName="iqc-group-list" />
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </div>

            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1); // reset to page 1 when filter changes
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">All Types</option>
              {/* Only show types that actually exist in the list */}
              {getUniqueValues("iqcType").map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {["IQC Group ID", "IQC Group Name", "IQC Type", "Remarks", "Actions"].map((heading) => (
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
                    <td colSpan={5} className="py-10 text-center text-sm text-slate-400">
                      No data found
                    </td>
                  </tr>
                ) : (
                  // Otherwise render one row per group
                  rowsOnThisPage.map((group) => (
                    <tr key={group.id} className="hover:bg-slate-50 dark:hover:bg-[#11182b]">
                      <td className="px-6 py-4">{group.iqcGroupId}</td>
                      <td className="px-6 py-4">{group.iqcGroupName}</td>
                      <td className="px-6 py-4">{group.iqcType}</td>
                      <td className="px-6 py-4">{group.remarks}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">

                          {/* Go to the checklist page for this group */}
                          <button
                            onClick={() =>
                              navigate("/quality/checklists", {
                                state: { groupId: group.iqcGroupId },
                              })
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50"
                          >
                            <Package className="h-3.5 w-3.5" />
                            View Checklists
                          </button>

                          {/* Remove this group from the list */}
                          <button
                            onClick={() => handleDelete(group.id)}
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

              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}