"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageSquare, User, Settings, Briefcase } from "lucide-react";

export default function LeftSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/recuiter/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Applicants", href: "/recuiter/dashboard/posts", icon: <Users className="w-5 h-5" /> },
    { name: "Messages", href: "/recuiter/dashboard/connect", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "Profile", href: "/recuiter/dashboard/profile", icon: <User className="w-5 h-5" /> },
    { name: "Settings", href: "/recuiter/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 h-screen bg-[#09090b] text-zinc-300 border-r border-zinc-800 flex flex-col sticky top-0 shadow-xl">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-zinc-800 bg-[#09090b] z-10 relative">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">HireHub <span className="text-indigo-500 text-xs uppercase tracking-widest block font-medium mt-0.5">Recruiter</span></h2>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 px-3">Menu</div>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 ease-in-out group ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-400 font-medium"
                      : "hover:bg-zinc-800/50 hover:text-white"
                  }`}
                >
                  <div className={`${isActive ? "text-indigo-500" : "text-zinc-400 group-hover:text-indigo-400"} transition-colors`}>
                    {item.icon}
                  </div>
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Optional bottom section (for user context) -> handled in main page normally, keeping sidebar clean */}
    </div>
  );
}
