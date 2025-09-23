import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

// Public pages
import Home from "./components/home/Home";
import Login from "./components/home/Login";
import ScannerPage from "./components/pages/ScannerPage";
import FakeProduct from "./components/pages/FakeProduct"; // Add this import

// Admin
import Admin from "./components/pages/Admin";
import AddAccount from "./components/pages/AddAccount";
import ManageAccount from "./components/pages/ManageAccount";
import Profile from "./components/pages/Profile";

// Module Pages
import Supplier from "./components/pages/Supplier";
import Manufacturer from "./components/pages/Manufacturer";
import Certifier from "./components/pages/Certifier";
import Assembler from "./components/pages/Assembler";
import Distributor from "./components/pages/Distributor";
import Retailer from "./components/pages/Retailer";
import Consumer from "./components/pages/Consumer";

// Module Functionality
import RegisterRawMaterial from "./components/pages/RegisterRawMaterial";
import CreateComponent from "./components/pages/CreateComponent";
import CertifyComponent from "./components/pages/CertifyComponent";
import AssembleWatch from "./components/pages/AssembleWatch";
import UpdateShipping from "./components/pages/UpdateShipping";
import MarkAvailable from "./components/pages/MarkAvailable";
import PurchaseWatch from "./components/pages/PurchaseWatch";

// General Viewer Pages
import ViewRawMaterial from "./components/pages/ViewRawMaterial";
import ViewComponent from "./components/pages/ViewComponent";
import ViewWatch from "./components/pages/ViewWatch";
import ViewFullTraceability from "./components/pages/ViewFullTraceability";

// List Pages
import ListRaw from "./components/pages/ListRaw";
import ListComponent from "./components/pages/ListComponent";
import ListWatch from "./components/pages/ListWatch";
import WatchCollection from "./components/pages/WatchCollection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="scanner" element={<ScannerPage />} />
        <Route path="fake-product" element={<FakeProduct />} />{" "}
        {/* Add this route */}
        {/* Public traceability viewer */}
        <Route path="view-raw-material" element={<ViewRawMaterial />} />
        <Route path="view-component" element={<ViewComponent />} />
        <Route path="view-watch" element={<ViewWatch />} />
        <Route
          path="view-full-traceability"
          element={<ViewFullTraceability />}
        />
        <Route
          path="traceability/:watchId"
          element={<ViewFullTraceability />}
        />
        {/* Admin */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="admin" element={<Admin />} />
          <Route path="add-account" element={<AddAccount />} />
          <Route path="manage-account" element={<ManageAccount />} />
        </Route>
        {/* Profile for all authenticated roles */}
        <Route
          element={
            <RequireAuth
              allowedRoles={[
                "supplier",
                "manufacturer",
                "certifier",
                "assembler",
                "distributor",
                "retailer",
                "consumer",
                "admin",
              ]}
            />
          }
        >
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Supplier */}
        <Route element={<RequireAuth allowedRoles={["supplier", "admin"]} />}>
          <Route path="supplier" element={<Supplier />} />
          <Route
            path="register-raw-material"
            element={<RegisterRawMaterial />}
          />
          <Route path="list-raw-materials" element={<ListRaw />} />
          <Route path="ListRaw" element={<ListRaw />} />
          <Route path="raw-materials-inventory" element={<ListRaw />} />
        </Route>
        {/* Manufacturer */}
        <Route
          element={<RequireAuth allowedRoles={["manufacturer", "admin"]} />}
        >
          <Route path="manufacturer" element={<Manufacturer />} />
          <Route path="create-component" element={<CreateComponent />} />
          <Route path="list-components" element={<ListComponent />} />
          <Route path="components-inventory" element={<ListComponent />} />
          <Route path="add-product" element={<CreateComponent />} />
        </Route>
        {/* Certifier */}
        <Route element={<RequireAuth allowedRoles={["certifier", "admin"]} />}>
          <Route path="certifier" element={<Certifier />} />
          <Route path="certify-component" element={<CertifyComponent />} />
          <Route path="components-review" element={<ListComponent />} />
        </Route>
        {/* Assembler */}
        <Route element={<RequireAuth allowedRoles={["assembler", "admin"]} />}>
          <Route path="assembler" element={<Assembler />} />
          <Route path="assemble-watch" element={<AssembleWatch />} />
          <Route path="list-watches" element={<ListWatch />} />
          <Route path="watches-inventory" element={<ListWatch />} />
        </Route>
        {/* Distributor */}
        <Route
          element={<RequireAuth allowedRoles={["distributor", "admin"]} />}
        >
          <Route path="distributor" element={<Distributor />} />
          <Route path="update-shipping" element={<UpdateShipping />} />
          <Route path="watches-shipping" element={<ListWatch />} />
        </Route>
        {/* Retailer */}
        <Route element={<RequireAuth allowedRoles={["retailer", "admin"]} />}>
          <Route path="retailer" element={<Retailer />} />
          <Route path="mark-available" element={<MarkAvailable />} />
          <Route path="watches-catalog" element={<ListWatch />} />
        </Route>
        {/* Consumer */}
        <Route element={<RequireAuth allowedRoles={["consumer", "admin"]} />}>
          <Route path="consumer" element={<Consumer />} />
          <Route path="purchase-watch" element={<PurchaseWatch />} />
          <Route path="watch-collection" element={<WatchCollection />} />
          <Route path="available-watches" element={<ListWatch />} />
        </Route>
        {/* Shared Routes */}
        <Route
          element={
            <RequireAuth
              allowedRoles={["manufacturer", "certifier", "assembler", "admin"]}
            />
          }
        >
          <Route path="view-components-multi" element={<ListComponent />} />
        </Route>
        <Route
          element={
            <RequireAuth allowedRoles={["supplier", "manufacturer", "admin"]} />
          }
        >
          <Route path="view-raw-materials-multi" element={<ListRaw />} />
        </Route>
        <Route
          element={
            <RequireAuth
              allowedRoles={[
                "assembler",
                "distributor",
                "retailer",
                "consumer",
                "admin",
              ]}
            />
          }
        >
          <Route path="view-watches-multi" element={<ListWatch />} />
        </Route>
        {/* Fallback route */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
