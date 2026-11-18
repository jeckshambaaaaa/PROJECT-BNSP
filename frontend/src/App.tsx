
import { useState } from "react";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Siswa from "./pages/Siswa";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DashboardLayout
      activePage={activePage}
      setActivePage={setActivePage}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {activePage === "Dashboard" && <Dashboard />}
      {activePage === "Data Siswa" && <Siswa />}
    </DashboardLayout>
  );
}

export default App;
