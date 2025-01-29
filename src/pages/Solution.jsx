import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AiFillDelete } from "react-icons/ai";
import axios from 'axios';
import { useQuery, useQueryClient, useMutation } from 'react-query';

import { getAllSolutionByProblemName, deleteSolution } from '../api/solutionApi.js';

import { useModalContext } from '../context/modalContext/modalContext.js';
import CreateSolutionModal from '../components/CreateSolutionModal.jsx';
import { useProblemContext } from '../context/problemContext/problemContext.js';

const Solution = () => {
    const { problemName } = useParams();


    const { currentSolutions, dispatch } = useProblemContext();
    const { toggleCreateSolutionModal, isCreateSolutionModalOpen } = useModalContext();

    const queryClient = useQueryClient();

    const { data: solutions, isLoading, isError } = useQuery(
        ['solutions', problemName],
        () => getAllSolutionByProblemName(problemName),
        {
            onSuccess: (data) => {
                console.log(data.data.solutions)
                dispatch({ type: 'SET_CURRENT_SOLUTIONS', payload: data.data.solutions });
            },
            onError: (error) => {
                console.error('Error fetching solutions:', error);
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: true,
        }
    );


    const deleteSolutionMutation = useMutation(
        (solutionId) => deleteSolution(solutionId),
        {
            onSuccess: (data, solutionId) => {

                queryClient.invalidateQueries(['solutions', problemName]);

                dispatch({ type: 'DELETE_SOLUTION', payload: solutionId });
            },
            onError: (error) => {
                console.error('Error deleting solution:', error);
            },
        }
    );

    const handleDelete = (selectedSolution) => {
        deleteSolutionMutation.mutate(selectedSolution._id);
    };

    if (isLoading) {
        return <div className="text-white">Loading solutions...</div>;
    }

    if (isError) {
        return <div className="text-white">Error fetching solutions.</div>;
    }

    return (
        <div className={`solution-page w-full min-h-screen bg-customDark text-white p-5`}>
            <div className="inner-container flex flex-col gap-6 items-center justify-center">
                <div className="header">
                    <h1 className="text-4xl font-bold">{problemName}</h1>
                    <button
                        className="bg-customGray absolute top-[80px] right-4 w-32 h-10 font-semibold hover:bg-white hover:text-black rounded-md transform transition-transform hover:scale-105"
                        onClick={toggleCreateSolutionModal}
                    >
                        Add solution
                    </button>
                </div>

                {currentSolutions.length === 0 ? (
                    <div>
                        <p>No solutions available for this problem yet.</p>
                    </div>
                ) : (
                    <div className="solution-section flex flex-col gap-6 w-4/6 p-6 rounded-lg bg-customGray">
                        {currentSolutions.map((solution, index) => (
                            <div
                                key={solution._id}
                                className="flex flex-col items-center gap-6 pb-6 px-3 border-b border-white last:border-b-0"
                            >
                                <div className="method flex items-center justify-between w-full">
                                    <h2 className="text-3xl font-bold">
                                        {index + 1}. {solution.methodName}
                                    </h2>
                                    <AiFillDelete size={28} className='bg-customDark p-1 hover:text-customDark hover:bg-white rounded-md cursor-pointer' onClick={() => handleDelete(solution)} />
                                </div>
                                {/* Code Snippet */}
                                <div className="code-snippet w-full">
                                    <SyntaxHighlighter
                                        language={solution.language.toLowerCase()}
                                        style={vscDarkPlus}
                                        className="w-full"
                                        codeTagProps={{
                                            style: { fontSize: "0.9rem" },
                                        }}
                                    >
                                        {solution.code}
                                    </SyntaxHighlighter>
                                </div>

                                {/* YouTube Video */}
                                {solution.youtubeLink && (
                                    <div className="youtube-video w-full">
                                        <iframe
                                            className="w-full aspect-video"
                                            src={solution.youtubeLink.replace('watch?v=', 'embed/')}
                                            title="YouTube Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}

                                {/* Time and Space Complexity */}
                                <div className="complexities w-full p-4 bg-opacity-50 bg-customDark rounded">
                                    <p className="mb-2">
                                        <strong>Time Complexity:</strong> {solution.timeComplexity}
                                    </p>
                                    <p>
                                        <strong>Space Complexity:</strong> {solution.spaceComplexity}
                                    </p>
                                </div>

                                {/* Note Section */}
                                <div className="note w-full p-4 bg-opacity-50 bg-customDark rounded">
                                    <p>
                                        <strong>Note:</strong> {solution.note}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {isCreateSolutionModalOpen && (
                <CreateSolutionModal isOpen={isCreateSolutionModalOpen} onClose={toggleCreateSolutionModal} />
            )}
        </div>


    );
};

export default Solution;
