import { useState } from "react";
import { Plus } from "lucide-react";
import AddHSNGroup from "./Products/AddHSNGroup";
import HSNPreview from "./Products/HSNPreview";

export default function HSNGroups() {
  const [showForm, setShowForm] = useState(false);
  const [hsnGroups, setHsnGroups] = useState([]);

  const handleAdd = (formData) => {
    setHsnGroups((prev) => [{ ...formData, id: Date.now() }, ...prev]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setHsnGroups((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className=" space-y-6 font-sans">
      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#3c9437]"
        >
          <Plus className="h-4 w-4" /> Add HSN Group
        </button>
      </div>

      {showForm && (
        <AddHSNGroup onAdd={handleAdd} onClose={() => setShowForm(false)} />
      )}

      <HSNPreview hsnGroups={hsnGroups} onDelete={handleDelete} />
    </div>
  );
}
