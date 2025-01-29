import React, { useState } from 'react';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useModalContext } from '../context/modalContext/modalContext.js';
import { useAuthContext } from '../context/authContext/authContext.js';
import ProfileModal from './ProfileModal.jsx';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    toggleCreateProblemModal,
    toggleProfileModal,
    isProfileModalOpen
  } = useModalContext();

  const {authUser}=useAuthContext();

  return (
    <div className="relative">
      <div className="bg-customGray h-14 w-full flex justify-between items-center p-2 px-4">
        <h1 className="text-white text-2xl">DSA Tracker App</h1>
        <div className="settings flex gap-3 justify-between items-center">
          <AiOutlinePlusCircle
            color="white"
            size={26}
            className="cursor-pointer"
            onClick={toggleCreateProblemModal}
          />
          <div className="profile relative flex justify-center items-center w-6 h-6 font-semibold text-black text-xl rounded-xl bg-white cursor-pointer"
          onClick={toggleProfileModal}>
            <span>{authUser?.username.charAt(0).toUpperCase()}</span>
            {isProfileModalOpen && <ProfileModal />}
          </div>
        </div>

      </div>   
    </div>
  );
};

export default Header;
