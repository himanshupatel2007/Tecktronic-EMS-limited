import { useState } from "react";
import CreateForm from "../CreateForm";
import CreateTable from "../CreateTable";
import { Trash2, Eye, Pencil,Hash,Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QCChecklists() {
  const navigate = useNavigate();

  const [checklists, setChecklists] = useState([]);
  const [formData, setFormData] = useState({
    checklistCode: "",
    checklistName: "",
    applicableProduct: "",
    groupName: "",
    items: [],
  });

  const [activeForm, setActiveForm] = useState(false);

  // ✅ ADD ITEM ROW
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          subName: "",
          valueType: "",
          min: "",
          max: "",
          same: "",
          tool: "",
        },
      ],
    }));
  };

  // ✅ HANDLE CHANGE
  const handleItemChange = (index, key, value) => {
    const updated = [...formData.items];
    updated[index][key] = value;
    setFormData({ ...formData, items: updated });
  };

  // ✅ ADD CHECKLIST
  const handleSubmit = () => {
    setChecklists((prev) => [
      {
        ...formData,
        id: Date.now(),
      },
      ...prev,
    ]);

    setActiveForm(false);
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    setChecklists((prev) => prev.filter((c) => c.id !== id));
  };

  // ✅ TABLE
  const columns = [
    { label: "Code", key: "checklistCode" },
    { label: "Name", key: "checklistName" },
    { label: "Product", key: "applicableProduct" },
    { label: "Group", key: "groupName" },
  ];

  // ✅ ACTIONS
  const actions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate("/quality/checklist-report", {
          state: { checklist: row },
        }),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: (row) => {
        setFormData(row);
        setActiveForm(true);
      },
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => handleDelete(row.id),
      className: "border-red-200 text-red-500 hover:bg-red-50",
    },
  ];

  return (
    <>
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          + Add Checklist
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
      {activeForm && (
        <div className="space-y-6">
          {/* ✅ MAIN FORM (LIKE HSN) */}
          <CreateForm
            title="Add QC Checklist"
            subtitle="Create checklist details"
            fields={[
              {
                name: "checklistCode",
                label: "Checklist Code",
                icon: Hash,
                type: "text",
                placeholder: "CHK001",
              },
              {
                name: "checklistName",
                label: "Checklist Name",
                icon: Package,
                type: "text",
                placeholder: "Box Inspection",
              },
              {
                name: "applicableProduct",
                label: "Applicable Product",
                icon: Package,
                type: "text",
                placeholder: "Master Box",
              },
              {
                name: "groupName",
                label: "Group Name",
                icon: Package,
                type: "select",
                options: [
                  "Incoming Material Check",
                  "In Process",
                  "Finished Goods",
                ],
              },
            ]}
            initialState={formData}
            onSubmit={(data) => {
              setFormData((prev) => ({
                ...prev,
                ...data,
              }));
            }}
          />

          {/* ✅ CHECKLIST ITEMS SECTION */}
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-[#162033] mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Checklist Items
              </h3>

              <button
                onClick={addItem}
                className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs text-white"
              >
                + Add Item
              </button>
            </div>

            {formData.items.length === 0 ? (
              <p className="text-xs text-slate-400">No items added yet</p>
            ) : (
              formData.items.map((item, i) => (
                <div key={i} className="grid grid-cols-7 gap-2 mb-2">
                  <input
                    placeholder="Name"
                    className="input"
                    onChange={(e) =>
                      handleItemChange(i, "name", e.target.value)
                    }
                  />
                  <input
                    placeholder="Sub Name"
                    className="input"
                    onChange={(e) =>
                      handleItemChange(i, "subName", e.target.value)
                    }
                  />
                  <select
                    className="input"
                    onChange={(e) =>
                      handleItemChange(i, "valueType", e.target.value)
                    }
                  >
                    <option>Type</option>
                    <option>Numeric</option>
                    <option>Character</option>
                  </select>
                  <input
                    placeholder="Min"
                    className="input"
                    onChange={(e) => handleItemChange(i, "min", e.target.value)}
                  />
                  <input
                    placeholder="Max"
                    className="input"
                    onChange={(e) => handleItemChange(i, "max", e.target.value)}
                  />
                  <input
                    placeholder="Same"
                    className="input"
                    onChange={(e) =>
                      handleItemChange(i, "same", e.target.value)
                    }
                  />
                  <input
                    placeholder="Tool"
                    className="input"
                    onChange={(e) =>
                      handleItemChange(i, "tool", e.target.value)
                    }
                  />
                </div>
              ))
            )}

            {/* ✅ FINAL SAVE */}
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="mt-4 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white"
            >
              Save Checklist
            </button>
          </div>
        </div>
      )}

      <CreateTable
        title="QC Checklists"
        data={checklists}
        columns={columns}
        filtersConfig={["groupName"]}
        actions={actions}
      />
    </>
  );
}
