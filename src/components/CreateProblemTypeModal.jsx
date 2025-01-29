import React, { useState } from "react";
import { createProblemType } from "../api/problemApi.js";

const CreateProblemTypeModal = ({ isOpen, onClose, onSubmit }) => {
  const [problemTypeData, setProblemTypeData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblemTypeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response=await createProblemType(problemTypeData);
    setProblemTypeData({ name: "", description: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-customGray text-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create Problem Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Problem Type Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={problemTypeData.name}
              onChange={handleChange}
              className="mt-1 block p-2 w-full h-8 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={problemTypeData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 p-2 block w-full h-18 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              required
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

export default CreateProblemTypeModal;
