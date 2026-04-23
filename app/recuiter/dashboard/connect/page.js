"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client.js';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const supabase = createClient();

const ChatListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {

      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('room')
        .select('*, user_id(*)')
        .eq('recuiter_id', user.id);


      if (error) {
        console.error('Error fetching users:', error);
      } else {
        console.log('Fetched users:', data);
        setUsers(data.map((room) => room.user_id));
        console.log('Users:', users);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleCreateRoom = (userId) => {

    router.push(`/recuiter/dashboard/connect/${userId}`);

  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Messages</h1>
        <p className="text-zinc-500 mt-1">Chat directly with applicants and potential hires.</p>
      </div>

      {loading ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-zinc-200 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-zinc-500 mt-4 font-medium">Loading conversations...</p>
        </div>
      ) : users.length === 0 ? (
         <div className="text-center p-12 bg-white rounded-2xl border border-zinc-200 border-dashed">
             <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <p className="text-2xl">💬</p>
             </div>
             <h3 className="text-lg font-medium text-zinc-900 mb-1">No messages yet</h3>
             <p className="text-zinc-500 max-w-sm mx-auto">When an applicant applies or when you initiate a conversation, they will appear here.</p>
          </div>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/60 hover:shadow-md transition-all gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.first_name || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-100"
                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent((user.first_name || "User") + " " + (user.last_name || "")) + "&background=random" }}
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    {user.first_name || 'Unknown'} {user.last_name || ''}
                  </p>
                  <p className="text-sm text-zinc-500 truncate max-w-[200px] md:max-w-xs">{user.email || 'No email'}</p>
                </div>
              </div>
              <Button 
                onClick={() => handleCreateRoom(user.id)}
                className="w-full md:w-auto bg-zinc-900 hover:bg-indigo-600 text-white rounded-xl transition-colors"
               >
                Open Chat
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default ChatListPage;