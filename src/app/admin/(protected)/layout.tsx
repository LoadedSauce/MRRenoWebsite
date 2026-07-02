import Link from "next/link";
import { LogoutButton } from "../logout-button";

const navItems = [
  { label: "Team",          href: "/admin/team" },
  { label: "Project Photos",href: "/admin/portfolio" },
  { label: "Testimonials",  href: "/admin/testimonials" },
  { label: "Now Hiring",    href: "/admin/jobs" },
  { label: "Candidates",    href: "/admin/candidates" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-soft-navy flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-navy-deep text-paper flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="font-display font-bold text-sm text-paper tracking-tight">
            M.R. Renovations
          </p>
          <p className="text-[11px] text-white/70 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-paper transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
