import React, { createContext, useContext, useState } from 'react'

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {

    const [selectedProblems, setSelectedProblems] = useState([]);

    const toggleProblem = (problem) => {
        setSelectedProblems((prev) => {
            const exists = prev.some(
                (p) => p._id === problem._id
            );

            return exists
                ? prev.filter((p) => p._id !== problem._id)
                : [...prev, problem];
        });
    };

    return (
        <ProblemContext.Provider value={{ selectedProblems, toggleProblem }}>
            {children}
        </ProblemContext.Provider>
    );
};

export const useProblem = () => useContext(ProblemContext);

// export function useProblem() {
//     return useContext(ProblemProvider)
// }

