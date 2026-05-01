import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import Layout from "./components/Layout";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NotFound from "./components/pages/NotFound";

/* DASHBOARD */
import Overview from "./components/dashboard/Overview";

/* USERS */
import Admins from "./components/users/Admins";
import Teams from "./components/users/Teams";

/* DEPARTMENTS */
import Departments from "./components/departments/Departments";

/* CUSTOMERS */
import CustomersList from "./components/customers/CustomersList";
import CustomerQuotations from "./components/customers/CustomerQuotations";
import CustomerPO from "./components/customers/CustomerPO";
import CustomerInvoicing from "./components/customers/CustomerInvoicing";
import CustomerReturns from "./components/customers/CustomerReturns";
import CustomerSummary from "./components/customers/CustomerSummary";

/* SUPPLIERS */
import SuppliersList from "./components/suppliers/SuppliersList";
import SupplierPO from "./components/suppliers/SupplierPO";
import Purchases from "./components/suppliers/Purchases";
import SupplierReturns from "./components/suppliers/SupplierReturns";
import SupplierSummary from "./components/suppliers/SupplierSummary";

/* GATE ENTRY */
import GRN from "./components/gate-entry/GRN";
import StockAllocation from "./components/gate-entry/StockAllocation";
import GateQC from "./components/gate-entry/GateQC";

/* PRODUCTS */
import ProductList from "./components/products/ProductList";
import ProductGroups from "./components/products/ProductGroups";
import HSNGroups from "./components/products/HSNGroups";

/* BOM */
import BOMGroups from "./components/bom/BOMGroups";
import ManageBOM from "./components/bom/ManageBOM";

/* INVENTORY */
import InventoryManage from "./components/inventory/InventoryManage";
import ProductionStock from "./components/inventory/ProductionStock";
import RawStock from "./components/inventory/RawStock";

/* GODOWNS */
import Godowns from "./components/godowns/Godowns";

/* SMT */
import SMTStore from "./components/smt/SMTStore";

/* ASSEMBLY */
import AssemblyManage from "./components/assembly/AssemblyManage";
import AssemblyProduction from "./components/assembly/AssemblyProduction";
import MaterialHistory from "./components/assembly/MaterialHistory";

/* PRODUCTION */
import Production from "./components/production/Production";
import ProductionCalculator from "./components/production/ProductionCalculator";

/* DISPATCH */
import Dispatch from "./components/dispatch/Dispatch";

/* QUALITY */
import QCChecklists from "./components/quality/QCChecklists";
import QCChecklistHistory from "./components/quality/QCChecklistHistory";
import QCChecklistgroups from "./components/quality/QCChecklistgroups";
import ChecklistReceipt from "./components/quality/ChecklistReceipt";

/* LOGS */
import Transactions from "./components/details/Transactions";
import LoginHistory from "./components/details/LoginHistory";
import SoftwareTrail from "./components/details/SoftwareTrail";

/* CASH & BANK */
import CashBook from "./components/transactions/CashBook";
import BankBook from "./components/transactions/BankBook";
import ManageBanks from "./components/transactions/ManageBanks";


export default function App() {
  return (
    <SidebarProvider>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* MAIN LAYOUT */}
        <Route element={<Layout />}>
          {/* DASHBOARD */}
          <Route path="/" element={<Overview />} />

          {/* USERS */}
          <Route path="/manage-users/admins" element={<Admins />} />
          <Route path="/manage-users/team" element={<Teams />} />

          {/* DEPARTMENTS */}
          <Route path="/departments" element={<Departments />} />

          {/* CUSTOMERS */}
          <Route path="/customers/list" element={<CustomersList />} />
          <Route
            path="/customers/quotations"
            element={<CustomerQuotations />}
          />
          <Route path="/customers/po" element={<CustomerPO />} />
          <Route path="/customers/invoicing" element={<CustomerInvoicing />} />
          <Route
            path="/customers/returns-inwards"
            element={<CustomerReturns />}
          />
          <Route path="/customers/summary" element={<CustomerSummary />} />

          {/* SUPPLIERS */}
          <Route path="/suppliers/list" element={<SuppliersList />} />
          <Route path="/suppliers/purchase-orders" element={<SupplierPO />} />
          <Route path="/suppliers/purchases" element={<Purchases />} />
          <Route
            path="/suppliers/returns-outwards"
            element={<SupplierReturns />}
          />
          <Route path="/suppliers/summary" element={<SupplierSummary />} />

          {/* GATE ENTRY */}
          <Route path="/gate-entry/grn" element={<GRN />} />
          <Route
            path="/gate-entry/stock-allocation"
            element={<StockAllocation />}
          />
          <Route path="/gate-entry/quality-control" element={<GateQC />} />

          {/* PRODUCTS */}
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/groups" element={<ProductGroups />} />
          <Route path="/products/hsn-groups" element={<HSNGroups />} />

          {/* BOM */}
          <Route path="/bom/groups" element={<BOMGroups />} />
          <Route path="/bom/manage" element={<ManageBOM />} />

          {/* INVENTORY */}
          <Route path="/inventory/manage" element={<InventoryManage />} />
          <Route
            path="/inventory/production-stock"
            element={<ProductionStock />}
          />
          <Route path="/inventory/raw-stock" element={<RawStock />} />

          {/* GODOWNS */}
          <Route path="/godowns" element={<Godowns />} />

          {/* SMT */}
          <Route path="/smt-store" element={<SMTStore />} />

          {/* ASSEMBLY */}
          <Route path="/assembly-line/manage" element={<AssemblyManage />} />
          <Route
            path="/assembly-line/production"
            element={<AssemblyProduction />}
          />
          <Route
            path="/assembly-line/material-history"
            element={<MaterialHistory />}
          />

          {/* PRODUCTION */}
          <Route path="/production" element={<Production />} />
          <Route
            path="/production/calculator"
            element={<ProductionCalculator />}
          />

          {/* DISPATCH */}
          <Route path="/dispatch" element={<Dispatch />} />

          {/* QUALITY */}
          <Route path="/quality/checklists" element={<QCChecklists />} />
          <Route path="/quality/history" element={<QCChecklistHistory />} />
          <Route
            path="/quality/checklist-groups"
            element={<QCChecklistgroups />}
          />
          <Route path="/quality/checklist-receipt" element={<ChecklistReceipt/>}/>
          

          {/* LOGS */}
          <Route path="/logs/transactions" element={<Transactions />} />
          <Route path="/logs/login-history" element={<LoginHistory />} />
          <Route path="/logs/software-trail" element={<SoftwareTrail />} />

          {/* CASH & BANK */}
          <Route path="/transactions/cash-book" element={<CashBook />} />
          <Route path="/transactions/bank-book" element={<BankBook />} />
          <Route path="/transactions/manage-banks" element={<ManageBanks />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
}
