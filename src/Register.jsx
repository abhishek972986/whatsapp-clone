import React, { useState } from 'react';
import background from './assests/background.png';
import { FaUserCheck } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { auth, db } from './firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = ({ islogin, setlogin }) => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleAuth = async () => {
    const { fullName, email, password } = userData;

    if (!fullName || !email || !password) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredentials.user;
      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        uid: user.uid,
        username: email.split("@")[0],
        email: email,
        fullName: fullName,
      });

      alert("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div
      className="flex w-full min-h-screen justify-center items-center px-4 sm:px-6"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-t-green-500 border-t-3 flex flex-col gap-5 p-6 sm:p-8 justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl heads sm:text-3xl font-extrabold">Sign Up</h1>
          <p className="text-gray-500 text-sm sm:text-base">Welcome, create an account for chat</p>
        </div>

        <input
          type="text"
          name="fullName"
          value={userData.fullName}
          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
          className="w-full rounded bg-green-100 text-green-900 outline-none p-3 placeholder:text-green-700"
          placeholder="Full Name"
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="w-full rounded bg-green-100 text-green-900 outline-none p-3 placeholder:text-green-700"
          placeholder="Email..."
        />
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          className="w-full rounded bg-green-100 text-green-900 outline-none p-3 placeholder:text-green-700"
          placeholder="Password..."
        />

        <button
          onClick={handleAuth}
          className="rounded text-white bg-green-500 w-full p-3 text-lg sm:text-xl font-bold cursor-pointer flex items-center gap-2 justify-center hover:bg-green-600 transition heads"
        >
          Register <FaUserCheck className="text-xl" />
        </button>

        <div className='text-gray-500 flex justify-center items-center'>
          Already have an account?
          <span
            onClick={() => setlogin(!islogin)}
            className='cursor-pointer bottombar ml-2 text-green-700 font-medium '
          >
            Login
          </span>
          <CiLogin className='ml-1 text-lg' />
        </div>
      </div>
    </div>
  );
};

export default Register;
