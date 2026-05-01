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

  // ── ITEMS ──────────────────────────────────────────────

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

  const handleItemChange = (index, key, value) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, items: updated };
    });
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // ── HEADER FIELDS (from CreateForm) ───────────────────

  // CreateForm calls onSubmit on every "Create" click — we don't use that button.
  // Instead we pass onFieldChange so the parent stays in sync on every keystroke.
  const handleFieldChange = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  // ── SAVE ──────────────────────────────────────────────

  const handleSave = () => {
    if (!formData.checklistCode || !formData.checklistName) {
      alert("Checklist Code and Name are required.");
      return;
    }

    setChecklists((prev) => {
      // editing an existing entry
      if (formData.id) {
        return prev.map((c) => (c.id === formData.id ? formData : c));
      }
      return [{ ...formData, id: Date.now() }, ...prev];
    });

    setFormData(EMPTY_FORM);
    setActiveForm(false);
  };

  // ── DELETE / EDIT ──────────────────────────────────────

  const handleDelete = (id) =>
    setChecklists((prev) => prev.filter((c) => c.id !== id));

  // ── TABLE CONFIG ──────────────────────────────────────

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

  // ── RENDER ────────────────────────────────────────────

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
        <div className="space-y-6 mb-6">
          {/*
            KEY FIX: pass formData.id (or a stable key) so CreateForm re-mounts
            when we switch between "new" and "edit", resetting its internal state.
            We also pass onFieldChange so every keystroke syncs back to the parent.
          */}
          <ControlledHeaderForm
            key={formData.id ?? "new"}
            formData={formData}
            onChange={handleFieldChange}
          />

          {/* ITEMS */}
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-[#162033]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Checklist Items
              </h3>
              <button
                onClick={addItem}
                className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
              >
                + Add Item
              </button>
            </div>

            {formData.items.length === 0 ? (
              <p className="text-xs text-slate-400">No items added yet.</p>
            ) : (
              <>
                {/* Column headers */}
                <div className="grid grid-cols-8 gap-2 mb-1 px-1">
                  {[
                    "Name",
                    "Sub Name",
                    "Type",
                    "Min",
                    "Max",
                    "Same",
                    "Tool",
                    "",
                  ].map((h, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {formData.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-8 gap-2 mb-2">
                    <input
                      placeholder="Name"
                      className="input"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(i, "name", e.target.value)
                      }
                    />
                    <input
                      placeholder="Sub Name"
                      className="input"
                      value={item.subName}
                      onChange={(e) =>
                        handleItemChange(i, "subName", e.target.value)
                      }
                    />
                    <select
                      className="input"
                      value={item.valueType}
                      onChange={(e) =>
                        handleItemChange(i, "valueType", e.target.value)
                      }
                    >
                      <option value="">Type</option>
                      <option>Numeric</option>
                      <option>Character</option>
                    </select>
                    <input
                      placeholder="Min"
                      className="input"
                      value={item.min}
                      onChange={(e) =>
                        handleItemChange(i, "min", e.target.value)
                      }
                    />
                    <input
                      placeholder="Max"
                      className="input"
                      value={item.max}
                      onChange={(e) =>
                        handleItemChange(i, "max", e.target.value)
                      }
                    />
                    <input
                      placeholder="Same"
                      className="input"
                      value={item.same}
                      onChange={(e) =>
                        handleItemChange(i, "same", e.target.value)
                      }
                    />
                    <input
                      placeholder="Tool"
                      className="input"
                      value={item.tool}
                      onChange={(e) =>
                        handleItemChange(i, "tool", e.target.value)
                      }
                    />
                    <button
                      onClick={() => removeItem(i)}
                      className="rounded-lg border border-red-200 text-red-400 text-xs hover:bg-red-50 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </>
            )}

            <button
              onClick={handleSave}
              className="mt-4 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
            >
              {formData.id ? "Update Checklist" : "Save Checklist"}
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

// ─────────────────────────────────────────────────────────
// Controlled wrapper around CreateForm.
// Instead of relying on CreateForm's internal state,
// we pass each field value as a controlled prop via
// a thin shim that calls onChange on every keystroke.
// ─────────────────────────────────────────────────────────
function ControlledHeaderForm({ formData, onChange }) {
  // We render the fields manually so we fully own the state.
  // (Alternatively you could patch CreateForm to accept value props —
  //  but that changes the shared component. This keeps changes local.)

  const fieldStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#44a83e] focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100 dark:focus:ring-green-900/20";
  const labelStyle =
    "text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
      {/* Header */}
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
            <p className="text-xs text-white/60">Create checklist details</p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
        {/* Checklist Code */}
        <div className="space-y-1.5">
          <label className={labelStyle}>Checklist Code</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className={fieldStyle}
              placeholder="CHK001"
              value={formData.checklistCode}
              onChange={(e) => onChange({ checklistCode: e.target.value })}
            />
          </div>
        </div>

        {/* Checklist Name */}
        <div className="space-y-1.5">
          <label className={labelStyle}>Checklist Name</label>
          <div className="relative">
            <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className={fieldStyle}
              placeholder="Box Inspection"
              value={formData.checklistName}
              onChange={(e) => onChange({ checklistName: e.target.value })}
            />
          </div>
        </div>

        {/* Applicable Product */}
        <div className="space-y-1.5">
          <label className={labelStyle}>Applicable Product</label>
          <div className="relative">
            <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className={fieldStyle}
              placeholder="Master Box"
              value={formData.applicableProduct}
              onChange={(e) => onChange({ applicableProduct: e.target.value })}
            />
          </div>
        </div>

        {/* Group Name */}
        <div className="space-y-1.5">
          <label className={labelStyle}>Group Name</label>
          <div className="relative">
            <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              className={fieldStyle}
              value={formData.groupName}
              onChange={(e) => onChange({ groupName: e.target.value })}
            >
              <option>Incoming Material Check</option>
              <option>In Process</option>
              <option>Finished Goods</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
