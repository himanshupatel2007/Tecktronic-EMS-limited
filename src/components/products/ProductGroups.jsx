import { useState } from "react";
import {
  Plus,
  Upload,
  Trash2,
  Boxes,
  Hash,
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ExportTable from "../ExportTable";

const ITEMS_PER_PAGE = 10;

export default function ProductGroups() {
  const [activeForm, setActiveForm] = useState(false);

  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    groupCode: "",
    groupName: "",
    groupType: "",
    industry: "",
    sector: "Apparel & Textiles",
    categoryStatus: "active",
  });

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // FORM HANDLERS
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      groupCode: "",
      groupName: "",
      groupType: "",
      industry: "",
      sector: "Apparel & Textiles",
      categoryStatus: "active",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.groupCode || !formData.groupName) {
      alert("Group Code and Name are required");
      return;
    }

    setGroups((prev) => [
      {
        ...formData,
        id: Date.now(),
      },
      ...prev,
    ]);

    resetForm();
    setActiveForm(false);
  };

  // =========================
  // IMPORT CSV
  // =========================

  const handleImport = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text.split("\n").map((r) => r.split(","));

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

      const validItems = imported.filter(
        (item) => item.groupCode && item.groupName,
      );

      setGroups((prev) => [...validItems, ...prev]);
    };

    reader.readAsText(file);
  };

  // =========================
  // DELETE
  // =========================

  const handleDeleteGroup = (id) => {
    setGroups((prev) =>
      prev.filter((group) => group.id !== id),
    );
  };

  // =========================
  // FILTERS + SEARCH
  // =========================

  const uniqueValues = (key) => [
    ...new Set(groups.map((d) => d[key]).filter(Boolean)),
  ];

  const filteredData = groups
    .filter(
      (item) =>
        (!filters.groupType ||
          item.groupType === filters.groupType) &&
        (!filters.industry ||
          item.industry === filters.industry) &&
        (!filters.sector ||
          item.sector === filters.sector) &&
        (!filters.categoryStatus ||
          item.categoryStatus ===
            filters.categoryStatus),
    )
    .filter((item) => {
      if (!search) return true;

      return Object.values(item).some((val) =>
        String(val)
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredData.length / ITEMS_PER_PAGE,
  );

  const paginated = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-8">
      {/* TOP BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          <Plus className="h-4 w-4" />
          Add Group
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

      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}

      {activeForm && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
          {/* HEADER */}
          <div
            className="border-b border-slate-200 px-6 py-5 flex items-center justify-between dark:border-[#162033]"
            style={{ backgroundColor: "#3a3c44" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Plus className="h-5 w-5 text-white" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add Product Group
                </h2>

                <p className="text-xs text-white/60">
                  Add your product group details
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
              {/* GROUP CODE */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Group Code
                </label>

                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="groupCode"
                    value={formData.groupCode}
                    onChange={handleChange}
                    placeholder="GRP001"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* GROUP NAME */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Group Name
                </label>

                <div className="relative">
                  <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleChange}
                    placeholder="Red T-Shirt"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* GROUP TYPE */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Group Type
                </label>

                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="groupType"
                    value={formData.groupType}
                    onChange={handleChange}
                    placeholder="Regular"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* INDUSTRY */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Industry
                </label>

                <div className="relative">
                  <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="Clothing"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* SECTOR */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sector
                </label>

                <div className="relative">
                  <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  >
                    <option>
                      Apparel & Textiles
                    </option>
                    <option>Electronics</option>
                    <option>Automotive</option>
                    <option>FMCG</option>
                    <option>Pharmaceuticals</option>
                    <option>Footwear</option>
                  </select>
                </div>
              </div>

              {/* STATUS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category Status
                </label>

                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    name="categoryStatus"
                    value={formData.categoryStatus}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  >
                    <option value="active">
                      active
                    </option>

                    <option value="inactive">
                      inactive
                    </option>
                  </select>
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

      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

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
                  Product Group List
                </h2>

                <p className="text-xs text-white/60">
                  {filteredData.length} items
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
    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
  />
   <ExportTable
    data={filteredData}
    fileName="product-group-list"
  />
</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {[
            "groupType",
            "industry",
            "sector",
            "categoryStatus",
          ].map((key) => (
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
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
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
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Group Code
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Group Name
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Group Type
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Industry
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Sector
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
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
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      {row.groupCode}
                    </td>

                    <td className="px-6 py-4">
                      {row.groupName}
                    </td>

                    <td className="px-6 py-4">
                      {row.groupType}
                    </td>

                    <td className="px-6 py-4">
                      {row.industry}
                    </td>

                    <td className="px-6 py-4">
                      {row.sector}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {row.categoryStatus}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleDeleteGroup(row.id)
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
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
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