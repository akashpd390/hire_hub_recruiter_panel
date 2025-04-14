"use client"

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from 'next/link';
import {Button} from '@/components/ui/button';


export default function JobPostPage({ params }) {

  const supabase = createClient();
  
  // State to store applicants
  const [applicants, setApplicants] = useState([]);
  
  // State to track the current status filter
  const [filterStatus, setFilterStatus] = useState('all');

  // Function to fetch applicants
  const fetchData = async () => {
    const { id } = await params;

    const { data, error } = await supabase
      .from("applications")
      .select("usr_id, profiles(*), status")
      .eq("job_post_id", id);

    if (error) {
      console.log("Error fetching data");
      return;
    }
    setApplicants(data);
  }

  // Fetch applicants when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle status change
  const updateStatus = async (usr_id, newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('usr_id', usr_id);
    
    if (error) {
      console.log("Error updating status");
      return;
    }
    
    // Update the local state without refreshing the page
    setApplicants(prevApplicants => 
      prevApplicants.map(applicant => 
        applicant.usr_id === usr_id ? { ...applicant, status: newStatus } : applicant
      )
    );
  };

  // Filter applicants by status
  const filteredApplicants = filterStatus === 'all' 
    ? applicants 
    : applicants.filter(applicant => applicant.status === filterStatus);

  return (
  <div>
    <h1 className="text-3xl font-semibold mb-4">Job Applicants</h1>
    <p>Welcome to the dashboard! Here you can manage your content, settings, and more.</p>

    {/* Status Filters */}
    <div className="flex space-x-4 mb-6">
      {["all", "applied", "shortlisted", "interviewed", "hired"].map((status) => (
        <Button
          key={status}
          variant={filterStatus === status ? "default" : "secondary"}
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

    {/* Applicants Section */}
    {filteredApplicants.length > 0 ? (
      filteredApplicants.map((applicant) => (
        <div
          key={applicant.usr_id}
          className="flex flex-col p-4 rounded-lg bg-slate-50 border border-gray-200 shadow-sm mt-5"
        >
          {/* Clickable profile info */}
          <Link href={`/profile/${applicant.usr_id}`} passHref>
            <div className="cursor-pointer hover:bg-slate-100">
              <h3 className="text-lg font-semibold">
                {applicant.profiles.first_name.toUpperCase()}{" "}
                {applicant.profiles.last_name.toUpperCase()}
              </h3>
              <p className="text-gray-500">{applicant.profiles.email}</p>
              <p className="mt-2 text-gray-600">Status: {applicant.status}</p>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-wrap gap-3">
              {applicant.status !== "hired" && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    updateStatus(applicant.usr_id, "shortlisted");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Shortlist
                </Button>
              )}
              {applicant.status === "shortlisted" && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    updateStatus(applicant.usr_id, "interviewed");
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Interview
                </Button>
              )}
              {applicant.status === "interviewed" && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    updateStatus(applicant.usr_id, "hired");
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Hire
                </Button>
              )}
              {applicant.status !== "rejected" && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    updateStatus(applicant.usr_id, "rejected");
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Reject
                </Button>
              )}
            </div>

            {/* Message Button */}
            <Link href={`/recuiter/dashboard/connect/${applicant.usr_id}`} passHref>
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