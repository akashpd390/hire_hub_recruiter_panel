import React from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const TempComp = ({jobPosts})=>{
    const router = useRouter();
    const onVeiw =()=>{
        router.push('/recuiter/dashboard/posts/' + jobPosts?.id);
    }

    const onFeedback=()=>{
        console.log("delete")
    }

    return(
        <div className="border shadow-sm rounded-lg p-3">
  <h2 className="font-bold text-gray-900">{jobPosts?.job_title}</h2>
  <h2 className="text-sm text-gray-800">{jobPosts?.experience} years of experience</h2>
  <h2 className="text-xs text-gray-700">
    Created at {new Date(jobPosts.created_at).toLocaleString()}
  </h2>

  <div className="flex justify-between gap-2 mt-3">
    <Button size="sm" variant="outline" className="flex-1" onClick={onFeedback}>
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