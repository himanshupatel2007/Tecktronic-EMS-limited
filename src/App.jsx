import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import Layout from "./components/Layout";
import Overview from "./components/Overview";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NotFound from "./components/pages/NotFound";
import ManageAdmins from "./components/ManageAdmin";
import PurchaseOrders from "./components/PurchaseOrders";
import ProductList from "./components/ProductList";
import ProductGroups from "./components/ProductGroups";
import HSNGroups from "./components/HSNGroups";

export default function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/" index element={<Overview />} />
          <Route path="/manage-admins" index element={<ManageAdmins />} />
          <Route path="/purchase-orders" index element={<PurchaseOrders />} />
          <Route path="/products">
            <Route index path="list" element={<ProductList />} />
            <Route path="groups" element={<ProductGroups />} />
            <Route path="hsn-groups" element={<HSNGroups />} />
          </Route>
          <Route path="/transactions">
            <Route index path="cash-book" element={<ProductList />} />
            <Route path="bank-book" element={<ProductGroups />} />
            <Route path="manage-banks" element={<HSNGroups />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
}
