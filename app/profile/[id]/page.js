"use client"


import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {

    const [user, setUser] = useState();

    const supabase = createClient();

  const {id}  = useParams();

    const fatchUser= async()=>{
        const {data, error} = await supabase.from("profiles").select().eq("id", id).single();
        if (error){
            console.log(error);

        }
        console.log(data)
        setUser(data);
    }
  

  useEffect(()=>{
    fatchUser();
  },[]);

  // Fetch user data using the usr_id, for example, using Supabase or another API
  // For now, we just display the usr_id as an example

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">User Profile</h1>
      <p>User ID: {id}</p>
      <p>User first_name: {user.first_name}</p>
      <p>User phone no: {user.phone_no}</p>
      <p>User skills : {user.skills}</p>
      <p>User address: {user.address}</p>
      <p>User email : {user.email}</p>

      <p>User Dob: {user.date_of_birth}</p>
      <p>User Job Profile: {user.job_profile}</p>
      {/* Fetch and display the profile data here */}
    </div>
  );
}
