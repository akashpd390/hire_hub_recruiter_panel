

import LeftSidebar from "./_components/left_side_bar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* The dynamic content of each page will be injected here */}
        {children}
      </div>
    </div>
  );
}