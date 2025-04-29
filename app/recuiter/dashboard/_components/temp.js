import React from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";


const TempComp = ({jobPosts})=>{

    const supabase = createClient();

    const router = useRouter();
    const onVeiw =()=>{
        router.push('/recuiter/dashboard/posts/' + jobPosts?.id);
    }

    const onDelete = async () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this job post? This action cannot be undone."
      );
  
      if (!confirmDelete) return;
  
      const { error } = await supabase
        .from("JobList")
        .delete()
        .eq("id", jobPosts.id);
  
      if (error) {
        console.error("Delete error:", error);
        alert("Failed to delete job post.");
        return;
      }
  
      alert("Job post deleted successfully.");
  

      // if (onDelete) onDelete(jobPosts.id);
      router.refresh();
    }; 

    return(
        <div className="border shadow-sm rounded-lg p-3">
  <h2 className="font-bold text-gray-900">{jobPosts?.job_title}</h2>
  <h2 className="text-sm text-gray-800">{jobPosts?.experience} years of experience</h2>
  <h2 className="text-xs text-gray-700">
    Created at {new Date(jobPosts.created_at).toLocaleString()}
  </h2>

  <div className="flex justify-between gap-2 mt-3">
    <Button size="sm" variant="outline" className="flex-1" onClick={onDelete}>
      Delete
    </Button>

    <Button size="sm" className="flex-1" onClick={onVeiw}>
      View Details
    </Button>
  </div>
</div>

    );
}

export default TempComp;