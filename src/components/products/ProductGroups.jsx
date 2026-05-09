import { useState } from "react";
import {
  Plus, Upload, Trash2, Boxes,
  Hash, Package, Filter,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import ExportTable from "../ExportTable";


// -------------------------------------------------------
// How many rows to show at a time in the table
// -------------------------------------------------------
const ITEMS_PER_PAGE = 10;


// -------------------------------------------------------
// Main Component
// -------------------------------------------------------
export default function ProductGroups() {

  // Controls whether the Add form is visible or hidden
  const [showForm, setShowForm] = useState(false);

  // Stores all the saved product group rows
  const [groups, setGroups] = useState([]);

  // Stores what the user is typing in the form fields
  const [formData, setFormData] = useState({
    groupCode: "",                      // e.g. "GRP001"
    groupName: "",                      // e.g. "Red T-Shirt"
    groupType: "",                      // e.g. "Regular"
    industry: "",                       // e.g. "Clothing"
    sector: "Apparel & Textiles",       // default value shown in dropdown
    categoryStatus: "active",           // default value shown in dropdown
  });

  // Stores the selected filter values for the filter dropdowns
  const [filters, setFilters] = useState({
    groupType: "",
    industry: "",
    sector: "",
    categoryStatus: "",
  });

  // Stores the text typed in the search box
  const [search, setSearch] = useState("");

  // Tracks which page we are on in the table
  const [currentPage, setCurrentPage] = useState(1);


  // -------------------------------------------------------
  // When user types in any form input or selects a dropdown
  // -------------------------------------------------------
  function handleInputChange(e) {
    // e.target.name is the field name (e.g. "groupCode")
    // e.target.value is what the user typed or selected
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }


  // -------------------------------------------------------
  // Reset the form back to default empty values
  // -------------------------------------------------------
  function resetForm() {
    setFormData({
      groupCode: "",
      groupName: "",
      groupType: "",
      industry: "",
      sector: "Apparel & Textiles",
      categoryStatus: "active",
    });
  }


  // -------------------------------------------------------
  // When user clicks the "Create" button to save a new group
  // -------------------------------------------------------
  function handleSubmit(e) {
    // Prevent the page from refreshing (default form behaviour)
    e.preventDefault();

    // Both Group Code and Group Name are required
    if (!formData.groupCode || !formData.groupName) {
      alert("Group Code and Name are required");
      return;
    }

    // Build the new row to add to the table
    const newRow = {
      id: Date.now(), // unique id using current timestamp
      groupCode: formData.groupCode,
      groupName: formData.groupName,
      groupType: formData.groupType,
      industry: formData.industry,
      sector: formData.sector,
      categoryStatus: formData.categoryStatus,
    };

    // Add the new row to the top of the list
    setGroups([newRow, ...groups]);

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

    // This runs after the file has been read
    reader.onload = (event) => {
      const fileText = event.target.result;

      // Split the file into rows, then split each row by comma
      const rows = fileText.split("\n").map((row) => row.split(","));

      // First row is the header (column names like "groupCode", "groupName")
      const headers = rows[0];

      // All rows after the first row are the actual data
      const dataRows = rows.slice(1);

      // Convert each data row into an object using header names as keys
      const importedItems = dataRows.map((row) => {
        const item = {};
        headers.forEach((header, index) => {
          item[header.trim()] = row[index]?.trim();
        });
        item.id = Date.now() + Math.random(); // give each row a unique id
        return item;
      });

      // Only keep rows that have both a groupCode and a groupName
      const validItems = importedItems.filter(
        (item) => item.groupCode && item.groupName
      );

      // Add the valid imported rows to the top of the list
      setGroups([...validItems, ...groups]);
    };

    reader.readAsText(file);
  }


  // -------------------------------------------------------
  // When user clicks the Delete button on a row
  // -------------------------------------------------------
  function handleDelete(id) {
    // Keep all rows except the one with the matching id
    const updatedList = groups.filter((group) => group.id !== id);
    setGroups(updatedList);
  }


  // -------------------------------------------------------
  // Filter and search the table rows
  // -------------------------------------------------------

  // Start with all rows
  let filteredList = groups;

  // Apply groupType filter if one is selected
  if (filters.groupType !== "") {
    filteredList = filteredList.filter((item) => item.groupType === filters.groupType);
  }

  // Apply industry filter if one is selected
  if (filters.industry !== "") {
    filteredList = filteredList.filter((item) => item.industry === filters.industry);
  }

  // Apply sector filter if one is selected
  if (filters.sector !== "") {
    filteredList = filteredList.filter((item) => item.sector === filters.sector);
  }

  // Apply categoryStatus filter if one is selected
  if (filters.categoryStatus !== "") {
    filteredList = filteredList.filter((item) => item.categoryStatus === filters.categoryStatus);
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
  // Get unique values for the filter dropdowns
  // -------------------------------------------------------
  function getUniqueValues(key) {
    // Remove duplicates and empty values
    return [...new Set(groups.map((row) => row[key]).filter(Boolean))];
  }


  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="space-y-8">

      {/* Top Buttons — Add Group and Close */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          <Plus className="h-4 w-4" />
          Add Group
        </button>

        {/* Only show the Close button when the form is open */}
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
                <h2 className="text-lg font-semibold text-white">Add Product Group</h2>
                <p className="text-xs text-white/60">Add your product group details</p>
              </div>
            </div>

            {/* Import CSV button — hidden file input triggered by the label click */}
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

              {/* Group Name */}
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
                    onChange={handleInputChange}
                    placeholder="Red T-Shirt"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Group Type */}
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
                    onChange={handleInputChange}
                    placeholder="Regular"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Industry */}
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
                    onChange={handleInputChange}
                    placeholder="Clothing"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Sector Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sector
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  >
                    <option>Apparel & Textiles</option>
                    <option>Electronics</option>
                    <option>Automotive</option>
                    <option>FMCG</option>
                    <option>Pharmaceuticals</option>
                    <option>Footwear</option>
                  </select>
                </div>
              </div>

              {/* Category Status Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category Status
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    name="categoryStatus"
                    value={formData.categoryStatus}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
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
      {/* PRODUCT GROUP LIST TABLE  */}
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
                <h2 className="text-lg font-semibold text-white">Product Group List</h2>
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
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
              />
              <ExportTable data={filteredList} fileName="product-group-list" />
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {/* Filter by Group Type */}
          <select
            value={filters.groupType}
            onChange={(e) => {
              setFilters({ ...filters, groupType: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All groupType</option>
            {getUniqueValues("groupType").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          {/* Filter by Industry */}
          <select
            value={filters.industry}
            onChange={(e) => {
              setFilters({ ...filters, industry: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All industry</option>
            {getUniqueValues("industry").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          {/* Filter by Sector */}
          <select
            value={filters.sector}
            onChange={(e) => {
              setFilters({ ...filters, sector: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All sector</option>
            {getUniqueValues("sector").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          {/* Filter by Category Status */}
          <select
            value={filters.categoryStatus}
            onChange={(e) => {
              setFilters({ ...filters, categoryStatus: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All categoryStatus</option>
            {getUniqueValues("categoryStatus").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Group Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Group Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Group Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Sector</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Show message if no rows match */}
              {currentPageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-slate-400">
                    No data found
                  </td>
                </tr>
              ) : (
                // Show each row
                currentPageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{row.groupCode}</td>
                    <td className="px-6 py-4">{row.groupName}</td>
                    <td className="px-6 py-4">{row.groupType}</td>
                    <td className="px-6 py-4">{row.industry}</td>
                    <td className="px-6 py-4">{row.sector}</td>
                    <td className="px-6 py-4 capitalize">{row.categoryStatus}</td>
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