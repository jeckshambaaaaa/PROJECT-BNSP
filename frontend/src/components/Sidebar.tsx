
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  X,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function Sidebar({
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Data Siswa",
      icon: Users,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-800">
                EduManage
              </h1>
              <p className="text-xs text-slate-400">
                Student Management
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu Utama
          </p>

          <nav className="space-y-2">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const isActive = activePage === menu.name;

              return (
                <button
                  key={menu.name}
                  onClick={() => {
                    setActivePage(menu.name);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  {menu.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Administrator
              </p>
              <p className="text-xs text-slate-400">
                Admin
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;