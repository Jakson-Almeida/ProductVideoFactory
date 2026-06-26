import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  WandSparkles,
  Activity,
  Bell,
  Download,
  Factory,
  Image,
  LayoutDashboard,
  LayoutTemplate,
  Menu,
  Plus,
  Search,
  X,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", short: "Home", icon: LayoutDashboard, testId: "nav-dashboard" },
  { to: "/editor", label: "Editor", short: "Editor", icon: WandSparkles, testId: "nav-editor" },
  { to: "/templates", label: "Templates", short: "Templates", icon: LayoutTemplate, testId: "nav-templates" },
  { to: "/thumbnails", label: "Thumbnails", short: "Thumbs", icon: Image, testId: "nav-thumbnails" },
  { to: "/export", label: "Export", short: "Export", icon: Download, testId: "nav-export" },
];

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = NAV.find((n) => n.to === location.pathname)?.label || "Workspace";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen flex bg-base">
      <aside
        data-testid="sidebar"
        className="hidden lg:flex w-64 shrink-0 border-r border-default bg-bezel flex-col"
      >
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            data-testid="mobile-sidebar"
            className="fixed inset-y-0 left-0 w-[min(100vw,18rem)] z-50 bg-bezel border-r border-default flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-end p-3 border-b border-default">
              <button
                type="button"
                data-testid="close-menu-btn"
                onClick={() => setMenuOpen(false)}
                className="btn-ghost !p-2"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </aside>
        </>
      )}

      <main className="flex-1 flex flex-col min-w-0 w-full">
        <header
          data-testid="topbar"
          className="min-h-16 border-b border-default bg-bezel flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-30"
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              data-testid="menu-btn"
              onClick={() => setMenuOpen(true)}
              className="btn-ghost !p-2 lg:hidden shrink-0"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0 lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-orange flex items-center justify-center shrink-0">
                <Factory size={14} strokeWidth={2.5} className="text-black" />
              </div>
              <div className="h-display text-xs leading-none truncate">
                VIDEO <span className="text-orange">FACTORY</span>
              </div>
            </div>
            <div className="hidden lg:block min-w-0">
              <div className="metadata">FLOOR / {current.toUpperCase()}</div>
              <div className="font-display text-base font-bold tracking-tight truncate">
                Production Floor — {current}
              </div>
            </div>
            <div className="lg:hidden min-w-0">
              <div className="metadata truncate">{current.toUpperCase()}</div>
              <div className="font-display text-sm font-bold tracking-tight truncate">
                Production Floor
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavLink
              to="/editor"
              data-testid="mobile-new-project-btn"
              className="btn-primary !py-2 !px-3 lg:hidden"
            >
              <Plus size={14} strokeWidth={3} />
            </NavLink>
            <div className="hidden md:flex items-center gap-2 px-3 h-9 border border-default bg-surface w-72">
              <Search size={14} className="text-muted" />
              <input
                data-testid="topbar-search"
                placeholder="Search projects, products, SKUs…"
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted"
              />
              <span className="metadata">⌘K</span>
            </div>
            <button data-testid="activity-btn" className="btn-ghost !p-2 sm:!p-2" title="Activity">
              <Activity size={16} />
            </button>
            <button
              data-testid="notifications-btn"
              className="btn-ghost !p-2 sm:!p-2"
              title="Notifications"
            >
              <Bell size={16} />
            </button>
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-default">
              <div className="w-8 h-8 bg-orange flex items-center justify-center text-black font-display font-black text-xs">
                EF
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-semibold">Emergent Factory</div>
                <div className="metadata">PRO PLAN</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto pb-[4.5rem] lg:pb-0">
          <Outlet />
        </div>

        <footer className="hidden lg:block border-t border-default bg-bezel overflow-hidden">
          <div className="flex whitespace-nowrap marquee-track py-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6 metadata">
                <span>● FACTORY UPTIME 99.98%</span>
                <span>● 184 VIDEOS / 30D</span>
                <span>● AVG RENDER 2:34</span>
                <span>● 06 AVATARS ONLINE</span>
                <span>● TIKTOK / REELS / SHORTS / AMAZON</span>
                <span>● GPU CLUSTER NOMINAL</span>
                <span>● HUMAN-IN-THE-LOOP READY</span>
              </div>
            ))}
          </div>
        </footer>

        <nav
          data-testid="mobile-bottom-nav"
          className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-default bg-bezel safe-area-pb"
        >
          <div className="grid grid-cols-5">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  data-testid={`mobile-${item.testId}`}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-display font-bold uppercase tracking-wide transition-colors ${
                      isActive ? "text-orange bg-elevated" : "text-secondary"
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={2} />
                  <span className="truncate max-w-full">{item.short}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <>
      <div className="p-6 border-b border-default">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange flex items-center justify-center glow-orange">
            <Factory size={18} strokeWidth={2.5} className="text-black" />
          </div>
          <div>
            <div className="h-display text-sm leading-none">VIDEO</div>
            <div className="h-display text-sm leading-none text-orange">FACTORY</div>
          </div>
        </div>
        <div className="metadata mt-4 flex items-center gap-2">
          <span className="status-dot done" /> SYSTEM ONLINE
        </div>
      </div>

      <div className="p-4 border-b border-default">
        <NavLink
          to="/editor"
          data-testid="new-project-btn"
          onClick={onNavigate}
          className="btn-primary w-full justify-center"
        >
          <Plus size={14} strokeWidth={3} /> NEW PROJECT
        </NavLink>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="metadata px-6 mb-3">WORKSTATIONS</div>
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              data-testid={item.testId}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium font-display uppercase tracking-wide transition-all border-l-2 ${
                  isActive
                    ? "text-primary border-orange bg-elevated"
                    : "text-secondary border-transparent hover:text-primary hover:bg-surface"
                }`
              }
            >
              <Icon size={16} strokeWidth={2} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-default">
        <div className="metadata mb-3 flex items-center justify-between">
          <span>RENDER QUEUE</span>
          <span className="text-orange">02 ACTIVE</span>
        </div>
        <div className="space-y-2">
          <QueueItem name="PVF-00184" pct={67} />
          <QueueItem name="PVF-00177" pct={32} />
        </div>
      </div>
    </>
  );
}

function QueueItem({ name, pct }) {
  return (
    <div className="text-xs">
      <div className="flex items-center justify-between font-mono mb-1">
        <span className="text-secondary">{name}</span>
        <span className="text-orange">{pct}%</span>
      </div>
      <div className="h-1 bg-surface relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-orange" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
