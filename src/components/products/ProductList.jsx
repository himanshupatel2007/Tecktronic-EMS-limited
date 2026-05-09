import { useState } from "react";
import {
  Plus,
  Upload,
  Trash2,
  Package,
  Boxes,
  Hash,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ExportTable from "../ExportTable";

const ITEMS_PER_PAGE = 10;

export default function ProductList() {
  const [activeForm, setActiveForm] = useState(false);

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // FORM STATE
  // =========================

  const initialState = {
    productId: "",

    productCode: "",
    productHSN: "",
    productName: "",

    type: "",
    productType: "Raw Material",

    category: "",
    subType: "",
    subCategory: "",

    productStatus: "Active",

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

    productDetails: "",
  };

  const [formData, setFormData] =
    useState(initialState);

  // =========================
  // HANDLERS
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.productCode ||
      !formData.productName
    ) {
      alert("Product Code and Name are required");
      return;
    }

    setProducts((prev) => [
      {
        ...formData,
        id: Date.now(),
        productId: prev.length + 1,
      },
      ...prev,
    ]);

    resetForm();
    setActiveForm(false);
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = (id) => {
    setProducts((prev) =>
      prev.filter((item) => item.id !== id),
    );
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

      const rows = text.split("\n").map((r) =>
        r.split(","),
      );

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

      const validProducts = imported.map(
        (item, index) => ({
          ...item,
          productId: products.length + index + 1,
        }),
      );

      setProducts((prev) => [
        ...validProducts,
        ...prev,
      ]);
    };

    reader.readAsText(file);
  };

  // =========================
  // FILTERS
  // =========================

  const uniqueValues = (key) => [
    ...new Set(products.map((d) => d[key])),
  ];

  const filteredData = products
    .filter(
      (item) =>
        (!filters.productType ||
          item.productType ===
            filters.productType) &&
        (!filters.category ||
          item.category ===
            filters.category) &&
        (!filters.productGroupName ||
          item.productGroupName ===
            filters.productGroupName) &&
        (!filters.productStatus ||
          item.productStatus ===
            filters.productStatus),
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
          Add Product
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
            className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
            style={{ backgroundColor: "#3a3c44" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Plus className="h-5 w-5 text-white" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add New Product
                </h2>

                <p className="text-xs text-white/60">
                  Fill product details
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

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
              {/* PRODUCT CODE */}
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
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* PRODUCT HSN */}
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
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* PRODUCT NAME */}
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
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* TYPE */}
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
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* PRODUCT TYPE */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product Type
                </label>

                <div className="relative">
                  <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  >
                    <option>
                      Raw Material
                    </option>

                    <option>
                      Finished Goods
                    </option>
                  </select>
                </div>
              </div>

              {/* CATEGORY */}
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
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* SUB TYPE */}
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
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* SUB CATEGORY */}
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
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* STATUS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </label>

                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    name="productStatus"
                    value={formData.productStatus}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Description
                </label>

                <textarea
                  name="productDetails"
                  value={formData.productDetails}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* SUBMIT */}
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
                  Product List
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
    fileName="product-list"
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
            "productType",
            "category",
            "productGroupName",
            "productStatus",
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
                {[
                  "ID",
                  "Code",
                  "Name",
                  "HSN",
                  "Type",
                  "Category",
                  "Group",
                  "Status",
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

            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
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
                      {row.productId}
                    </td>

                    <td className="px-6 py-4">
                      {row.productCode}
                    </td>

                    <td className="px-6 py-4">
                      {row.productName}
                    </td>

                    <td className="px-6 py-4">
                      {row.productHSN}
                    </td>

                    <td className="px-6 py-4">
                      {row.productType}
                    </td>

                    <td className="px-6 py-4">
                      {row.category}
                    </td>

                    <td className="px-6 py-4">
                      {row.productGroupName}
                    </td>

                    <td className="px-6 py-4">
                      {row.productStatus}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleDelete(row.id)
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