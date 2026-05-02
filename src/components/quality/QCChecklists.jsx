import { useState } from "react";
import CreateTable from "../CreateTable";
import { Trash2, Eye, Pencil, Hash, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EMPTY_FORM = {
  checklistCode: "",
  checklistName: "",
  applicableProduct: "",
  groupName: "Incoming Material Check",
  items: [],
};

export default function QCChecklists() {
  const [checklists, setChecklists] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [activeForm, setActiveForm] = useState(false);
  const navigate = useNavigate();

  // ── ITEMS ─────────────────────────────
 const addItem = () => {
  setFormData((prev) => ({
    ...prev,
    items: [
      ...prev.items,
      {
        name: "",
        subName: "",
        valueType: "Numeric",  // ← change this
        min: "",
        max: "",
        same: "",
        tool: "",
      },
    ],
  }));
};

  const handleItemChange = (index, key, value) => {
    const updated = [...formData.items];
    updated[index][key] = value;
    setFormData({ ...formData, items: updated });
  };

  const handleTypeChange = (index, value) => {
    const updated = [...formData.items];
    updated[index].valueType = value;
    if (value === "Character") {
      updated[index].min = "-";
      updated[index].max = "-";
    } else {
      updated[index].min = "";
      updated[index].max = "";
    }
    setFormData({ ...formData, items: updated });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  // ── HEADER ────────────────────────────
  const handleFieldChange = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  // ── SAVE ──────────────────────────────
  const handleSave = () => {
    if (!formData.checklistCode || !formData.checklistName) {
      alert("Checklist Code and Name are required.");
      return;
    }

    setChecklists((prev) => {
      if (formData.id) {
        return prev.map((c) => (c.id === formData.id ? formData : c));
      }
      return [{ ...formData, id: Date.now() }, ...prev];
    });

    setFormData(EMPTY_FORM);
    setActiveForm(false);
  };

  const handleDelete = (id) =>
    setChecklists((prev) => prev.filter((c) => c.id !== id));

  // ── TABLE ─────────────────────────────
  const columns = [
    { label: "Code", key: "checklistCode" },
    { label: "Name", key: "checklistName" },
    { label: "Product", key: "applicableProduct" },
    { label: "Group", key: "groupName" },
  ];

  const actions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate("/quality/checklist-receipt", {
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
      {/* TOOLBAR */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => {
            setFormData(EMPTY_FORM);
            setActiveForm(true);
          }}
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

      {/* FORM */}
      {activeForm && (
        <div className="mb-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

            {/* HEADER */}
            <div
              className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
              style={{ backgroundColor: "#3a3c44" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Hash className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {formData.id ? "Edit QC Checklist" : "Add QC Checklist"}
                  </h2>
                  <p className="text-xs text-white/60">
                    Create checklist details
                  </p>
                </div>
              </div>
            </div>

            {/* HEADER FIELDS */}
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              <InputField label="Checklist Code" icon={Hash} value={formData.checklistCode} onChange={(v)=>handleFieldChange({ checklistCode:v })}/>
              <InputField label="Checklist Name" icon={Package} value={formData.checklistName} onChange={(v)=>handleFieldChange({ checklistName:v })}/>
              <InputField label="Applicable Product" icon={Package} value={formData.applicableProduct} onChange={(v)=>handleFieldChange({ applicableProduct:v })}/>
              <SelectField label="Group Name" icon={Package} value={formData.groupName} onChange={(v)=>handleFieldChange({ groupName:v })} options={["Incoming Material Check","In Process","Finished Goods"]}/>
            </div>

            {/* ITEMS */}
            <div className="border-t border-slate-200 p-6 dark:border-[#162033]">
              <div className="flex justify-between mb-6">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Checklist Items
                </h3>
              </div>

              {formData.items.length === 0 ? (
                <p className="text-xs text-slate-400">No items added yet.</p>
              ) : (
                <div className="space-y-6">
                  {formData.items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 p-5 dark:border-[#1b2740]">

                      <div className="flex justify-between items-center mb-4">
                        <p className="text-xs font-semibold text-slate-500">
                          Item {i + 1}
                        </p>

                        <button
                          onClick={() => removeItem(i)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <InputField label="Name" icon={Hash} value={item.name} onChange={(v)=>handleItemChange(i,"name",v)} />
                        <InputField label="Sub Name" icon={Hash} value={item.subName} onChange={(v)=>handleItemChange(i,"subName",v)} />
                        <SelectField
                          label="Type"
                          icon={Package}
                          value={item.valueType}
                          onChange={(v) => handleTypeChange(i, v)}
                          options={["Numeric", "Character"]}
                          noPlaceholder
                        />
                        {item.valueType !== "Character" && (
                          <InputField label="Min Value" icon={Hash} value={item.min} onChange={(v)=>handleItemChange(i,"min",v)} />
                        )}
                        {item.valueType !== "Character" && (
                          <InputField label="Max Value" icon={Hash} value={item.max} onChange={(v)=>handleItemChange(i,"max",v)} />
                        )}
                         {item.valueType !== "Numeric" && (
                          <InputField label="Ideal Value" icon={Hash} value={item.same} onChange={(v)=>handleItemChange(i,"same",v)} />
                        )}

                        <InputField label="Tool" icon={Package} value={item.tool} onChange={(v)=>handleItemChange(i,"tool",v)} />

                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleSave}
                className="mt-6 rounded-xl bg-[#44a83e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
              >
                {formData.id ? "Update Checklist" : "Save Checklist"}
              </button>
              <button
                  onClick={addItem}
                  className="mt-6 ml-4 rounded-xl bg-[#44a83e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
                >
                  + Add Item
                </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
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

// ── REUSABLE INPUT ─────────────────────
function InputField({ label, icon: Icon, value, onChange }) {
  const style =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#44a83e] focus:ring-2 focus:ring-green-100 dark:bg-[#11182b] dark:border-[#1b2740]";

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4"/>
        <input className={style} value={value} onChange={(e)=>onChange(e.target.value)} />
      </div>
    </div>
  );
}

// ── REUSABLE SELECT ─────────────────────
function SelectField({ label, icon: Icon, value, onChange, options=[], noPlaceholder=false }) {
  const style =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#44a83e] focus:ring-2 focus:ring-green-100 dark:bg-[#11182b] dark:border-[#1b2740]";

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4"/>
        <select className={style} value={value} onChange={(e)=>onChange(e.target.value)}>
          {!noPlaceholder && <option value="">Select</option>}
          {options.map((opt,i)=><option key={i}>{opt}</option>)}
        </select>
      </div>
    </div>
  );
}