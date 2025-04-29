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
        <div className="p-6 text-center">
            <h1 className="text-3xl font-semibold ">Applicant Profile</h1>
            {user ? (  // If user data is available, display the details
                <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-10">
                    <div className="flex items-center space-x-6">
                        <img
                            src={user.avatar || 'https://via.placeholder.com/100?text=👤'}
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600"
                        />
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
                                {user.first_name}  {user.last_name}
                            </h2>
                            {/* <p className="text-sm text-gray-500 dark:text-gray-400">User ID: {id}</p> */}
                        </div>
                    </div>

                    <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
                        <p><strong>📞 Phone No:</strong> {user.phone_no || 'Not provided'}</p>
                        <p><strong>🎯 Skills:</strong> {user.skills || 'Not listed'}</p>
                        <p><strong>🏠 Address:</strong> {user.address || 'Not specified'}</p>
                        <p><strong>📧 Email:</strong> {user.email}</p>
                        <p><strong>🎂 Date of Birth:</strong> {user.date_of_birth}</p>
                        <p><strong>💼 Job Profile:</strong> {user.job_profile || 'Not specified'}</p>
                        {user.resume_url ? (
                            <p>
                                <strong>📄 Resume:</strong>{' '}
                                <a
                                    href={user.resume_url}
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
                </div>
            ) : (  // If no user data, show a "User not found" message
                <p>User not found</p>
            )}
        </div>
    );
}
