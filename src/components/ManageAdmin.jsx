import { useState } from "react";
import AddAdminForm from "./ManageAdmin/AddAdminForm";
import AdminList from "./ManageAdmin/AdminList";

const dummyAdmins = [
  {
    id: 1,
    fullName: "Neelesh Gupta",
    email: "neelesh@company.com",
    role: "Admin",
    status: "Active",
    addedOn: "27 Apr 2026",
  },
  {
    id: 2,
    fullName: "Amit Kumar",
    email: "amit@company.com",
    role: "Super Admin",
    status: "Active",
    addedOn: "24 Apr 2026",
  },
  {
    id: 3,
    fullName: "Rahul Sharma",
    email: "rahul@company.com",
    role: "Manager",
    status: "Active",
    addedOn: "20 Apr 2026",
  },
];

export default function ManageAdmins() {
  const [admins, setAdmins] = useState(dummyAdmins);

  const handleAdd = (admin) => {
    setAdmins((prev) => [...prev, admin]);
  };

  const handleDelete = (id) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <AddAdminForm onAdd={handleAdd} />
        <AdminList admins={admins} onDelete={handleDelete} />
      </div>
    </div>
  );
}
