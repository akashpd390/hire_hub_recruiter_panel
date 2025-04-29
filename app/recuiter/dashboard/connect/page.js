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
    <div className="max-w-2xl mx-auto p-6">
    <h1 className="text-2xl font-semibold mb-4 text-gray-800">Chat Users</h1>

    {loading ? (
      <div className="text-center text-gray-500">Loading...</div>
    ) : (
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.first_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <Button onClick={() => handleCreateRoom(user.id)}>Start Chat</Button>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};


export default ChatListPage;