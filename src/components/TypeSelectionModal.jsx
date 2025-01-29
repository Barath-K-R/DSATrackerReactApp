import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

import { useProblemContext } from '../context/problemContext/problemContext';
const TypeSelectionModal = ({ handleMoveProblem, toggleTypeSelectionModal }) => {
  const { problemTypes, dispatch } = useProblemContext();
  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-customGray p-6 rounded-lg text-white w-96 h-3/6 overflow-auto custom-scrollbar">
        <div className="title flex w-full justify-between items-start ">
          <h2 className="text-xl font-semibold mb-4">Select the type to move this problem:</h2>
          <AiOutlineClose className='relative left-3 top-1  cursor-pointer p-0.5 hover:bg-customDark rounded-md' color='white' size={25} onClick={toggleTypeSelectionModal} />
        </div>

        <ul className="type-list">
          {problemTypes.map((type) => (
            <li
              key={type.name}
              className="type-option px-4 py-2 cursor-pointer hover:bg-customDark rounded-md"
              onClick={() => handleMoveProblem(type.name)}
            >
              {type.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TypeSelectionModal;
