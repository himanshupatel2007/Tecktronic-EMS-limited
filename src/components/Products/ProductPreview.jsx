import React, { useState } from "react";
import { Eye, Pencil, Trash2, Package, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import ProductViewModal from "./ProductViewModal";

const ITEMS_PER_PAGE = 10;

export default function ProductPreview({ products, onDelete }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    productStatus: "",
    productGroup: "",
  });

  // Derive unique filter options from data
  const uniqueValues = (key) => [...new Set(products.map((p) => p[key]).filter(Boolean))];

  // Apply filters
  const filteredProducts = products.filter((product) => {
    return (
      (filters.category === "" || product.category === filters.category) &&
      (filters.type === "" || product.type === filters.type) &&
      (filters.productStatus === "" || product.productStatus === filters.productStatus) &&
      (filters.productGroup === "" || product.productGroup === filters.productGroup)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Group paginated products
  const groupedProducts = paginatedProducts.reduce((acc, product) => {
    const group = product.productGroup || "Ungrouped";
    if (!acc[group]) acc[group] = [];
    acc[group].push(product);
    return acc;
  }, {});

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const clearFilters = () => {
    setFilters({ category: "", type: "", productStatus: "", productGroup: "" });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        {/* Header */}
        <div
          className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Product List</h2>
              <p className="text-xs text-white/60">
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? "s" : ""} Available
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>

          {[
            { key: "category", label: "Category" },
            { key: "type", label: "Type" },
            { key: "productStatus", label: "Status" },
            { key: "productGroup", label: "Group" },
          ].map(({ key, label }) => (
            <select
              key={key}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-blue-400 dark:border-[#1b2740] dark:bg-[#0d1528] dark:text-slate-300"
            >
              <option value="">All {label}s</option>
              {uniqueValues(key).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ))}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#162033]">
                {["Product", "Product Code", "Category", "Type", "Status", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                    No products match the selected filters
                  </td>
                </tr>
              ) : (
                Object.entries(groupedProducts).map(([groupName, items]) => (
                  <React.Fragment key={groupName}>
                    {/* Group Header */}
                    <tr className="bg-slate-100 dark:bg-[#11182b]">
                      <td
                        colSpan={6}
                        className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {groupName} ({items.length})
                      </td>
                    </tr>

                    {items.map((product) => (
                      <tr
                        key={product.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-[#11182b]"
                      >
                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-[#44a83e] dark:bg-green-900/20 dark:text-green-400">
                              <Package className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">
                                {product.productName}
                              </p>
                              <p className="text-xs text-slate-400">{product.productHSN}</p>
                            </div>
                          </div>
                        </td>

                        {/* Product Code */}
                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                          {product.productCode}
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                          {product.category}
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                          {product.type}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                              product.productStatus === "Active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.productStatus === "Active" ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                            {product.productStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>

                            <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/20">
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>

                            <button
                              onClick={() => onDelete(product.id)}
                              className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    page === currentPage
                      ? "bg-[#2563eb] text-white"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}