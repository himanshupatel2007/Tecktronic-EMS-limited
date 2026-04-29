import { Package, X } from "lucide-react";

export default function ProductViewModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ backgroundColor: "#44a83e" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: "rgba(245,245,245,0.15)",
              }}
            >
              <Package className="h-5 w-5 text-white" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#f5f5f5]">
                {product.name}
              </h3>
              <p className="text-xs text-white/60">Product Details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          {[
            { label: "Product Name", value: product.name },
            { label: "SKU", value: product.sku },
            { label: "Category", value: product.category },
            {
              label: "Price",
              value: `₹${product.price.toLocaleString()}`,
            },
            {
              label: "Stock",
              value: `${product.stock} Units`,
            },
            {
              label: "Status",
              value: product.stock > 0 ? "In Stock" : "Out of Stock",
              isStatus: true,
            },
          ].map(({ label, value, isStatus }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-slate-100 py-3 dark:border-[#162033] last:border-0"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </span>

              {isStatus ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      product.stock > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {value}
                </span>
              ) : (
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {value}
                </span>
              )}
            </div>
          ))}

          <div className="border-t border-slate-100 pt-4 dark:border-[#162033]">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Description
            </h4>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
