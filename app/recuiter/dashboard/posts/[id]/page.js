"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JobPostPage({ params }) {
  const supabase = createClient();

  const [applicants, setApplicants] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [jobPostId, setJobPostId] = useState(null);
  const [jobPost, setJobPost] = useState(null);


  useEffect(() => {
    // Fetch the job post details using the jobPostId
    const fetchJobPostDetails = async () => {
      if (!jobPostId) return;

      const { data, error } = await supabase
        .from("JobList")
        .select("*")
        .eq("id", jobPostId)
        .single();

      if (error) {
        console.error("Error fetching job post details", error);
        return;
      }

      setJobPost(data);
    };

    fetchJobPostDetails();
  }
  , [jobPostId, supabase]);

  useEffect(() => {
    // Safely unwrap the params
    const unwrapParamsAndFetch = async () => {
      const { id } = await params; // Await if it's a Promise
      setJobPostId(id);

      const { data, error } = await supabase
        .from("applications")
        .select("usr_id, profiles(*), status,  resume_url")
        .eq("job_post_id", id);

      if (error) {
        console.error("Error fetching data", error);
        return;
      }

      setApplicants(data);
    };

    unwrapParamsAndFetch();
  }, [params, supabase]);

  const updateStatus = async (usr_id, newStatus) => {
    if (!jobPostId) return;

    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("usr_id", usr_id)
      .eq("job_post_id", jobPostId);

    if (error) {
      console.error("Error updating status", error);
      return;
    }

    setApplicants((prev) =>
      prev.map((a) =>
        a.usr_id === usr_id ? { ...a, status: newStatus } : a
      )
    );
  };

  const filteredApplicants =
    filterStatus === "all"
      ? applicants
      : applicants.filter((a) => a.status === filterStatus);

  return (
    <div className="p-6 md:p-10 animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Job Applicants</h1>
          {jobPost ? (
            <p className="text-zinc-500 mt-1 max-w-2xl">
              Showing applicants for <strong>{jobPost.job_title}</strong>. {jobPost.job_desc}
            </p>
          ) : (
            <p className="text-zinc-500 mt-1">Manage and review candidates for your job post.</p>
          )}
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-8 bg-zinc-100/50 p-2 rounded-2xl border border-zinc-200/50">
        {["all", "applied", "shortlisted", "interviewed", "hired", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
              filterStatus === status
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/60 ring-1 ring-zinc-900/5"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((applicant) => (
            <div
              key={applicant.usr_id}
              className="flex flex-col md:flex-row p-6 rounded-2xl bg-white border border-zinc-200/60 shadow-sm transition-all hover:shadow-md gap-6 items-start md:items-center group"
            >
              <div className="flex-1 min-w-0 w-full mb-4 md:mb-0">
                <Link href={`/profile/${applicant.usr_id}`} className="block">
                  <div className="cursor-pointer group-hover:bg-zinc-50/50 -mx-3 -my-3 p-3 rounded-xl transition-colors">
                    <h3 className="text-xl font-bold text-zinc-900 truncate flex items-center gap-2">
                      {applicant.profiles.first_name || "Unknown"} {applicant.profiles.last_name || "User"}
                    </h3>
                    <p className="text-zinc-500 truncate mt-1">{applicant.profiles.email || "No email provided"}</p>
                    <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize bg-zinc-100 text-zinc-700">
                      Status: {applicant.status}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <div className="relative border border-zinc-200 rounded-xl bg-zinc-50 overflow-hidden shadow-sm flex items-center px-1">
                     <select
                      id={`status-${applicant.usr_id}`}
                      value={applicant.status}
                      onChange={(e) => updateStatus(applicant.usr_id, e.target.value)}
                      className="bg-transparent text-zinc-700 font-medium text-sm py-2 px-3 outline-none min-w-[130px] appearance-none cursor-pointer"
                    >
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {/* Fake caret */}
                    <div className="pointer-events-none absolute right-3 text-zinc-400">
                      ▼
                    </div>
                  </div>
                </div>

                {applicant.resume_url ? (
                  <a
                    href={applicant.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 text-zinc-900 h-10 px-4 py-2 rounded-xl"
                  >
                    View Resume
                  </a>
                ) : (
                  <div className="inline-flex items-center justify-center text-sm font-medium border border-zinc-200 bg-zinc-100 text-zinc-400 h-10 px-4 py-2 rounded-xl cursor-not-allowed">
                     No Resume
                  </div>
                )}
                
                <Link
                  href={`/recuiter/dashboard/connect/${applicant.usr_id}`}
                  className="w-full md:w-auto"
                >
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm h-10 px-5">
                    Messages
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-12 bg-white rounded-2xl border border-zinc-200 border-dashed">
             <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <p className="text-2xl">📝</p>
             </div>
             <h3 className="text-lg font-medium text-zinc-900 mb-1">No applicants yet</h3>
             <p className="text-zinc-500 max-w-sm mx-auto">There are no candidates matching the current filter criteria for this job post.</p>
          </div>
        )}
      </div>
    </div>
  );
}
