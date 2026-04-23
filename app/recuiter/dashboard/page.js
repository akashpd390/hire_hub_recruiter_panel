'use client'

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
    <div className="relative animate-in fade-in zoom-in-95 duration-500">
      {/* Header section */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">
            Welcome back, {recruiter ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">{recruiter.name}</span> : '...'} 👋
          </h1>
          <p className="text-base text-zinc-500 max-w-2xl leading-relaxed">
            Here's what's happening with your job postings today. Manage your content and review applicants seamlessly.
          </p>
        </div>
        
        {/* 🔓 Sign out button */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm font-medium bg-white text-zinc-600 border border-zinc-200 shadow-sm px-4 py-2 rounded-xl hover:bg-zinc-50 hover:text-red-600 hover:border-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          Sign Out
        </button>
      </div>

      {/* Main Stats / Post Section */}
      <div className="mb-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 rounded-2xl bg-white border border-zinc-200/60 shadow-sm overflow-hidden group">
            <div className="p-6 h-full flex flex-col justify-center">
             <AddNewJobPost />
            </div>
          </div>
          
          {/* Mock stats cards for better SaaS look */}
          <div className="col-span-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 border border-white/10 shadow-lg text-white p-6 relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-indigo-100 font-medium mb-1">Active Listings</p>
                <h3 className="text-4xl font-bold">12</h3>
             </div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="col-span-1 rounded-2xl bg-white border border-zinc-200/60 shadow-sm p-6 flex flex-col justify-center">
             <p className="text-zinc-500 font-medium mb-1">Total Applicants</p>
             <h3 className="text-4xl font-bold text-zinc-900">148</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-8">
        <JobPostList />
      </div>
    </div>
  );
}
