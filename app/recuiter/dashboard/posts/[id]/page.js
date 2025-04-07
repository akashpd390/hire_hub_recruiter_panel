"use client"

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from 'next/link';



export default function jobPostPage({ params }) {

  const supabase = createClient();

  const [applicants, setApplicants] = useState([]);



  const fethcData = async () => {
    const { id } = await params;


    const { data, error } = await supabase
      .from("applications")
      .select("usr_id, profiles(*)")
      .eq("job_post_id", id);

    if (error) {
      console.log("not found");
      return;
    }
    setApplicants(data);
    ;
  }

  useEffect(() => {

    fethcData();
  }, []);


  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Job Applicants { }</h1>
      <p>Welcome to the dashboard! Here you can manage your content, settings, and more.</p>
      {/* You can add more content here as needed */}

      {/* <div className="flex flex-col space-y-4 p-6 rounded-lg bg-white border border-gray-300 shadow-md"> */}
      {applicants.length > 0 ? (
        applicants.map((applicant) => (
          <Link
            key={applicant.usr_id}
            href={`/profile/${applicant.usr_id}`}  // Navigate to the profile page with usr_id
            passHref
          >
            <div
              className="flex flex-col p-4 rounded-lg bg-slate-50 border border-gray-200 shadow-sm mt-5 cursor-pointer hover:bg-slate-100"
            >
              <h3 className="text-lg font-semibold">
                {applicant.profiles.first_name.toUpperCase()} {applicant.profiles.last_name.toUpperCase()}
              </h3>
              <p className="text-gray-500">{applicant.profiles.email}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-gray-500">No applicants found for this job post.</p>
      )}
      {/* </div> */}


    </div>
  );
};