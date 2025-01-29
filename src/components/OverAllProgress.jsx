import React from 'react'
import ProgressBar from './ProgressBar'
import { useProblemContext } from '../context/problemContext/problemContext'

export const OverAllProgress = () => {

    const { groupedProblems ,stats} = useProblemContext();
    
    const percentage = stats?.overall?.total > 0 ? (stats?.overall.completed / stats?.overall?.total) * 100 : 0;

    if (!stats || !stats.overall) {
        return (
            <div className="flex flex-col w-full items-center gap-3">
                <span className="text-xl">Loading...</span>
            </div>
        );
    }
    
    return (
        <div className='flex flex-col w-full items-center gap-3'>
            <span className='text-xl '>
                {stats?.overall.completed} / {stats?.overall.total}
            </span>
            <ProgressBar
                color="easy"
                width={percentage}
                totalwidth={'full'} />
        </div>
    )
}
