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

const ITEMS_PER_PAGE = 10;

export default function QCChecklistGroups() {
  const [activeForm, setActiveForm] = useState(false);

  const [qcGroups, setQcGroups] = useState([]);

  const [formData, setFormData] = useState({
    iqcGroupId: "",
    iqcGroupName: "",
    iqcType: "",
    remarks: "",
  });

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // ADD
  const handleAdd = (data) => {
    setQcGroups((prev) => [
      {
        ...data,
        id: Date.now(),
      },
      ...prev,
    ]);

    setActiveForm(false);

    setFormData({
      iqcGroupId: "",
      iqcGroupName: "",
      iqcType: "",
      remarks: "",
    });
  };

  // DELETE
  const handleDelete = (id) => {
    setQcGroups((prev) =>
      prev.filter((item) => item.id !== id),
    );
  };

  // FORM CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd(formData);
  };

  // FILTERED DATA
  const filteredGroups = qcGroups
    .filter((item) => {
      return (
        !filters.iqcType ||
        item.iqcType === filters.iqcType
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
    filteredGroups.length / ITEMS_PER_PAGE,
  );

  const paginated = filteredGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const uniqueValues = (key) => [
    ...new Set(
      qcGroups.map((d) => d[key]).filter(Boolean),
    ),
  ];

  return (
    <>
      {/* TOP BUTTON */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => setActiveForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          + Add IQC Group
        </button>

        {activeForm && (
          <button
            onClick={() => setActiveForm(false)}
            className="rounded-xl border px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>

      <div className="space-y-8">

        {/* FORM */}
        {activeForm && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

            {/* HEADER */}
            <div
              className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
              style={{ backgroundColor: "#3a3c44" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Plus className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Add IQC Group
                  </h2>

                  <p className="text-xs text-white/60">
                    Create QC checklist group
                  </p>
                </div>
              </div>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

                {/* IQC GROUP ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    IQC Group ID
                  </label>

                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="iqcGroupId"
                      value={formData.iqcGroupId}
                      onChange={handleChange}
                      placeholder="IQC001"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* IQC GROUP NAME */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    IQC Group Name
                  </label>

                  <div className="relative">
                    <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="iqcGroupName"
                      value={formData.iqcGroupName}
                      onChange={handleChange}
                      placeholder="Incoming Material Check"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* IQC TYPE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    IQC Type
                  </label>

                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <select
                      name="iqcType"
                      value={formData.iqcType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      <option value="">
                        Select Type
                      </option>

                      <option value="Raw Material">
                        Raw Material
                      </option>

                      <option value="In Process">
                        In Process
                      </option>

                      <option value="Finished Goods">
                        Finished Goods
                      </option>
                    </select>
                  </div>
                </div>

                {/* REMARKS */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Remarks
                  </label>

                  <div className="relative">
                    <Package className="absolute left-4 top-4 h-4 w-4 text-slate-400" />

                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Optional notes..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
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

        {/* TABLE */}
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
                    IQC Group List
                  </h2>

                  <p className="text-xs text-white/60">
                    {filteredGroups.length} items
                  </p>
                </div>
              </div>

              {/* SEARCH */}
              <div className="ml-auto flex items-center gap-2">

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
    <ExportTable
      data={filteredGroups}
      fileName="iqc-group-list"
    />
</div>
            </div>
          </div>

          {/* FILTER */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">

            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </div>

            <select
              value={filters.iqcType || ""}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  iqcType: e.target.value,
                });

                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">
                All Types
              </option>

              {uniqueValues("iqcType").map(
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
                    "IQC Group ID",
                    "IQC Group Name",
                    "IQC Type",
                    "Remarks",
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
                      colSpan={5}
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
                        {row.iqcGroupId}
                      </td>

                      <td className="px-6 py-4">
                        {row.iqcGroupName}
                      </td>

                      <td className="px-6 py-4">
                        {row.iqcType}
                      </td>

                      <td className="px-6 py-4">
                        {row.remarks}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">

                          {/* VIEW CHECKLISTS */}
                          <button
                            onClick={() =>
                              navigate(
                                "/quality/checklists",
                                {
                                  state: {
                                    groupId:
                                      row.iqcGroupId,
                                  },
                                },
                              )
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50"
                          >
                            <Package className="h-3.5 w-3.5" />
                            View Checklists
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
    </>
  );
}