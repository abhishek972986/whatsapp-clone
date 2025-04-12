import React from 'react';
import logo from './assests/logo.png';

// ✅ Import React Icons properly
import { BsChatLeft } from 'react-icons/bs';
import { FaRegStar } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiGeminiFill } from 'react-icons/ri';
import { MdOutlinePowerSettingsNew, MdOutlineArrowDropDown } from 'react-icons/md';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/firebase';
const Navlinks = () => {
const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}


  return (
    <div className="flex w-full h-[70px] md:h-screen md:w-[80px] bg-green-500 px-3 py-2 sm:px-4 md:flex-col md:justify-start justify-between items-center gap-4">
      
      {/* Logo */}
      <div className='md:w-full  border-white md:mb-2 md:border-b-2 md:border-white md:pb-2'>
      <div className="bg-white rounded-2xl p-2 flex justify-center items-center">
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
      </div>
      </div>
      {/* Navigation Icons */}
      <ul className="flex gap-4 md:gap-6 md:flex-col text-white text-xl sm:text-2xl">
        <li className="hover:scale-105 transition"><BsChatLeft title="Chat" /></li>
        <li className="hover:scale-105 transition"><FaRegStar title="Favorites" /></li>
        <li className="hover:scale-105 transition"><IoSettingsOutline title="Settings" /></li>
        <li className="hover:scale-105 transition"><RiGeminiFill title="AI Assistant" /></li>
        <li className="hover:scale-105 transition"><IoMdNotificationsOutline title="Notifications" /></li>
        <li className="hover:scale-105 transition"><MdOutlinePowerSettingsNew title="Logout" onClick={handleLogout}/></li>
      </ul>

      {/* Dropdown for mobile */}
      <div className="block md:hidden">
        <MdOutlineArrowDropDown className="text-white text-2xl" />
      </div>
    </div>
  );
};

export default Navlinks;
