import React, { useEffect, useRef, useState } from 'react';
import background from './assests/background.png';
import defaulter from './assests/default.jpg';
import { IoSend } from "react-icons/io5";
import { formatTimestamp } from './data/formatTime';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  
  orderBy
} from 'firebase/firestore';
import { db } from './firebase/firebase';

const Chatbox = ({ chatting, currentuser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentEmail = currentuser?.email;
  const scrollRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Create combined ID
  const combinedId =
    currentuser.uid > chatting.uid
      ? currentuser.uid + chatting.uid
      : chatting.uid + currentuser.uid;

  // Fetch messages in real-time
  useEffect(() => {
    const setupChat = async () => {
      const chatQuery = query(
        collection(db, "chatting"),
        where("id", "==", combinedId)
      );

      const snapshot = await getDocs(chatQuery);

      let chatDocRef;

      if (!snapshot.empty) {
        chatDocRef = snapshot.docs[0].ref;
      } else {
        const newChat = await addDoc(collection(db, "chatting"), {
          id: combinedId,
          users: [currentuser.uid, chatting.uid],
          createdAt: new Date()
        });
        chatDocRef = newChat;
      }

      // Listen for messages in subcollection
      const messagesRef = collection(chatDocRef, "messages");
      const q = query(messagesRef, orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach(doc => {
          msgs.push(doc.data());
        });
        setMessages(msgs);
      });

      return () => unsubscribe();
    };

    if (currentuser?.uid && chatting?.uid) {
      setupChat();
    }
  }, [chatting, currentuser, combinedId]);

  // Send new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      sender: currentEmail,
      text: newMessage,
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };

    setNewMessage("");

    const chatQuery = query(
      collection(db, "chatting"),
      where("id", "==", combinedId)
    );
    const snapshot = await getDocs(chatQuery);

    if (!snapshot.empty) {
      const chatDocRef = snapshot.docs[0].ref;
      const messagesRef = collection(chatDocRef, "messages");
      await addDoc(messagesRef, msg);
    }
  };

  return (
    <div
      className='h-[90vh] md:h-screen w-full border flex flex-col relative'
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Header */}
      <div className='flex gap-3 items-center border-b p-4 py-3 bg-white/80 backdrop-blur shadow'>
        <img src={chatting.image || defaulter} alt="Profile" className='md:w-[45px] md:h-[45.5px] w-12 h-12 rounded-full object-cover' />
        <div>
          <h1 className='text-green-800 font-bold heads'>{chatting.fullName}</h1>
          <p className='text-green-700 text-sm'>{chatting.email}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto px-4 py-2 space-y-4 pb-15' ref={scrollRef}>
        {messages.map((msg, idx) => (
          msg.sender !== currentEmail ? (
            <div className='flex items-end gap-2 max-w-[80%]' key={idx}>
              <img src={chatting.image || defaulter} className='w-8 h-8 rounded-full object-cover' alt="User" />
              <div>
                <div className='bg-white border p-2 rounded-xl shadow text-sm text-black'>
                  {msg.text}
                </div>
                <p className='text-gray-400 text-xs mt-1'>{formatTimestamp(msg.timestamp)}</p>
              </div>
            </div>
          ) : (
            <div className='flex justify-end' key={idx}>
              <div className='flex items-end gap-2 max-w-[80%]'>
                <div>
                  <div className='bg-green-200 border p-2 rounded-xl shadow text-sm text-black'>
                    {msg.text}
                  </div>
                  <p className='text-gray-400 text-xs mt-1 text-right'>{formatTimestamp(msg.timestamp)}</p>
                </div>
                <img src={defaulter} className='w-8 h-8 rounded-full object-cover' alt="Sender" />
              </div>
            </div>
          )
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className='bg-white p-2 flex items-center gap-2 border-t absolute bottom-0 w-full'
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          className='flex-1 h-10 rounded-l-full px-4 border border-green-300 outline-none text-sm'
          placeholder='Type your message...'
        />
        <button type="submit" className='bg-green-500 hover:bg-green-600 transition text-white p-2 rounded-r-full h-10 flex items-center justify-center'>
          <IoSend className='text-xl' />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
