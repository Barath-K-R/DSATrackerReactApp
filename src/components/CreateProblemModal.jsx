import React, { useState, useEffect } from "react";
import { getAllProblemsTypes, createProblem, createProblemType } from "../api/problemApi";
import { useProblemContext } from "../context/problemContext/problemContext";
import { useModalContext } from "../context/modalContext/modalContext";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuthContext } from "../context/authContext/authContext";

const CreateProblemModal = ({ isOpen, onClose, onSubmit }) => {
  const [problemData, setProblemData] = useState({
    name: "",
    difficulty: "Easy",
    link: "",
    type: "",
  });
  const [newType, setNewType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { groupedProblems, problemTypes, dispatch } = useProblemContext();
  const { toggleCreateProblemModal } = useModalContext();
  const {authUser}=useAuthContext();

  const queryClient = useQueryClient();


  const createProblemTypeMutation = useMutation(createProblemType, {
    onSuccess: (newTypeResponse) => {
      console.log(newTypeResponse)
      const newProblemType = newTypeResponse.data.problemType;
      
      dispatch({ type: "SET_PROBLEM_TYPES", payload: [...problemTypes, newProblemType] });
    },
    onError: (error) => {
      console.error("Error creating new problem type:", error);
    },
  });

  const createProblemMutation = useMutation(createProblem, {
    onSuccess: (newProblem) => {
      console.log('newproblem==',newProblem)
      const problemType = problemTypes?.find((p) => p._id === newProblem.data.problem.type)?.name || newType.trim();

      const updatedGroupedProblems = {
        ...groupedProblems,
        [problemType]: [...(groupedProblems[problemType] || []), newProblem.data.problem],
      };

      dispatch({ type: "SET_GROUPED_PROBLEMS", payload: updatedGroupedProblems });
      dispatch({ type: "UPDATE_STATS_TOTAL_COUNT", payload: { difficulty: problemData.difficulty, operation: 1 } });
      dispatch({ type: "SET_ACTIVE_TYPE", payload: problemType });
    },
    onError: (error) => {
      console.error("Error creating new problem:", error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewTypeChange = (e) => {
    setNewType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let selectedTypeId = problemData.type;


    if (problemData.type === "other" && newType.trim()) {
      try {
        const newTypeResponse = await createProblemTypeMutation.mutateAsync({ name: newType.trim(),userId:authUser._id});
        selectedTypeId = newTypeResponse.data.problemType._id;
      } catch (error) {
        console.error("Error creating new problem type:", error);
        return;
      }
    }

    try {
      await createProblemMutation.mutateAsync({ ...problemData, type: selectedTypeId,userId:authUser._id });
      setProblemData({ name: "", difficulty: "Easy", link: "", type: "" });
      setNewType("");
      onClose();
    } catch (error) {
      console.error("Error creating problem:", error);
    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-customGray text-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create Problem</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Problem Name
            </label>
            <input
              type="text"
              name="name"
              value={problemData.name}
              onChange={handleChange}
              className="mt-1 p-2 block w-full h-8 rounded-md border text-black border-gray-300 shadow-sm focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="difficulty" className="block text-sm font-medium">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={problemData.difficulty}
              onChange={handleChange}
              className="mt-1 block w-full h-8 text-black rounded-md border border-gray-300 outline-none shadow-sm"
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="link" className="block text-sm font-medium">
              Link
            </label>
            <input
              type="url"
              name="link"
              value={problemData.link}
              onChange={handleChange}
              className="mt-1 block w-full p-2 h-8 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium">
              Type
            </label>
            <div className="relative">
              <div
                className="mt-1 block w-full flex justify-start items-center h-8 text-white rounded-md border border-gray-300 shadow-sm cursor-pointer"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <div className="p-2 flex justify-start items-center">
                  {problemData.type
                    ? problemData.type === "other"
                      ? "Other"
                      : problemTypes.find((type) => type._id === problemData.type)?.name
                    : "Select a type"}
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-9 right-0 w-full max-h-48 overflow-y-auto border text-black border-gray-300 bg-white rounded-md shadow-lg z-10">
                  {problemTypes.map((type) => (
                    <div
                      key={type._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setProblemData((prevData) => ({
                          ...prevData,
                          type: type._id,
                        }));
                        setIsDropdownOpen(false);
                      }}
                    >
                      {type.name}
                    </div>
                  ))}
                  <div
                    className="p-2 hover:bg-gray-200 cursor-pointer text-red-500"
                    onClick={() => {
                      setProblemData((prevData) => ({ ...prevData, type: "other" }));
                      setIsDropdownOpen(false);
                    }}
                  >
                    Other
                  </div>
                </div>
              )}
            </div>
          </div>

          {problemData.type === "other" && (
            <div className="mb-4">
              <label htmlFor="newType" className="block text-sm font-medium">
                New Type
              </label>
              <input
                type="text"
                name="newType"
                value={newType}
                onChange={handleNewTypeChange}
                className="mt-1 block w-full p-2 h-8 rounded-md border border-gray-300 text-black focus:outline-none shadow-sm"
                required
              />
            </div>
          )}

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

export default CreateProblemModal;
