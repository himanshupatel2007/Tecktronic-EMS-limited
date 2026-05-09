import { useState } from "react";
import {
  Plus, Upload, Trash2, Package,
  Boxes, Hash, Filter,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import ExportTable from "../ExportTable";


// -------------------------------------------------------
// How many rows to show at a time in the table
// -------------------------------------------------------
const ITEMS_PER_PAGE = 10;


// -------------------------------------------------------
// Default empty values for the form
// Stored separately so we can easily reset the form later
// -------------------------------------------------------
const emptyForm = {
  productId: "",

  productCode: "",        // e.g. "PRD001"
  productHSN: "",         // HSN tax code number
  productName: "",        // e.g. "Blue Cotton Shirt"

  type: "",               // free text type
  productType: "Raw Material",  // dropdown default

  category: "",
  subType: "",
  subCategory: "",

  productStatus: "Active",   // dropdown default

  productGroupId: "",
  productGroupName: "",
  productGroupCode: "",

  hsnGroupId: "",
  hsnGroupName: "",
  hsnGroupCode: "",

  mainUnit: "",
  subUnit: "",

  size: "",
  color: "",

  productDetails: "",    // description / notes
};


// -------------------------------------------------------
// Main Component
// -------------------------------------------------------
export default function ProductList() {

  // Controls whether the Add form is visible or hidden
  const [showForm, setShowForm] = useState(false);

  // Stores all the saved product rows
  const [products, setProducts] = useState([]);

  // Stores what the user is currently typing in the form
  const [formData, setFormData] = useState(emptyForm);

  // Stores the text typed in the search box
  const [search, setSearch] = useState("");

  // Stores the selected filter values for the filter dropdowns
  const [filters, setFilters] = useState({
    productType: "",
    category: "",
    productGroupName: "",
    productStatus: "",
  });

  // Tracks which page we are on in the table
  const [currentPage, setCurrentPage] = useState(1);


  // -------------------------------------------------------
  // When user types in any form input or selects a dropdown
  // -------------------------------------------------------
  function handleInputChange(e) {
    // e.target.name is which field changed (e.g. "productCode")
    // e.target.value is what the user typed or selected
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }


  // -------------------------------------------------------
  // Reset the form back to all empty/default values
  // -------------------------------------------------------
  function resetForm() {
    setFormData(emptyForm);
  }


  // -------------------------------------------------------
  // When user clicks "Create Product" to save a new product
  // -------------------------------------------------------
  function handleSubmit(e) {
    // Prevent the page from refreshing (default form behaviour)
    e.preventDefault();

    // Product Code and Product Name are both required
    if (!formData.productCode || !formData.productName) {
      alert("Product Code and Name are required");
      return;
    }

    // Build the new product row to add to the table
    const newProduct = {
      ...formData,
      id: Date.now(),                    // unique id using current timestamp
      productId: products.length + 1,    // auto incrementing display id
    };

    // Add the new product to the top of the list
    setProducts([newProduct, ...products]);

    // Clear the form and hide it
    resetForm();
    setShowForm(false);
  }


  // -------------------------------------------------------
  // When user clicks the Delete button on a row
  // -------------------------------------------------------
  function handleDelete(id) {
    // Keep all products except the one with the matching id
    const updatedList = products.filter((item) => item.id !== id);
    setProducts(updatedList);
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

      // First row is the header (column names like "productCode", "productName")
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

      // Give each imported item an auto incrementing product id
      const itemsWithIds = importedItems.map((item, index) => ({
        ...item,
        productId: products.length + index + 1,
      }));

      // Add the imported products to the top of the list
      setProducts([...itemsWithIds, ...products]);
    };

    reader.readAsText(file);
  }


  // -------------------------------------------------------
  // Filter and search the table rows
  // -------------------------------------------------------

  // Start with all products
  let filteredList = products;

  // Apply productType filter if one is selected
  if (filters.productType !== "") {
    filteredList = filteredList.filter((item) => item.productType === filters.productType);
  }

  // Apply category filter if one is selected
  if (filters.category !== "") {
    filteredList = filteredList.filter((item) => item.category === filters.category);
  }

  // Apply productGroupName filter if one is selected
  if (filters.productGroupName !== "") {
    filteredList = filteredList.filter((item) => item.productGroupName === filters.productGroupName);
  }

  // Apply productStatus filter if one is selected
  if (filters.productStatus !== "") {
    filteredList = filteredList.filter((item) => item.productStatus === filters.productStatus);
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
  // Get unique values for a column (used in filter dropdowns)
  // -------------------------------------------------------
  function getUniqueValues(key) {
    // Remove duplicates using Set
    return [...new Set(products.map((row) => row[key]))];
  }


  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="space-y-8">

      {/* Top Buttons — Add Product and Close */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          <Plus className="h-4 w-4" />
          Add Product
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
                <h2 className="text-lg font-semibold text-white">Add New Product</h2>
                <p className="text-xs text-white/60">Fill product details</p>
              </div>
            </div>

            {/* Import CSV button — clicking the label opens the hidden file input */}
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
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">

              {/* Product Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product Code
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="productCode"
                    value={formData.productCode}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Product HSN */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product HSN
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="productHSN"
                    value={formData.productHSN}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product Name
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Type
                </label>
                <div className="relative">
                  <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Product Type Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product Type
                </label>
                <div className="relative">
                  <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  >
                    <option>Raw Material</option>
                    <option>Finished Goods</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Sub Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sub Type
                </label>
                <div className="relative">
                  <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="subType"
                    value={formData.subType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Sub Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sub Category
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    name="productStatus"
                    value={formData.productStatus}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Description — spans full width */}
              <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  name="productDetails"
                  value={formData.productDetails}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="px-6 pb-6">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3c9437]"
              >
                <Plus className="h-4 w-4" />
                Create Product
              </button>
            </div>
          </form>

        </div>
      )}


      {/* ========================= */}
      {/* PRODUCT LIST TABLE        */}
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
                <h2 className="text-lg font-semibold text-white">Product List</h2>
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
              <ExportTable data={filteredList} fileName="product-list" />
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {/* Filter by Product Type */}
          <select
            value={filters.productType}
            onChange={(e) => {
              setFilters({ ...filters, productType: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All productType</option>
            {getUniqueValues("productType").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          {/* Filter by Category */}
          <select
            value={filters.category}
            onChange={(e) => {
              setFilters({ ...filters, category: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All category</option>
            {getUniqueValues("category").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          {/* Filter by Product Group Name */}
          <select
            value={filters.productGroupName}
            onChange={(e) => {
              setFilters({ ...filters, productGroupName: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All productGroupName</option>
            {getUniqueValues("productGroupName").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>

          {/* Filter by Product Status */}
          <select
            value={filters.productStatus}
            onChange={(e) => {
              setFilters({ ...filters, productStatus: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none"
          >
            <option value="">All productStatus</option>
            {getUniqueValues("productStatus").map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">HSN</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Group</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Show message if no rows match */}
              {currentPageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-sm text-slate-400">
                    No data found
                  </td>
                </tr>
              ) : (
                // Show each product row
                currentPageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{row.productId}</td>
                    <td className="px-6 py-4">{row.productCode}</td>
                    <td className="px-6 py-4">{row.productName}</td>
                    <td className="px-6 py-4">{row.productHSN}</td>
                    <td className="px-6 py-4">{row.productType}</td>
                    <td className="px-6 py-4">{row.category}</td>
                    <td className="px-6 py-4">{row.productGroupName}</td>
                    <td className="px-6 py-4">{row.productStatus}</td>
                    <td className="px-6 py-4">
                      {/* Delete button removes this product from the list */}
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