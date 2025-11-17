import React , {createContext, useContext, useState} from 'react'

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {

    const [selectedProblems, setSelectedProblems] = useState([]);

    const toggleProblem = (problem) => {
        setSelectedProblems((prev) => {
            const alreadySelected = prev.find((p) => p.questionFrontendId === problem.questionFrontendId);

            if (alreadySelected) {
                return prev.filter((p) => p.questionFrontendId !== problem.questionFrontendId);
            } else {
                return [...prev, problem];
            }
        });
    };

    return (
        <ProblemContext.Provider value={{ selectedProblems, toggleProblem}}>
            {children}
        </ProblemContext.Provider>
    );
};

export const useProblem = () => useContext(ProblemContext);

// export function useProblem() {
//     return useContext(ProblemProvider)
// }

