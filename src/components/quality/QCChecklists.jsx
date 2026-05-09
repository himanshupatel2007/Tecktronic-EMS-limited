import { useState } from "react";
import ExportTable from "../ExportTable";
import {
  Trash2,
  Eye,
  Pencil,
  Hash,
  Package,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const EMPTY_FORM = {
  checklistCode: "",
  checklistName: "",
  applicableProduct: "",
  groupName: "Incoming Material Check",
  items: [],
};

export default function QCChecklists() {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [checklists, setChecklists] = useState([]);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [activeForm, setActiveForm] = useState(false);

  // TABLE
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // ITEMS
  // =========================

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,

      items: [
        ...prev.items,

        {
          name: "",

          subName: "",

          valueType: "Numeric",

          min: "",

          max: "",

          same: "",

          tool: "",
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,

      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index, key, value) => {
    const updated = [...formData.items];

    updated[index][key] = value;

    setFormData({
      ...formData,

      items: updated,
    });
  };

  const handleTypeChange = (index, value) => {
    const updated = [...formData.items];

    updated[index].valueType = value;

    if (value === "Character") {
      updated[index].min = "-";
      updated[index].max = "-";
    } else {
      updated[index].min = "";
      updated[index].max = "";
    }

    setFormData({
      ...formData,

      items: updated,
    });
  };

  // =========================
  // HEADER FIELDS
  // =========================

  const handleFieldChange = (patch) => {
    setFormData((prev) => ({
      ...prev,

      ...patch,
    }));
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = () => {
    if (!formData.checklistCode || !formData.checklistName) {
      alert("Checklist Code and Name are required.");

      return;
    }

    setChecklists((prev) => {
      if (formData.id) {
        return prev.map((c) => (c.id === formData.id ? formData : c));
      }

      return [
        {
          ...formData,

          id: Date.now(),
        },

        ...prev,
      ];
    });

    setFormData(EMPTY_FORM);

    setActiveForm(false);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {
    setChecklists((prev) => prev.filter((c) => c.id !== id));
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (row) => {
    setFormData(row);

    setActiveForm(true);
  };

  // =========================
  // FILTERS
  // =========================

  const uniqueValues = (key) => [
    ...new Set(checklists.map((d) => d[key]).filter(Boolean)),
  ];

  const filteredData = checklists
    .filter(
      (item) => !filters.groupName || item.groupName === filters.groupName,
    )
    .filter((item) => {
      if (!search) return true;

      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase()),
      );
    });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginated = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* ========================= */}
      {/* TOOLBAR */}
      {/* ========================= */}

      <div className="flex gap-3">
        <button
          onClick={() => {
            setFormData(EMPTY_FORM);

            setActiveForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          <Plus className="h-4 w-4" />
          Add Checklist
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
            className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
            style={{
              backgroundColor: "#3a3c44",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Hash className="h-5 w-5 text-white" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {formData.id ? "Edit QC Checklist" : "Add QC Checklist"}
                </h2>

                <p className="text-xs text-white/60">
                  Create checklist details
                </p>
              </div>
            </div>
          </div>

          {/* FORM BODY */}
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            {/* CHECKLIST CODE */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Checklist Code
              </label>

              <div className="relative">
                <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={formData.checklistCode}
                  onChange={(e) =>
                    handleFieldChange({
                      checklistCode: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                />
              </div>
            </div>

            {/* CHECKLIST NAME */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Checklist Name
              </label>

              <div className="relative">
                <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={formData.checklistName}
                  onChange={(e) =>
                    handleFieldChange({
                      checklistName: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                />
              </div>
            </div>

            {/* APPLICABLE PRODUCT */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Applicable Product
              </label>

              <div className="relative">
                <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={formData.applicableProduct}
                  onChange={(e) =>
                    handleFieldChange({
                      applicableProduct: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                />
              </div>
            </div>

            {/* GROUP */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Group Name
              </label>

              <div className="relative">
                <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={formData.groupName}
                  onChange={(e) =>
                    handleFieldChange({
                      groupName: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                >
                  <option>Incoming Material Check</option>

                  <option>In Process</option>

                  <option>Finished Goods</option>
                </select>
              </div>
            </div>
          </div>

          {/* ========================= */}
          {/* ITEMS */}
          {/* ========================= */}

          <div className="border-t border-slate-200 p-6 dark:border-[#162033]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Checklist Items
              </h3>

              <button
                onClick={addItem}
                className="rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
              >
                + Add Item
              </button>
            </div>

            {formData.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400 dark:border-[#1b2740]">
                No items added yet
              </div>
            ) : (
              <div className="space-y-6">
                {formData.items.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 p-5 dark:border-[#1b2740]"
                  >
                    {/* ITEM HEADER */}
                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Item {i + 1}
                      </p>

                      <button
                        onClick={() => removeItem(i)}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    {/* ITEM GRID */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* NAME */}
                      <Input
                        label="Name"
                        value={item.name}
                        icon={Hash}
                        onChange={(v) => handleItemChange(i, "name", v)}
                      />

                      {/* SUB NAME */}
                      <Input
                        label="Sub Name"
                        value={item.subName}
                        icon={Hash}
                        onChange={(v) => handleItemChange(i, "subName", v)}
                      />

                      {/* TYPE */}
                      <Select
                        label="Type"
                        value={item.valueType}
                        icon={Package}
                        options={["Numeric", "Character"]}
                        onChange={(v) => handleTypeChange(i, v)}
                      />

                      {/* MIN */}
                      {item.valueType !== "Character" && (
                        <Input
                          label="Min Value"
                          value={item.min}
                          icon={Hash}
                          onChange={(v) => handleItemChange(i, "min", v)}
                        />
                      )}

                      {/* MAX */}
                      {item.valueType !== "Character" && (
                        <Input
                          label="Max Value"
                          value={item.max}
                          icon={Hash}
                          onChange={(v) => handleItemChange(i, "max", v)}
                        />
                      )}

                      {/* IDEAL VALUE */}
                      {item.valueType !== "Numeric" && (
                        <Input
                          label="Ideal Value"
                          value={item.same}
                          icon={Hash}
                          onChange={(v) => handleItemChange(i, "same", v)}
                        />
                      )}

                      {/* TOOL */}
                      <Input
                        label="Tool"
                        value={item.tool}
                        icon={Package}
                        onChange={(v) => handleItemChange(i, "tool", v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SAVE */}
            <button
              onClick={handleSave}
              className="mt-6 rounded-xl bg-[#44a83e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
            >
              {formData.id ? "Update Checklist" : "Save Checklist"}
            </button>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        {/* TABLE HEADER */}
        <div
          className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{
            backgroundColor: "#3a3c44",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Boxes className="h-5 w-5 text-white" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  QC Checklists
                </h2>

                <p className="text-xs text-white/60">
                  {filteredData.length} items
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
                title="QC Checklists"
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
                    label: "Applicable Product",
                    key: "applicableProduct",
                  },
                  {
                    label: "Group Name",
                    key: "groupName",
                  },
                ]}
                data={filteredData}
              />
            </div>
          </div>
        </div>
        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

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
            <option value="">All Groups</option>

            {uniqueValues("groupName").map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#162033]">
                {["Code", "Name", "Product", "Group", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    No checklists found
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                  >
                    <td className="px-6 py-4">{row.checklistCode}</td>

                    <td className="px-6 py-4">{row.checklistName}</td>

                    <td className="px-6 py-4">{row.applicableProduct}</td>

                    <td className="px-6 py-4">{row.groupName}</td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* VIEW */}
                        <button
                          onClick={() =>
                            navigate("/quality/checklist-receipt", {
                              state: {
                                checklist: row,
                              },
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        {/* EDIT */}
                        <button
                          onClick={() => handleEdit(row)}
                          className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        {/* DELETE */}
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

        {/* PAGINATION */}
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

// =========================
// REUSABLE INPUT
// =========================

function Input({ label, icon: Icon, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#44a83e] focus:ring-2 focus:ring-green-100 dark:border-[#1b2740] dark:bg-[#11182b]"
        />
      </div>
    </div>
  );
}

// =========================
// REUSABLE SELECT
// =========================

function Select({ label, icon: Icon, value, onChange, options = [] }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#44a83e] focus:ring-2 focus:ring-green-100 dark:border-[#1b2740] dark:bg-[#11182b]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
