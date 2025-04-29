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
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Job Applicants</h1>
      {
        jobPost && (
          <div className="mb-4">
            <h2 className="text-xl font-bold">{jobPost.job_title}</h2>
            <p className="text-gray-600">{jobPost.job_desc}</p>
          </div>
        )

      }
      {/* <h1 className="text-3xl font-semibold mb-4">Job Applicants for { jobPost.job_title }</h1> */}
      <p className="mb-6 text-gray-600">
        Welcome to the dashboard! Here you can manage your content, settings, and more.
      </p>

      {/* Filter buttons */}
      <div className="flex space-x-4 mb-6">
        {["all", "applied", "shortlisted", "interviewed", "hired", "rejected"].map((status) => (
          <Button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg capitalize hover:bg-gray-400 ${
              filterStatus === status
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {status}
          </Button>
        ))}
      </div>

      {filteredApplicants.length > 0 ? (
        filteredApplicants.map((applicant) => (
          <div
            key={applicant.usr_id}
            className="flex flex-col p-4 rounded-lg bg-slate-50 border border-gray-200 shadow-sm mt-5"
          >
            <Link href={`/profile/${applicant.usr_id}`} passHref>
              <div className="cursor-pointer hover:bg-slate-100">
                <h3 className="text-lg font-semibold">
                  {applicant.profiles.first_name?.toUpperCase()}{" "}
                  {applicant.profiles.last_name?.toUpperCase()}
                </h3>
                <p className="text-gray-500">{applicant.profiles.email}</p>
                <p className="mt-2 text-gray-600">Status: {applicant.status}</p>
              </div>
            </Link>

            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
              {/* Status Dropdown */}
              <div>
                <label
                  htmlFor={`status-${applicant.usr_id}`}
                  className="mr-2 font-medium text-gray-700"
                >
                  Change Status:
                </label>
                <select
                  id={`status-${applicant.usr_id}`}
                  value={applicant.status}
                  onChange={(e) => updateStatus(applicant.usr_id, e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>

                {applicant.resume_url ? (
                            <p>
                                <strong>📄 Resume:</strong>{' '}
                                <a
                                    href={applicant.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    View Resume
                                </a>
                            </p>
                        ) : (
                            <p><strong>📄 Resume:</strong> Not uploaded</p>
                        )}
              </div>

              {/* Message Button */}
              <Link
                href={`/recuiter/dashboard/connect/${applicant.usr_id}`}
                passHref
              >
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  Message
                </Button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No applicants found for this job post.</p>
      )}
    </div>
  );
}
