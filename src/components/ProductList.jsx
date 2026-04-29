import { useState } from "react";
import AddProductForm from "./Products/AddProductForm";
import ProductPreview from "./Products/ProductPreview";

export default function ProductList() {
  //for toggling between forms
  const [activeForm, setActiveForm] = useState(null);

  //products
  const [products, setProducts] = useState([]);

  const handleAdd = (product) => {
    setProducts((prev) => [
      {
        ...product,
        id: Date.now(),
      },
      ...prev,
    ]);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <>
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveForm("product")}
          className="rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          + Add Product
        </button>

        {activeForm && (
          <button
            onClick={() => setActiveForm(null)}
            className="rounded-xl border px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>
      <div className="space-y-8">
        {/* Product Form - only render when activeForm is "product" */}
        {activeForm === "product" && <AddProductForm onAdd={handleAdd} />}

        {/* Tables always visible */}
        <ProductPreview products={products} onDelete={handleDelete} />
      </div>
    </>
  );
}
