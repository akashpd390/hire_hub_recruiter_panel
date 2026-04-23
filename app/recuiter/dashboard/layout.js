import LeftSidebar from "./_components/left_side_bar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-500/30">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8 md:p-10 lg:px-12 max-w-7xl mx-auto w-full transition-all duration-300">
        {/* The dynamic content of each page will be injected here */}
        {children}
      </div>
    </div>
  );
}