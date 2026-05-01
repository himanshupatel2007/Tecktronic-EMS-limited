import { useState } from "react";
import CreateTable from "../CreateTable";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QCChecklistHistory() {
  const navigate = useNavigate();

  // ✅ SAMPLE DATA (replace later with backend)
  const [history, setHistory] = useState([]);

  // ✅ DELETE
  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ TABLE COLUMNS
  const columns = [
    { label: "Checklist Code", key: "checklistCode" },
    { label: "Checklist Name", key: "checklistName" },
    { label: "Product", key: "applicableProduct" },
    { label: "Group", key: "groupName" },
    { label: "Status", key: "status" },
    { label: "Date", key: "date" },
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
      label: "Delete",
      icon: Trash2,
      onClick: (row) => handleDelete(row.id),
      className: "border-red-200 text-red-500 hover:bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      <CreateTable
        title="QC Checklist History"
        data={history}
        columns={columns}
        filtersConfig={["groupName", "status"]}
        actions={actions}
      />
    </div>
  );
}