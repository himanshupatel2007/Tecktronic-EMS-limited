import { useState } from "react";
import GroupPreview from "./Products/GroupPreview";
import AddProductGroupForm from "./Products/GroupForm";

export default function ProductGroups() {
  const [activeForm, setActiveForm] = useState(null);
  const [groups, setGroups] = useState([]);

  const handleAddGroup = (group) => {
    setGroups((prev) => [
      {
        ...group,
        id: Date.now(),
      },
      ...prev,
    ]);
    // Also close the form automatically after adding
    setActiveForm(null); 
  };

  const handleDeleteGroup = (id) => {
    setGroups((prev) => prev.filter((group) => group.id !== id));
  };

  return (
    <>
      {/* Buttons */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveForm("group")}
          className="rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          + Add Group
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

      {/* Form Section */}
      {activeForm === "group" && (
        <AddProductGroupForm 
          onAdd={handleAddGroup} 
          onClose={() => setActiveForm(null)} // This is the logic you requested
        />
      )}

      {/* Table Section */}
      <GroupPreview groups={groups} onDelete={handleDeleteGroup} />
    </>
  );
}