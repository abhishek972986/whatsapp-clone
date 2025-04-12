import React, { useState } from 'react';
import background from './assests/background.png';
import { FaUserCheck } from "react-icons/fa";
import { SlLogin } from "react-icons/sl";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/firebase';

const Signin = ({ setlogin, islogin }) => {
  const [userData, setUserData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuth = async () => {
    const { email, password } = userData;

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error.message);
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
          <h1 className="text-2xl heads sm:text-3xl font-extrabold">Sign In</h1>
          <p className="text-gray-500 text-sm sm:text-base">Welcome back, sign in to chat</p>
        </div>

        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          className="w-full rounded bg-green-100 text-green-900 outline-none p-3 placeholder:text-green-700"
          placeholder="Email..."
        />
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
          className="w-full rounded bg-green-100 text-green-900 outline-none p-3 placeholder:text-green-700"
          placeholder="Password..."
        />

        <button
          className="rounded text-white bg-green-500 w-full p-3 text-lg sm:text-xl font-bold cursor-pointer flex items-center gap-2 justify-center hover:bg-green-600 transition heads"
          onClick={handleAuth}
        >
          Login <SlLogin className="text-xl" />
        </button>

        <div className="text-gray-500 flex justify-center items-center">
          Don’t have an account?
          <span
            className="cursor-pointer bottombar mx-2 text-green-700 font-medium "
            onClick={() => setlogin(!islogin)}
          >
            Register
          </span>
          <FaUserCheck className="ml-1 text-lg" />
        </div>
      </div>
    </div>
  );
};

export default Signin;
