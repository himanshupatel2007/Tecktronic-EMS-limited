import { useState } from "react";
import CreateForm from "../CreateForm";
import CreateTable from "../CreateTable";
import { Hash, Boxes, Package, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QCChecklistGroups() {
  const [activeForm, setActiveForm] = useState(false);
  const [qcGroups, setQcGroups] = useState([]);
const navigate = useNavigate();

  // ✅ ADD
  const handleAdd = (data) => {
    setQcGroups((prev) => [
      {
        ...data,
        id: Date.now(),
      },
      ...prev,
    ]);
    setActiveForm(false);
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    setQcGroups((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ✅ INITIAL STATE
  const initialState = {
    iqcGroupId: "",
    iqcGroupName: "",
    iqcType: "",
    remarks: "",
  };

  // ✅ FORM FIELDS
  const fields = [
    {
      name: "iqcGroupId",
      label: "IQC Group ID",
      icon: Hash,
      type: "text",
      placeholder: "IQC001",
    },
    {
      name: "iqcGroupName",
      label: "IQC Group Name",
      icon: Boxes,
      type: "text",
      placeholder: "Incoming Material Check",
    },
    {
      name: "iqcType",
      label: "IQC Type",
      icon: Package,
      type: "select",
     options: ["Raw Material", "In Process", "Finished Goods"]
    },
    {
      name: "remarks",
      label: "Remarks",
      icon: Package,
      type: "textarea",
      placeholder: "Optional notes...",
    },
  ];

  // ✅ TABLE COLUMNS
  const columns = [
    { label: "IQC Group ID", key: "iqcGroupId" },
    { label: "IQC Group Name", key: "iqcGroupName" },
    { label: "IQC Type", key: "iqcType" },
    { label: "Remarks", key: "remarks" },
  ];

  // ✅ ACTIONS
 const actions = [
  {
    label: "View Checklists",
    icon: Package,
    onClick: (row) =>
      navigate("/quality/checklists", {
        state: { groupId: row.iqcGroupId },
      }),
    className:
      "border-blue-200 text-blue-500 hover:bg-blue-50",
  },
  {
    label: "Delete",
    icon: Trash2,
    onClick: (row) => handleDelete(row.id),
    className:
      "border-red-200 text-red-500 hover:bg-red-50",
  },
];

  return (
    <>
      {/* TOP BUTTON */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          + Add IQC Group
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

      <div className="space-y-8">
        {/* ✅ FORM */}
        {activeForm && (
          <CreateForm
            title="Add IQC Group"
            subtitle="Create QC checklist group"
            fields={fields}
            initialState={initialState}
            onSubmit={handleAdd}
            onImport={(data) =>
              data.forEach((item) => handleAdd(item))
            }
          />
        )}

        {/* ✅ TABLE */}
        <CreateTable
          title="IQC Group List"
          data={qcGroups}
          columns={columns}
          filtersConfig={["iqcType"]}
          actions={actions}
        />
      </div>
    </>
  );
}