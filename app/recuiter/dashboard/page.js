'use client'

// import { supabase_client } from "@/utils/supabase_config";
import { useEffect, useState,} from "react";
import { AddNewJobPost } from "./_components/add_new_job_post";
import JobPostList from "./_components/job_post_list";
import { useRouter } from 'next/navigation'
import { createClient } from "@/utils/supabase/client";


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase_client = createClient();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const { data, error } = await supabase_client.auth.getUser();

      if (error || !data.user) {
        console.error("Error fetching user:", error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setUser(data.user);
      }

      // Fetch recruiter details
      const { data: recruiterData, error: recruiterError } = await supabase_client
        .from("recuiters")
        .select("name")
        .eq("id", data.user.id)
        .single();

      if (isMounted) {
        if (recruiterError) {
          console.error("Error fetching recruiter data:", recruiterError);
          setRecruiter(null);
        } else {
          setRecruiter(recruiterData);
        }
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    console.log("sign out")
    await supabase_client.auth.signOut();
    router.replace('/recuiter')

  }

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not authenticated</div>;

  return (
    <div className="p-6 relative">
      {/* 🔓 Sign out button in top left */}
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>

      <h1 className="text-3xl font-semibold mb-4">
        Hello, {recruiter ? recruiter.name : 'Loading...'}
      </h1>
      <p>Welcome to the dashboard! Here you can manage your content, settings, and more.</p>

      <h2 className="text-gray-900 font-bold text-2xl mt-20">Dashboard</h2>
      <h2 className="text-gray-800">Create New Job post on public server</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewJobPost />
      </div>

      <div>
        <JobPostList />
      </div>
    </div>
  );
}
