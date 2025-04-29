"use client"


import React, { useEffect } from "react";
import TempComp from "./temp.js";
import { useJobPostsByUser} from "@/lib/hooks/useJobPostsHook.js"
import { createClient } from "@/utils/supabase/client.js";

import { useRouter } from 'next/navigation'


function JobPostList() {

    const supabase = createClient();
    const router = useRouter();

    const { jobPosts, loading } = useJobPostsByUser();

    useEffect(() => {
        const channels = supabase.channel('custom-all-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'JobList' },
          (payload) => {
            router.refresh()
          }
        )
        .subscribe()
        return ()=> {
            supabase.removeChannel(channels);
        }
        },

     [supabase, router]);

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