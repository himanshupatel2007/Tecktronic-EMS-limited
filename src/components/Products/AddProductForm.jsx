import { useState } from "react";
import { Plus, Package, Boxes, Hash, Upload } from "lucide-react";

const initialState = {
  productCode: "",
  productHSN: "",
  productName: "",
  type: "",
  category: "",
  productGroup: "",
  hsnGroup: "",
  subType: "",
  subCategory: "",
  productStatus: "Active", // default value
  productDetails: "",
};

//product input data ->Input Product List
// •	Product Code
// •	Product HSN
// •	Product Name
// •	Type
// •	Category
// •	Product Group
// •	HSN Group
// •	Sub-Type
// •	Sub-Category
// •	Product Status
// •	Product Details
// •	Product Status(active/inactive)

export default function AddProductForm({ onAdd }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // HSN validation
    if (!/^\d{6}$/.test(formData.productHSN)) {
      alert("HSN must be exactly 6 digits");
      return;
    }

    onAdd({
      ...formData,
      id: Date.now(),
    });

    setFormData(initialState);
  };
  const fields = [
    {
      name: "productCode",
      label: "Product Code",
      icon: Hash,
      type: "text",
      placeholder: "e.g. PRD-001",
    },
    {
      name: "productHSN",
      label: "Product HSN",
      icon: Hash,
      type: "number",
      placeholder: "e.g. 8471",
    },
    {
      name: "productName",
      label: "Product Name",
      icon: Package,
      type: "text",
      placeholder: "e.g. Wireless Mouse",
    },
    {
      name: "type",
      label: "Type",
      icon: Boxes,
      type: "text",
      placeholder: "e.g. Physical / Digital",
    },
    {
      name: "category",
      label: "Category",
      icon: Hash,
      type: "text",
      placeholder: "e.g. Electronics",
    },
    {
      name: "productGroup",
      label: "Product Group",
      icon: Boxes,
      type: "select", // Changed from text to select
      options: ["Accessories", "Raw Materials", "Finished Goods", "Packaging"],
      placeholder: "e.g. Accessories",
    },
    {
      name: "hsnGroup",
      label: "HSN Group",
      icon: Hash,
      type: "select", // Changed from text to select
      options: ["IT Goods", "Textiles", "Electronics", "Chemicals", "Services"],
      placeholder: "e.g. IT Goods",
    },
    {
      name: "subType",
      label: "Sub-Type",
      icon: Boxes,
      type: "text",
      placeholder: "e.g. Input Device",
    },
    {
      name: "subCategory",
      label: "Sub-Category",
      icon: Hash,
      type: "text",
      placeholder: "e.g. Computer Accessories",
    },
    {
      name: "productStatus",
      label: "Product Status",
      icon: Hash,
      type: "select",
      options: ["Active", "Inactive"],
    },
    {
      name: "productDetails",
      label: "Product Details",
      icon: Package,
      type: "textarea",
      placeholder: "Enter product description...",
    },
  ];
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      // convert CSV → array
      const rows = text.split("\n").map((row) => row.split(","));

      const headers = rows[0];

      const importedProducts = rows.slice(1).map((row) => {
        const obj = {};

        headers.forEach((header, index) => {
          obj[header.trim()] = row[index]?.trim();
        });

        return {
          ...obj,
          id: Date.now() + Math.random(),
        };
      });

      // ✅ send directly to table
      importedProducts.forEach((product) => onAdd(product));
    };

    reader.readAsText(file);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
      {/* Header */}
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
              Add New Product
            </h2>
            <p className="text-xs text-white/60">
              Fill in the details to create a new product
            </p>
          </div>
        </div>

        {/* ✅ IMPORT BUTTON */}
        <div>
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
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.name} className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {field.label}
                </label>

                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#44a83e] focus:bg-white dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#44a83e] focus:bg-white "
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#44a83e] focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100 dark:focus:ring-green-900/20"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="px-6 pb-6">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3c9437] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
