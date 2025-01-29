import React, { useState } from 'react';

import { AiFillStar } from "react-icons/ai";
import { FaLayerGroup, FaRandom } from "react-icons/fa";
import { useProblemContext } from '../context/problemContext/problemContext';
import { useModalContext } from '../context/modalContext/modalContext';

const ToolBar = () => {
    const [focused, setFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [favouriteFilterOn, setfavouriteFilterOn] = useState(false)
    const { groupedProblems, randomProblem, groupedView, dispatch } = useProblemContext();

    const handleSearchChange = (e) => {
        dispatch({ type: "TOGGLE_GROUP_VIEW", payload: false })
        const query = e.target.value;
        dispatch({ type: "FILTER_GROUPED_PROBLEMS", payload: query });
    };

    const shuffleProblem = () => {
        if (randomProblem) {
            dispatch({ type: "SET_RANDOM_PROBLEM", payload: null });
            dispatch({ type: "TOGGLE_GROUP_VIEW", payload: true });
            return;
        }
        const problemTypesKeys = Object.keys(groupedProblems);
        if (problemTypesKeys.length === 0) return;

        const randomType =
            problemTypesKeys[Math.floor(Math.random() * problemTypesKeys.length)];

        const problems = groupedProblems[randomType];
        if (problems && problems.length > 0) {
            const randomProblem = problems[Math.floor(Math.random() * problems.length)];
            dispatch({ type: "SET_RANDOM_PROBLEM", payload: randomProblem });
            dispatch({ type: "TOGGLE_GROUP_VIEW" });
        }
    };

    const handleFavouriteFilter = () => {
        if (!favouriteFilterOn){
            setfavouriteFilterOn(true)
            dispatch({type:"TOGGLE_GROUP_VIEW",payload:false})
            dispatch({ type: "FILTER_FAVOURITE_PROBLEMS" })
        }
        else {
            setfavouriteFilterOn(false)
            dispatch({ type: "RESET_GROUPED_PROBLEMS" })
        }
    }

    const handleGroupView = () => {
        dispatch({ type: "TOGGLE_GROUP_VIEW", payload: !groupedView })
        dispatch({ type: "SET_RANDOM_PROBLEM", payload: null })
    }

    return (
        <div className='w-full flex  items-center my-2 p-2 pr-4 rounded-sm bg-customGray'>
            <div className="search-problem w-full">
                <input
                    type="text"
                    placeholder='search'
                    className={`bg-customDark p-1 px-2 border border-blue-400 focus:border-blue-500 focus:outline-none focus:w-4/6 transition-all duration-300 ease-in-out ${focused ? 'w-7/12 transform' : 'w-3/12'}`}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="tools flex justify-between items-center gap-5 px-2">
                <div className="star-div flex justify-center items-center hover:bg-customDark w-8 h-8 rounded-md cursor-pointer" onClick={handleFavouriteFilter}>
                    <AiFillStar color="orange" size={24} />
                </div>

                <div className="group-icon flex justify-center items-center w-12 h-8 rounded-2xl border-[3px] border-blue-500 hover:bg-blue-500 cursor-pointer"
                    onClick={handleGroupView}>
                    <FaLayerGroup size={18} />
                </div>
                <div className="group-icon flex justify-center items-center w-12 h-8 bg-blue-500 rounded-lg  hover:bg-blue-400 cursor-pointer"
                    onClick={shuffleProblem}>
                    <FaRandom size={18} />
                </div>
            </div>
        </div>
    );
};

export default ToolBar;
