import { useState } from "react";
import {
  Plus, Package, Hash, Trash2,
  Upload, Filter, ChevronLeft,
  ChevronRight, Boxes,
} from "lucide-react";
import ExportTable from "../ExportTable";


// -------------------------------------------------------
// How many rows to show at a time in the table
// -------------------------------------------------------
const ITEMS_PER_PAGE = 10;


// -------------------------------------------------------
// Main Component
// -------------------------------------------------------
export default function HSNGroups() {

  // Controls whether the Add form is visible or hidden
  const [showForm, setShowForm] = useState(false);

  // Stores what the user is typing in the form
  const [formData, setFormData] = useState({
    name: "",        // Group Name  e.g. "Textiles"
    groupCode: "",   // Group Code  e.g. "GRP001"
    code: "",        // HSN Code    e.g. "123456"
  });

  // Stores all the saved HSN group rows
  const [hsnGroups, setHsnGroups] = useState([]);

  // Stores the text typed in the search box
  const [search, setSearch] = useState("");

  // Stores the selected filter values for name and code dropdowns
  const [filters, setFilters] = useState({ name: "", code: "" });

  // Tracks which page we are on in the table
  const [currentPage, setCurrentPage] = useState(1);


  // -------------------------------------------------------
  // When user types in any form input field
  // -------------------------------------------------------
  function handleInputChange(e) {
    // e.target.name tells us which field changed (name, groupCode, or code)
    // e.target.value is what the user typed
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }


  // -------------------------------------------------------
  // Reset the form back to empty
  // -------------------------------------------------------
  function resetForm() {
    setFormData({ name: "", groupCode: "", code: "" });
  }


  // -------------------------------------------------------
  // When user clicks the "Create" button to save a new group
  // -------------------------------------------------------
  function handleSubmit(e) {
    // Prevent the page from refreshing (default form behaviour)
    e.preventDefault();

    // Group Code is required
    if (!formData.groupCode) {
      alert("Group Code is required");
      return;
    }

    // HSN Code must be exactly 6 digits
    if (!/^\d{6}$/.test(formData.code)) {
      alert("HSN Code must be exactly 6 digits");
      return;
    }

    // Build the new row to add to the table
    const newRow = {
      id: Date.now(), // unique id using current timestamp
      name: formData.name,
      groupCode: formData.groupCode,
      code: formData.code,
    };

    // Add the new row to the top of the list
    setHsnGroups([newRow, ...hsnGroups]);

    // Clear the form and hide it
    resetForm();
    setShowForm(false);
  }


  // -------------------------------------------------------
  // When user imports a CSV file
  // -------------------------------------------------------
  function handleImport(e) {
    const file = e.target.files[0];

    // If no file was selected, do nothing
    if (!file) return;

    const reader = new FileReader();

    // This runs after the file is read
    reader.onload = (event) => {
      const fileText = event.target.result;

      // Split the file into rows, then split each row by comma
      const rows = fileText.split("\n").map((row) => row.split(","));

      // First row is the header (column names)
      const headers = rows[0];

      // All rows after the first row are data rows
      const dataRows = rows.slice(1);

      // Convert each data row into an object using the header names as keys
      const importedItems = dataRows.map((row) => {
        const item = {};
        headers.forEach((header, index) => {
          item[header.trim()] = row[index]?.trim();
        });
        item.id = Date.now() + Math.random(); // give each row a unique id
        return item;
      });

      // Only keep rows that have a groupCode and a valid 6-digit HSN code
      const validItems = importedItems.filter(
        (item) => item.groupCode && /^\d{6}$/.test(item.code)
      );

      // Add valid imported rows to the top of the list
      setHsnGroups([...validItems, ...hsnGroups]);
    };

    reader.readAsText(file);
  }


  // -------------------------------------------------------
  // When user clicks the Delete button on a row
  // -------------------------------------------------------
  function handleDelete(id) {
    // Keep all rows except the one with the matching id
    const updatedList = hsnGroups.filter((item) => item.id !== id);
    setHsnGroups(updatedList);
  }


  // -------------------------------------------------------
  // Filter and search the table rows
  // -------------------------------------------------------

  // Start with all rows
  let filteredList = hsnGroups;

  // Apply name filter if one is selected
  if (filters.name !== "") {
    filteredList = filteredList.filter((item) => item.name === filters.name);
  }

  // Apply code filter if one is selected
  if (filters.code !== "") {
    filteredList = filteredList.filter((item) => item.code === filters.code);
  }

  // Apply search: keep rows where any column contains the search text
  if (search !== "") {
    filteredList = filteredList.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }


  // -------------------------------------------------------
  // Pagination — split filteredList into pages
  // -------------------------------------------------------
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const currentPageRows = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  // -------------------------------------------------------
  // Get unique values for filter dropdowns
  // -------------------------------------------------------
  function getUniqueValues(key) {
    // Remove duplicates and empty values
    return [...new Set(hsnGroups.map((row) => row[key]).filter(Boolean))];
  }


  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="space-y-8">

      {/* Top Buttons — Add and Close */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          <Plus className="h-4 w-4" />
          Add HSN Group
        </button>

        {/* Only show Close button when the form is open */}
        {showForm && (
          <button
            onClick={() => setShowForm(false)}
            className="rounded-xl border px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>


      {/* ========================= */}
      {/* ADD FORM                  */}
      {/* Only shows when showForm is true */}
      {/* ========================= */}
      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

          {/* Form Card Header */}
          <div
            className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
            style={{ backgroundColor: "#3a3c44" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Add HSN Group</h2>
                <p className="text-xs text-white/60">Add your HSN group details</p>
              </div>
            </div>

            {/* Import CSV button — hidden file input triggered by the label */}
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

          {/* Form Fields */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

              {/* Group Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Group Name
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Textiles"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Group Code */}
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
                    onChange={handleInputChange}
                    placeholder="GRP001"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* HSN Code — must be exactly 6 digits */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  HSN Code
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="123456"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
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
      {/* HSN GROUP LIST TABLE      */}
      {/* ========================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

        {/* Table Card Header */}
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
                <h2 className="text-lg font-semibold text-white">HSN Group List</h2>
                <p className="text-xs text-white/60">{filteredList.length} items</p>
              </div>
            </div>

            {/* Search box and Export button */}
            <div className="ml-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // go back to page 1 when searching
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
              />
              <ExportTable data={filteredList} fileName="hsn-group-list" />
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {/* Filter by Name */}
          <select
            value={filters.name}
            onChange={(e) => {
              setFilters({ ...filters, name: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
          >
            <option value="">All Names</option>
            {getUniqueValues("name").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          {/* Filter by HSN Code */}
          <select
            value={filters.code}
            onChange={(e) => {
              setFilters({ ...filters, code: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
          >
            <option value="">All Codes</option>
            {getUniqueValues("code").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Group Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  HSN Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Show message if no rows match */}
              {currentPageRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-slate-400">
                    No data found
                  </td>
                </tr>
              ) : (
                // Show each row
                currentPageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{row.name}</td>
                    <td className="px-6 py-4">{row.groupCode}</td>
                    <td className="px-6 py-4">{row.code}</td>
                    <td className="px-6 py-4">
                      {/* Delete button removes this row from the list */}
                      <button
                        onClick={() => handleDelete(row.id)}
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

        {/* Pagination — only shows if there is more than 1 page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">

            {/* Go to previous page */}
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
              <ChevronLeft />
            </button>

            {/* Current page out of total pages */}
            <span>{currentPage} / {totalPages}</span>

            {/* Go to next page */}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
              <ChevronRight />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}