import React, { useEffect, useState } from 'react';
import Register from './Register';
import Signin from './Signin';
import Navlinks from './Navlinks';
import Chatbox from './Chatbox';
import Chatlists from './Chatlists';
import { auth, db } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

const App = () => {
  const [islogin, setlogin] = useState(true);
  const [user, setuser] = useState(null);
const [chatting, setchatting] = useState({
  username:"hm",
email:"hm@gmail.com"
})



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setuser(null);
        return;
      }

      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || 'No Name',
            photoURL: firebaseUser.photoURL || '',
            username: firebaseUser.email.split('@')[0],
            uid: firebaseUser.uid,
            status: "online",
            lastSeen: new Date(),
            lastMessage: "",
            lastMessageTimestamp: new Date()
          });
          console.log("✅ New user added to Firestore.");
        } else {
          console.log("👀 User already exists in Firestore.");
        }

        // Get the latest data from Firestore
        const finalUserSnap = await getDoc(userRef);
        setuser({ ...finalUserSnap.data(), docId: firebaseUser.uid });

      } catch (error) {
        console.error("⚠️ Error handling user:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <div className='flex flex-col md:flex-row items-start w-full min-h-screen'>
          <Navlinks />
          <Chatlists currentuser={user} setchatting={setchatting}/>
          <Chatbox  chatting={chatting} currentuser={user}/>
        </div>
      ) : (
        <div>
          {islogin ? (
            <Register islogin={islogin} setlogin={setlogin} />
          ) : (
            <Signin islogin={islogin} setlogin={setlogin} />
          )}
        </div>
      )}
    </>
  );
};

export default App;
