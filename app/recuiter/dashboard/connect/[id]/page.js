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
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-zinc-50 rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 bg-white shadow-sm border-b border-zinc-100 flex items-center justify-between z-10">
        {user ? (
          <div className="flex items-center gap-3">
             <div className="relative">
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.first_name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200" 
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent((user.first_name || "User") + " " + (user.last_name || "")) + "&background=random" }} 
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
             </div>
             <div>
                <h1 className="text-lg font-bold text-zinc-900 leading-tight">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-xs text-zinc-500">{user.email}</p>
             </div>
          </div>
        ) : (
          <div className="animate-pulse flex items-center gap-3">
             <div className="w-10 h-10 bg-zinc-200 rounded-full"></div>
             <div className="space-y-2">
                <div className="h-4 w-32 bg-zinc-200 rounded"></div>
                <div className="h-3 w-24 bg-zinc-200 rounded"></div>
             </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50">
        {messages.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-zinc-400">
              <p className="text-4xl mb-3">👋</p>
              <p className="text-sm">Say hello and start the conversation!</p>
           </div>
        ) : (
          messages.map((message) => {
            const isSender = message.sender_id === recuiter?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-5 py-3 rounded-2xl max-w-[75%] shadow-sm ${
                    isSender ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-zinc-800 border border-zinc-200/60 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-zinc-100 pb-6 md:pb-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="flex items-center gap-3 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
          >
             <span className="sr-only">Send</span>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoomPage;
