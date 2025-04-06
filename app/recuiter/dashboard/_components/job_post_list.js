"use client"


import React from "react";
import TempComp from "./temp.js";
import { useJobPostsByUser} from "@/lib/hooks/useJobPostsHook.js"


function JobPostList() {

    const { jobPosts, loading } = useJobPostsByUser();



    return (
        <div>

            <h2 className="text-gray-700 font-medium text-xl">Live Job Posts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols3 gap-5 my-3">
               {jobPosts && jobPosts.map((item, index)=>(
                <TempComp jobPosts={item} key={index}></TempComp>
               ))}
            
            </div>
        </div>
    );
}

export default JobPostList;