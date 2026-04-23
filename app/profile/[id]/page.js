"use client"


import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {

    const [user, setUser] = useState();

    const supabase = createClient();

    const { id } = useParams();

    const fatchUser = async () => {
        const { data, error } = await supabase.from("profiles").select().eq("id", id).single();
        if (error) {
            console.log(error);

        }
        console.log(data)
        setUser(data);
    }


    useEffect(() => {
        fatchUser();
    }, []);

    // Fetch user data using the usr_id, for example, using Supabase or another API
    // For now, we just display the usr_id as an example

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6 md:px-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8 text-center md:text-left">
          Applicant Profile
        </h1>
        {user ? (
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 overflow-hidden">
            {/* Header / Banner area */}
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
            
            <div className="px-8 pb-10">
              <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-8">
                <img
                    src={user.avatar || 'https://via.placeholder.com/100?text=👤'}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent((user.first_name || "User") + " " + (user.last_name || "")) + "&background=random&size=128" }}
                />
                <div className="text-center md:text-left md:mb-2">
                    <h2 className="text-3xl font-bold text-zinc-900">
                        {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-indigo-600 font-medium text-lg mt-1">{user.job_profile || 'Open to Opportunities'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">📧</div>
                      <div>
                        <p className="text-sm text-zinc-500">Email Address</p>
                        <p className="font-medium text-zinc-900">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">📞</div>
                      <div>
                        <p className="text-sm text-zinc-500">Phone Number</p>
                        <p className="font-medium text-zinc-900">{user.phone_no || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">🏠</div>
                      <div>
                        <p className="text-sm text-zinc-500">Address</p>
                        <p className="font-medium text-zinc-900">{user.address || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Professional Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">🎯</div>
                      <div>
                        <p className="text-sm text-zinc-500">Skills</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.skills ? user.skills.split(',').map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100">
                              {skill.trim()}
                            </span>
                          )) : (
                            <p className="font-medium text-zinc-900">Not listed</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">🎂</div>
                      <div>
                        <p className="text-sm text-zinc-500">Date of Birth</p>
                        <p className="font-medium text-zinc-900">{user.date_of_birth || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pt-2">
                       {user.resume_url ? (
                         <a
                           href={user.resume_url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
                         >
                           📄 View Original Resume
                         </a>
                       ) : (
                         <div className="flex items-center justify-center gap-2 w-full bg-zinc-100 text-zinc-400 font-medium py-3 px-6 rounded-xl cursor-not-allowed">
                           📄 No Resume Uploaded
                         </div>
                       )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white rounded-3xl shadow-sm border border-zinc-200/60 p-12 mt-8">
             <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-3xl">🔍</span>
             </div>
             <h2 className="text-xl font-bold text-zinc-900 mb-2">Finding Applicant...</h2>
             <p className="text-zinc-500">We are looking up their profile details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
