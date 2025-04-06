// components/sidebar/LeftSidebar.js
import Link from "next/link";

export default function LeftSidebar() {
  return (
    <div className="bg-gray-800">

    <div className="text-white w-64 h-screen p-4 mt-10">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link href="/recuiter/dashboard" className="hover:bg-gray-700 p-2 rounded">Home
          </Link>
        </li>
        <li>
          <Link href="/recuiter/dashboard/posts" className="hover:bg-gray-700 p-2 rounded">Applicants
          </Link>
        </li>
        <li>
          <Link href="/recuiter/dashboard/messages" className="hover:bg-gray-700 p-2 rounded">Messages
          </Link>
        </li>      <li>
          <Link href="/recuiter/dashboard/profile" className="hover:bg-gray-700 p-2 rounded">Profile
          </Link>
        </li>
        <li>
          <Link href="/recuiter/dashboard/settings" className="hover:bg-gray-700 p-2 rounded">Settings
          </Link>
        </li>

      </ul>
    </div>
    </div>
  );
}

