
import { Menu, Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function DashboardLayout({
  children,
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {activePage}
              </h2>
              <p className="hidden text-xs text-slate-400 sm:block">
                Manajemen Data Siswa
              </p>
            </div>
          </div>

          <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </header>

        <main className="p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
