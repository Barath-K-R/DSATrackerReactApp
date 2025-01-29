import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "react-query";

import { createSolution } from "../api/solutionApi.js";

import { AiOutlineClose } from "react-icons/ai";
import { useProblemContext } from "../context/problemContext/problemContext.js";
import { useModalContext } from "../context/modalContext/modalContext.js";

const CreateSolutionModal = ({ isOpen, onClose, onSubmit }) => {
  const [solutionData, setSolutionData] = useState({
    code: "",
    language: "JavaScript",
    timeComplexity: "",
    spaceComplexity: "",
    youtubeLink: "",
    methodName: "",
    note: ""
  });
  const { problemName } = useParams();
  const { toggleCreateSolutionModal } = useModalContext()
  const { currentSolutions, dispatch } = useProblemContext()
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newSolution) => createSolution(newSolution),
    {
      onSuccess: (data) => {
        console.log('solution',data)
        dispatch({
          type: "SET_CURRENT_SOLUTIONS",
          payload: [...currentSolutions, data.data.solution],
        });
        
        setSolutionData({
          code: "",
          language: "JavaScript",
          timeComplexity: "",
          spaceComplexity: "",
          youtubeLink: "",
          methodName: "",
          note: "",
        });
        toggleCreateSolutionModal();
      },
      onError: (error) => {
        console.error("Error creating solution:", error);
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSolutionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
    mutation.mutate({ ...solutionData, problemName });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-customGray text-white rounded-lg px-6 py-3 w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create Solution</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="codeSubmission" className="block text-sm font-medium">
              Code Submission
            </label>
            <textarea
              id="codeSubmission"
              name="code"
              value={solutionData.code}
              onChange={handleChange}
              rows="5"
              className="mt-1 block p-2 w-full h-20 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={solutionData.language}
              onChange={handleChange}
              className="mt-1 block w-full h-8 rounded-md border text-black border-gray-300 shadow-sm"
              required
            >
              <option value="JavaScript">Java</option>
              <option value="Python">Python</option>
              <option value="Java">JavaScript</option>
              <option value="C++">C++</option>
              <option value="Ruby">Ruby</option>
              <option value="Go">Go</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="methodName" className="block text-sm font-medium">
              Method Name
            </label>
            <input
              type="text"
              id="methodName"
              name="methodName"
              value={solutionData.methodName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 h-8 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              placeholder="e.g, Brute Force"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="timeComplexity" className="block text-sm font-medium">
              Time Complexity
            </label>
            <input
              type="text"
              id="timeComplexity"
              name="timeComplexity"
              value={solutionData.timeComplexity}
              onChange={handleChange}
              className="mt-1 block w-full h-8 p-2 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              placeholder="e.g., O(n)"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="spaceComplexity" className="block text-sm font-medium">
              Space Complexity
            </label>
            <input
              type="text"
              id="spaceComplexity"
              name="spaceComplexity"
              value={solutionData.spaceComplexity}
              onChange={handleChange}
              className="mt-1 block w-full p-2 h-8 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              placeholder="e.g., O(1)"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium">
              Note
            </label>
            <input
              type="text"
              id="note"
              name="note"
              value={solutionData.note}
              onChange={handleChange}
              className="mt-1 block w-full p-2 h-8 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              placeholder="Note"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="youtubeLink" className="block text-sm font-medium">
              YouTube Link
            </label>
            <input
              type="url"
              id="youtubeLink"
              name="youtubeLink"
              value={solutionData.youtubeLink}
              onChange={handleChange}
              className="mt-1 block w-full p-2 h-8 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              placeholder="https://"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSolutionModal;
