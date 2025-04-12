import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {collection, getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCamXifiXxb__umupQRO6sCG8RRQ96w-rU",
    authDomain: "frontend-20bde.firebaseapp.com",
    projectId: "frontend-20bde",
    storageBucket: "frontend-20bde.firebasestorage.app",
    messagingSenderId: "485781703631",
    appId: "1:485781703631:web:00703a75f7e83e4b9220ba",
    measurementId: "G-9ZMD34E62E"
  };

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)

  export const listenChats =(setchats)=>{
const chatsref = collection(db , 'chats')
const unsubscribe = onSnapshot(chatsref , (snapshot)=>{
    const chats = snapshot.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()
    }))
    setchats(chats)
  })
}

  export {auth , db}