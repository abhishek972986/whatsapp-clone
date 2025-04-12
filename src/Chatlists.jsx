import React, { useEffect, useMemo, useState } from 'react';
import defaulter from './assests/default.jpg';
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbUserSearch } from "react-icons/tb";
import { db } from './firebase/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { formatTimestamp } from './data/formatTime';
import SearchModal from './searchModal';

const Chatlists = ({ currentuser, setchatting }) => {
  const [users, setUsers] = useState([]);
  const [openmodel, setOpenmodel] = useState(false);

  const chatslist = async () => {
    if (!currentuser?.uid) return;

    const q = query(collection(db, "chats"), where("owner", "==", currentuser.uid));
    const snapshot = await getDocs(q);
    const chats = [];

    snapshot.forEach((doc) => {
      chats.push(doc.data());
    });

    setUsers(chats);
  };

  useEffect(() => {
    chatslist();
  }, [currentuser]);

  const startChat = async (newUser) => {
    if (!currentuser || !newUser) return;

    const combinedId = currentuser.uid > newUser.uid
      ? currentuser.uid + newUser.uid
      : newUser.uid + currentuser.uid;

    try {
      const chatsRef = collection(db, "chats");

      // Check if chat exists for current user
      const qCurrent = query(chatsRef, where("chatId", "==", combinedId), where("owner", "==", currentuser.uid));
      const currentSnap = await getDocs(qCurrent);

      // Check if chat exists for selected user
      const qNew = query(chatsRef, where("chatId", "==", combinedId), where("owner", "==", newUser.uid));
      const newSnap = await getDocs(qNew);

      if (currentSnap.empty) {
        await addDoc(chatsRef, {
          chatId: combinedId,
          owner: currentuser.uid,
          friend: {
            uid: newUser.uid,
            fullName: newUser.fullName,
            email: newUser.email,
            image: newUser.image || "",
          },
          lastMessage: "",
          lastMessageTimestamp: null,
        });
      }

      if (newSnap.empty) {
        await addDoc(chatsRef, {
          chatId: combinedId,
          owner: newUser.uid,
          friend: {
            uid: currentuser.uid,
            fullName: currentuser.fullName,
            email: currentuser.email,
            image: currentuser.photoURL || "",
          },
          lastMessage: "",
          lastMessageTimestamp: null,
        });
      }

      chatslist();
      setOpenmodel(false);
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };

  const sortedusers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aTime = (a?.lastMessageTimestamp?.seconds || 0) + (a?.lastMessageTimestamp?.nanoseconds || 0) / 1e9;
      const bTime = (b?.lastMessageTimestamp?.seconds || 0) + (b?.lastMessageTimestamp?.nanoseconds || 0) / 1e9;
      return bTime - aTime;
    });
  }, [users]);

  return (
    <div className='md:block hidden h-screen w-[600px] border relative overflow-y-auto'>
      <div className='flex flex-col gap-1'>
        <div className='sticky top-0 bg-white z-10'>
          <div className='flex justify-between items-center border-b p-2'>
            <div className='flex items-center gap-4'>
              <img src={currentuser?.photoURL || defaulter} className='w-[54px] h-[54px] rounded-full object-cover' alt="Profile" />
              <div>
                <h1 className='text-xl font-bold'>{currentuser?.fullName}</h1>
                <p className='text-gray-500'>{currentuser?.email}</p>
              </div>
            </div>
            <div className='p-2 rounded bg-green-200 cursor-pointer'>
              <BsThreeDotsVertical />
            </div>
          </div>

          <div className='flex justify-between items-center p-2'>
            <span>Messages ({users.length})</span>
            <span className='p-2 bg-green-100 rounded-full' onClick={() => setOpenmodel(true)}>
              <TbUserSearch className='text-xl text-green-800' />
            </span>
          </div>
        </div>

        {openmodel && <SearchModal startChat={startChat} setOpenmodel={setOpenmodel} />}

        {sortedusers.map((chat, index) => (
          <div
            key={index}
            className='flex justify-between items-center border-b border-gray-300 p-2 hover:bg-gray-100 transition'
            onClick={() => setchatting(chat.friend)}
          >
            <div className='flex items-center gap-4'>
              <img
                src={chat?.friend?.image || defaulter}
                className='w-[44px] h-[44px] rounded-full object-cover'
                alt={chat?.friend?.fullName || "User"}
              />
              <div>
                <h1 className='font-semibold text-md'>{chat?.friend?.fullName || "Unknown User"}</h1>
                <p className='text-gray-500 text-sm truncate w-60'>{chat.lastMessage || "No message yet"}</p>
              </div>
            </div>
            <div className='text-gray-400 text-xs whitespace-nowrap'>
              {formatTimestamp(chat?.lastMessageTimestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatlists;
