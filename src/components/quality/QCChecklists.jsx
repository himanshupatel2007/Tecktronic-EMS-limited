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

// How many rows to show per page
const ROWS_PER_PAGE = 10;

// A blank form — used when opening the form fresh (not editing)
const EMPTY_FORM = {
  checklistCode: "",
  checklistName: "",
  applicableProduct: "",
  groupName: "Incoming Material Check",
  items: [], // checklist items start empty
};

export default function QCChecklists() {
  const navigate = useNavigate();

  // ── STATES ─────────────────────────────────────────────────────────────────

  // All saved checklists
  const [checklistList, setChecklistList] = useState([]);

  // What the user is typing in the form right now
  const [formValues, setFormValues] = useState(EMPTY_FORM);

  // Is the form open or closed?
  const [showForm, setShowForm] = useState(false);

  // Text the user types in the search box
  const [searchText, setSearchText] = useState("");

  // Which group name is selected in the filter dropdown
  const [filterGroup, setFilterGroup] = useState("");

  // Which page the user is on (starts at 1)
  const [currentPage, setCurrentPage] = useState(1);

  // ── CHECKLIST ITEMS (the rows inside each checklist) ───────────────────────

  // Add a new blank item row to the form
  function addItem() {
    const newItem = {
      name: "",
      subName: "",
      valueType: "Numeric",
      min: "",
      max: "",
      same: "",
      tool: "",
    };

    setFormValues({
      ...formValues,
      items: [...formValues.items, newItem],
    });
  }

  // Remove an item row by its index
  function removeItem(index) {
    const updatedItems = formValues.items.filter((_, i) => i !== index);

    setFormValues({
      ...formValues,
      items: updatedItems,
    });
  }

  // Update a single field inside one item row
  function handleItemFieldChange(index, fieldName, newValue) {
    // Copy the items array so we don't mutate state directly
    const updatedItems = [...formValues.items];
    updatedItems[index][fieldName] = newValue;

    setFormValues({
      ...formValues,
      items: updatedItems,
    });
  }

  // When the user changes the "Type" dropdown on an item,
  // also reset min/max/same so they start fresh
  function handleItemTypeChange(index, newType) {
    const updatedItems = [...formValues.items];
    updatedItems[index].valueType = newType;

    if (newType === "Character") {
      // Character type doesn't use min/max
      updatedItems[index].min = "-";
      updatedItems[index].max = "-";
    } else {
      // Numeric type uses min/max
      updatedItems[index].min = "";
      updatedItems[index].max = "";
    }

    setFormValues({
      ...formValues,
      items: updatedItems,
    });
  }

  // ── HEADER FORM FIELDS ─────────────────────────────────────────────────────

  // Update any field in the top section of the form
  // (checklistCode, checklistName, applicableProduct, groupName)
  function handleHeaderFieldChange(fieldName, newValue) {
    setFormValues({
      ...formValues,
      [fieldName]: newValue,
    });
  }

  // ── SAVE ───────────────────────────────────────────────────────────────────

  function handleSave() {
    // Basic validation — code and name are required
    if (!formValues.checklistCode || !formValues.checklistName) {
      alert("Checklist Code and Name are required.");
      return;
    }

    if (formValues.id) {
      // If formValues has an id, we are editing an existing checklist
      const updatedList = checklistList.map((checklist) =>
        checklist.id === formValues.id ? formValues : checklist,
      );
      setChecklistList(updatedList);
    } else {
      // No id means this is a brand new checklist — add it to the top
      const newChecklist = {
        ...formValues,
        id: Date.now(), // unique id based on current timestamp
      };
      setChecklistList([newChecklist, ...checklistList]);
    }

    // Reset the form and close it
    setFormValues(EMPTY_FORM);
    setShowForm(false);
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────

  function handleDelete(id) {
    const updatedList = checklistList.filter(
      (checklist) => checklist.id !== id,
    );
    setChecklistList(updatedList);
  }

  // ── EDIT ───────────────────────────────────────────────────────────────────

  // Load the clicked row into the form so the user can edit it
  function handleEdit(row) {
    setFormValues(row);
    setShowForm(true);
  }

  // ── FILTERING & SEARCHING ──────────────────────────────────────────────────

  // Start with the full list
  let visibleChecklists = checklistList;

  // If a group filter is selected, keep only checklists that match
  if (filterGroup !== "") {
    visibleChecklists = visibleChecklists.filter(
      (item) => item.groupName === filterGroup,
    );
  }

  // If the user typed something, keep only checklists where any field matches
  if (searchText !== "") {
    visibleChecklists = visibleChecklists.filter((item) => {
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase()),
      );
    });
  }

  // ── PAGINATION ─────────────────────────────────────────────────────────────

  const totalPages = Math.ceil(visibleChecklists.length / ROWS_PER_PAGE);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const rowsOnThisPage = visibleChecklists.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  // Get all unique values for a field (used to build filter dropdowns)
  function getUniqueValues(fieldName) {
    return [
      ...new Set(checklistList.map((item) => item[fieldName]).filter(Boolean)),
    ];
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Top toolbar buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setFormValues(EMPTY_FORM); // clear the form before opening
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          <Plus className="h-4 w-4" />
          Add Checklist
        </button>

        {/* Only show "Close" when the form is open */}
        {showForm && (
          <button
            onClick={() => setShowForm(false)}
            className="rounded-xl border px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>

      {/* ── ADD / EDIT FORM (only shown when showForm is true) ── */}
      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
          {/* Form header — shows "Edit" or "Add" depending on whether we have an id */}
          <div
            className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
            style={{ backgroundColor: "#3a3c44" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Hash className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {formValues.id ? "Edit QC Checklist" : "Add QC Checklist"}
                </h2>
                <p className="text-xs text-white/60">
                  Create checklist details
                </p>
              </div>
            </div>
          </div>

          {/* Top 4 fields */}
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            {/* Checklist Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Checklist Code
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={formValues.checklistCode}
                  onChange={(e) =>
                    handleHeaderFieldChange("checklistCode", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                />
              </div>
            </div>

            {/* Checklist Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Checklist Name
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={formValues.checklistName}
                  onChange={(e) =>
                    handleHeaderFieldChange("checklistName", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                />
              </div>
            </div>

            {/* Applicable Product */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Applicable Product
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={formValues.applicableProduct}
                  onChange={(e) =>
                    handleHeaderFieldChange("applicableProduct", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                />
              </div>
            </div>

            {/* Group Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Group Name
              </label>
              <div className="relative">
                <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={formValues.groupName}
                  onChange={(e) =>
                    handleHeaderFieldChange("groupName", e.target.value)
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

          {/* ── CHECKLIST ITEMS SECTION ── */}
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

            {/* If no items added yet, show a placeholder */}
            {formValues.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400 dark:border-[#1b2740]">
                No items added yet
              </div>
            ) : (
              <div className="space-y-6">
                {/* Loop through each item and render its fields */}
                {formValues.items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 p-5 dark:border-[#1b2740]"
                  >
                    {/* Item header with remove button */}
                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Item {index + 1}
                      </p>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Item fields grid */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* Name */}
                      <FormInput
                        label="Name"
                        icon={Hash}
                        value={item.name}
                        onChange={(val) =>
                          handleItemFieldChange(index, "name", val)
                        }
                      />

                      {/* Sub Name */}
                      <FormInput
                        label="Sub Name"
                        icon={Hash}
                        value={item.subName}
                        onChange={(val) =>
                          handleItemFieldChange(index, "subName", val)
                        }
                      />

                      {/* Type dropdown — also resets min/max when changed */}
                      <FormSelect
                        label="Type"
                        icon={Package}
                        value={item.valueType}
                        options={["Numeric", "Character"]}
                        onChange={(val) => handleItemTypeChange(index, val)}
                      />

                      {/* Min and Max only show for Numeric type */}
                      {item.valueType !== "Character" && (
                        <FormInput
                          label="Min Value"
                          icon={Hash}
                          value={item.min}
                          onChange={(val) =>
                            handleItemFieldChange(index, "min", val)
                          }
                        />
                      )}

                      {item.valueType !== "Character" && (
                        <FormInput
                          label="Max Value"
                          icon={Hash}
                          value={item.max}
                          onChange={(val) =>
                            handleItemFieldChange(index, "max", val)
                          }
                        />
                      )}

                      {/* Ideal Value only shows for Character type */}
                      {item.valueType !== "Numeric" && (
                        <FormInput
                          label="Ideal Value"
                          icon={Hash}
                          value={item.same}
                          onChange={(val) =>
                            handleItemFieldChange(index, "same", val)
                          }
                        />
                      )}

                      {/* Tool */}
                      <FormInput
                        label="Tool"
                        icon={Package}
                        value={item.tool}
                        onChange={(val) =>
                          handleItemFieldChange(index, "tool", val)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Save / Update button */}
            <button
              onClick={handleSave}
              className="mt-6 rounded-xl bg-[#44a83e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
            >
              {formValues.id ? "Update Checklist" : "Save Checklist"}
            </button>
          </div>
        </div>
      )}

      {/* ── CHECKLISTS TABLE ── */}
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
                  QC Checklists
                </h2>
                <p className="text-xs text-white/60">
                  {visibleChecklists.length} items
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
                title="QC Checklists"
                columns={[
                  { label: "Checklist Code", key: "checklistCode" },
                  { label: "Checklist Name", key: "checklistName" },
                  { label: "Applicable Product", key: "applicableProduct" },
                  { label: "Group Name", key: "groupName" },
                ]}
                data={visibleChecklists}
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
            {/* Only show groups that actually exist in the list */}
            {getUniqueValues("groupName").map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
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
              {/* If no rows match, show empty state */}
              {rowsOnThisPage.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    No checklists found
                  </td>
                </tr>
              ) : (
                // Otherwise render one row per checklist
                rowsOnThisPage.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                  >
                    <td className="px-6 py-4">{row.checklistCode}</td>
                    <td className="px-6 py-4">{row.checklistName}</td>
                    <td className="px-6 py-4">{row.applicableProduct}</td>
                    <td className="px-6 py-4">{row.groupName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* View the checklist receipt page */}
                        <button
                          onClick={() =>
                            navigate("/quality/checklist-receipt", {
                              state: { checklist: row },
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        {/* Load this row into the form for editing */}
                        <button
                          onClick={() => handleEdit(row)}
                          className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        {/* Remove this checklist */}
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

// ── REUSABLE INPUT COMPONENT ───────────────────────────────────────────────────
// Used inside the checklist items section to avoid repeating the same input markup

function FormInput({ label, icon: Icon, value, onChange }) {
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

// ── REUSABLE SELECT COMPONENT ──────────────────────────────────────────────────
// Same idea as FormInput but renders a dropdown instead

function FormSelect({ label, icon: Icon, value, onChange, options = [] }) {
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
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
