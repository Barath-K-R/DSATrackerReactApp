import React from 'react';
import { logout } from '../api/authApi.js';
import { useModalContext } from '../context/modalContext/modalContext.js';
import { useAuthContext } from '../context/authContext/authContext.js';

const ProfileModal = () => {
    const { toggleProfileModal } = useModalContext();
    const { dispatch } = useAuthContext();

    const handleLogout = async () => {
        toggleProfileModal();
        try {
            const logoutResponse = await logout()
        } catch (error) {
            console.error('Error during logout:', error);
        }
        
        dispatch({ type: 'LOGOUT' });
       
    }
    return (
        <div className="absolute right-2 top-7 bg-white px-2 py-1 text-lg rounded shadow-lg w-28 h-auto z-50">
            <ul className="flex justify-start">
                <li
                    onClick={handleLogout}
                    className="cursor-pointer px-2 text-red-500 hover:text-red-700"
                >
                    Logout
                </li>
            </ul>
        </div>
    );
};

export default ProfileModal;
