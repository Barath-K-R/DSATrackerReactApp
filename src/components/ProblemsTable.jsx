import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { AiFillStar } from "react-icons/ai";
import { GoCheck } from "react-icons/go";
import { AiFillMinusCircle } from "react-icons/ai";
import { BsArrowUpRight, BsCameraVideoFill } from "react-icons/bs";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { FaSort } from "react-icons/fa";

import { deleteProblem } from '../api/problemApi.js';
import { useModalContext } from '../context/modalContext/modalContext.js';
import { useProblemContext } from '../context/problemContext/problemContext.js';

const ProblemsTable = ({ type, handleStarClick, handleStatusClick }) => {
    const [problemSortOrder, setproblemSortOrder] = useState(0);
    const [difficultySortOrder, setdifficultySortOrder] = useState(0);

    const { groupedProblems, activeType, randomProblem, dispatch } = useProblemContext();
    const { toggleTypeSelectionModal } = useModalContext();

    const handleProblemSort = () => {
        setproblemSortOrder(prev => {
            return prev === 0 ? 1 : prev === 1 ? -1 : 0;
        })
        dispatch({ type: "SORT_GROUPED_PROBLEMS_BY_NAME", payload: { type: type.name, order: problemSortOrder } })
    }
    const handleDifficultySort = () => {
        setdifficultySortOrder(prev => {
            return prev === 0 ? 1 : prev === 1 ? -1 : 0;
        })
        dispatch({ type: "SORT_PROBLEMS_BY_DIFFICULTY", payload: { type: type.name, order: difficultySortOrder } })
    }

    const handleRemoveProblem = async (problem) => {
        await deleteProblem(problem._id);
        dispatch({
            type: "REMOVE_PROBLEM",
            payload: { problemId: problem._id, type: problem.type.name },
        });
        dispatch({ type: "UPDATE_STATS_TOTAL_COUNT", payload: { difficulty: problem.difficulty, operation: -1 } })

    };

    return (
        <>
            {randomProblem && (
                <div className="random-problem-table w-full overflow-hidden transform transition-all duration-500 ease-in-out rounded-lg z-10 mb-6">
                    <table className="problem-table w-full text-white bg-customGray rounded-lg text-left">
                        <thead>
                            <tr className="h-12">
                                <th className="px-4 py-2 text-center">Status</th>
                                <th className="px-4 py-2 text-center">Star</th>
                                <th className="px-4 py-2 text-start">Problem Name</th>
                                <th className="px-4 py-2 text-center">Difficulty</th>
                                <th className="px-4 py-2 text-center">Solution</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                key={randomProblem._id}
                                className={`table-row border-t border-b border-gray-500 h-12 ${randomProblem.isCompleted ? 'bg-[#214b52]' : 'bg-customGray'}`}
                            >
                                <td className="status">
                                    <div className="status-container flex justify-center items-center">
                                        <div
                                            className={`tick w-5 h-5 flex justify-center items-center ${randomProblem.isCompleted ? 'bg-green-500' : 'border border-gray-200'} rounded-md cursor-pointer`}
                                            onClick={() => handleStatusClick(randomProblem)}
                                        >
                                            {randomProblem.isCompleted && <GoCheck className="tick-icon glow" color="white" size={19} />}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="star-container flex justify-center cursor-pointer">
                                        <AiFillStar
                                            className="star"
                                            size={22}
                                            color={randomProblem.isFavourite ? "orange" : "white"}
                                            style={{
                                                stroke: "orange",
                                                strokeWidth: 2,
                                            }}
                                            onClick={() => handleStarClick(randomProblem)}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <a
                                        className="table-text flex justify-start px-4"
                                        href={randomProblem.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {randomProblem.name}
                                    </a>
                                </td>
                                <td>
                                    <div className="difficulty-container flex justify-center">
                                        <span className={`${randomProblem.difficulty === "Easy"
                                            ? "text-easy"
                                            : randomProblem.difficulty === "Medium"
                                                ? "text-medium"
                                                : "text-hard"
                                            }`}>{randomProblem.difficulty}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="outer w-full flex justify-center">
                                        <div className="solution w-2/6 h-8 flex items-center justify-center rounded-2xl hover:bg-customDark">
                                            <Link to={`/solution/${randomProblem.name}`} className="solution-link">
                                                <BsCameraVideoFill color="white" />
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {!randomProblem && <div className={`table-div w-full overflow-hidden transform transition-all duration-500 ease-in-out rounded-lg z-10`}>
                <table className="problem-table w-full text-white bg-customGray rounded-lg text-left">
                    <colgroup>
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "5%" }} />
                    </colgroup>
                    <thead>
                        <tr className="h-12">
                            <th className="px-4 py-2 text-center">Status</th>
                            <th className="px-4 py-2 text-center">Star</th>
                            <th className="px-4 py-2 text-start">
                                <div className={`problem-name flex gap-2 cursor-pointer transition-colors duration-500 hover:text-purple-700 
                                ${problemSortOrder === 0 ? 'items-center' : problemSortOrder === 1 ? 'items-start' : 'items-end'}`} onClick={handleProblemSort}>
                                    <span>Problem Name</span>
                                    {problemSortOrder === 0 && <FaSort />}
                                    {problemSortOrder === 1 && <BiSolidUpArrow size={11} />}
                                    {problemSortOrder === -1 && <BiSolidDownArrow size={11} />}
                                </div>
                            </th>
                            <th className="px-4 py-2 text-center">
                                <div className={`problem-name flex justify-center gap-2 ${difficultySortOrder === 0 ? 'items-center' : difficultySortOrder === 1 ? 'items-start text-purple-700' : 'items-end text-purple-700'} cursor-pointer transition-colors duration-500 hover:text-purple-700`} onClick={handleDifficultySort}>
                                    <span>Difficulty</span>
                                    {difficultySortOrder === 0 && <FaSort size={11} />}
                                    {difficultySortOrder === 1 && <BiSolidUpArrow size={11} />}
                                    {difficultySortOrder === -1 && <BiSolidDownArrow size={11} />}
                                </div>
                            </th>
                            <th className="px-4 py-2 text-center">Solution</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedProblems[type.name] && groupedProblems[type.name].map((problem) => (
                            <tr
                                key={problem._id}
                                className={`table-row border-t border-b border-gray-500 h-12 ${problem.isCompleted ? 'bg-[#214b52]' : 'bg-customGray'}`}
                            >
                                <td className="status">
                                    <div className="status-container flex justify-center items-center">
                                        <div
                                            className={`tick w-5 h-5 flex justify-center items-center ${problem.isCompleted ? 'bg-green-500' : 'border border-gray-200'} rounded-md cursor-pointer`}
                                            onClick={() => handleStatusClick(problem)}
                                        >
                                            {problem.isCompleted && <GoCheck className="tick-icon glow" color="white" size={19} />}
                                        </div>
                                    </div>

                                </td>
                                <td>
                                    <div className="star-container flex justify-center cursor-pointer">
                                        <AiFillStar
                                            className="star"
                                            size={22}
                                            color={problem.isFavourite ? "orange" : "white"}
                                            style={{
                                                stroke: "orange",
                                                strokeWidth: 2,
                                            }}
                                            onClick={() => handleStarClick(problem)}
                                        />
                                    </div>

                                </td>
                                <td>
                                    <a
                                        className="table-text flex justify-start px-4"
                                        href={problem.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {problem.name}
                                    </a>
                                </td>
                                <td>
                                    <div className="difficulty-container flex justify-center">
                                        <span className={`${problem.difficulty === "Easy"
                                            ? "text-easy"
                                            : problem.difficulty === "Medium"
                                                ? "text-medium"
                                                : "text-hard"
                                            }`}>{problem.difficulty}</span>

                                    </div>
                                </td>
                                <td className="cursor-pointer">
                                    <div className="outer w-full flex justify-center">
                                        <div className="solution w-2/6 h-8 flex items-center justify-center rounded-2xl hover:bg-customDark">
                                            <Link to={`/solution/${problem.name}`} className="solution-link">
                                                <BsCameraVideoFill color='white' />
                                            </Link>
                                        </div>
                                    </div>


                                </td>
                                <td>
                                    <div className="remove-button-wrapper w-full h-full flex justify-center items-center">
                                        <div
                                            className="settings flex justify-center items-center w-6 h-6 hover:bg-customDark rounded-md cursor-pointer"
                                            onClick={() => handleRemoveProblem(problem)}
                                        >
                                            <AiFillMinusCircle color="#e93b20" />
                                        </div>
                                    </div>

                                </td>
                                <td>
                                    <div className="move-button-wrapper w-full h-full flex justify-center items-center">
                                        <div
                                            className="settings flex justify-center items-center w-6 h-6 hover:bg-customDark rounded-md cursor-pointer"
                                            onClick={() => {
                                                toggleTypeSelectionModal();
                                                console.log('problemtomove=', problem)
                                                dispatch({ type: 'SET_PROBLEM_TO_MOVE', payload: problem });
                                            }}
                                        >
                                            <BsArrowUpRight />
                                        </div>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>}
        </>
    )
}

export default ProblemsTable