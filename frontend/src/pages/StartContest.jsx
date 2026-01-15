import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function StartContest() {

    const { state } = useLocation();
    const {roomName, contestTime, problems } = state || {};
    const navigate = useNavigate();

    console.log("Problmes ids comes start contest", problems);

    // ================ CLICK HANDLER
    const handleProblemClick = (problemId) => {
        navigate(`/user/coding/contest/code-editor/${problemId}`)
    }

   return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center px-4 pt-16">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl p-6">

        {/* ===== HEADER ===== */}
        <div className="border-b border-gray-700 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-center">
            Your Contest {roomName}
          </h1>
          <p className="text-center text-gray-300 mt-2">
            ⏱ Total Time:{" "}
            <span className="font-semibold text-white">
              {contestTime} Minutes
            </span>
          </p>
        </div>

        {/* ===== PROBLEMS LIST ===== */}
        <div className="border border-gray-700 rounded-xl overflow-hidden">

          {/* Header Row */}
          <div className="grid grid-cols-12 bg-gray-700 px-4 py-2 font-semibold">
            <div className="col-span-2">#</div>
            <div className="col-span-7">Problem</div>
            <div className="col-span-3">Difficulty</div>
          </div>

          {/* Rows */}
          {problems?.map((problem) => (
            <div
              key={problem._id}
              onClick={() => handleProblemClick(problem._id)}
              className="grid grid-cols-12 px-4 py-3 border-t border-gray-700 cursor-pointer hover:bg-gray-700 transition"
            >
              <div className="col-span-2">
                {problem.problemNumber}
              </div>

              <div className="col-span-7 capitalize">
                {problem.title}
              </div>

              <div className="col-span-3">
                <span
                  className={
                    problem.difficulty === "Easy"
                      ? "text-green-400"
                      : problem.difficulty === "Medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {problem.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


export default StartContest;