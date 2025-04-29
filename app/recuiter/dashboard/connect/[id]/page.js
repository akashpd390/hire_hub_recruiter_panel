"use client";

import { useEffect, useState, useRef } from 'react';
import { createClient } from "@/utils/supabase/client.js";
import { useParams } from 'next/navigation';

const ChatRoomPage = () => {
  const supabase = createClient();
  const params = useParams();
  const hasInitialized = useRef(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [recuiter, setRecuiter] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) return;

      setRecuiter(currentUser);

      const user_id = params.id;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      setUser(profileData);

      const { data: roomData, error: roomError } = await supabase
        .from('room')
        .select('id')
        .eq('recuiter_id', currentUser.id)
        .eq('user_id', user_id)
        .single();

      if (roomError && roomError.code !== 'PGRST116') {
        console.error('Error fetching room:', roomError);
        return;
      }

      if (roomData) {
        setRoomId(roomData.id);
      } else {
        try {
          const { data: newRoom, error: createRoomError } = await supabase
            .from('room')
            .insert([{ recuiter_id: currentUser.id, user_id: user_id }])
            .select()
            .single();
            
            setRoomId(newRoom.id);
  
          } catch (error) {

            console.error('Error creating room:', createRoomError);
          
          
        }

      }
    };

    fetchUserData();
  }, [params.id]);

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel('message-room')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && roomId && recuiter && user) {
      const { error } = await supabase.from('messages').insert([
        {
          room_id: roomId,
          sender_id: recuiter.id,
          reciever_id: user.id,
          content: newMessage,
        },
      ]);

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setNewMessage('');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
    {/* Header */}
    <div className="p-4 bg-white shadow-md">
      {user && (
        <h1 className="text-xl font-semibold text-gray-800">
          Chat with {user.first_name} {user.last_name}
        </h1>
      )}
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) => {
        const isSender = message.sender_id === recuiter?.id;
        return (
          <div
            key={message.id}
            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs text-white ${
                isSender ? 'bg-blue-500' : 'bg-gray-500'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>

    {/* Input */}
    <div className="p-4 bg-white shadow-inner flex items-center gap-2">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  </div>
  );
};

export default ChatRoomPage;
