import { useState } from "react";
import { Plus, Package, Hash, Upload } from "lucide-react";

export default function AddHSNGroup({ onAdd, onClose }) {
  const [formData, setFormData] = useState({ name: "", code: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(formData.code)) {
      alert("HSN Code must be exactly 6 digits");
      return;
    }
    onAdd(formData);
  };
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text.split("\n").slice(1); // skip header

      rows.forEach((row) => {
        const [name, code] = row.split(",");

        // ✅ validation
        if (!name || !/^\d{6}$/.test(code)) return;

        // ✅ directly push to table (NOT form)
        onAdd({
          id: Date.now() + Math.random(),
          name: name.trim(),
          code: code.trim(),
        });
      });
    };

    reader.readAsText(file);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 bg-[#3a3c44] p-4 text-white">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Add HSN Group</h2>
            <p className="text-xs text-slate-400">
              add your hsn group details here
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* ✅ IMPORT BUTTON */}
          <label className="cursor-pointer flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-medium hover:bg-white/10">
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

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              HSN Group Name
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Textiles"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              HSN Code
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. 123456"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                maxLength={6}
                className="w-full rounded-lg border border-slate-200 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#44a83e] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#3c9437]"
          >
            <Plus className="h-4 w-4" /> Create HSN Group
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
