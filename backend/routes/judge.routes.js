import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/run", async (req, res) => {
    const { code, language, testcases } = req.body;

    const langMap = {
        cpp: 54,
        java: 62,
        python: 71,
        javascript: 63,
    };

    const language_id = langMap[language];
    const results = [];

    for (let tc of testcases) {
        try {
            const submission = await axios.post(
                "https://judge0-ce.p.rapidapi.com/submissions?wait=true",
                {
                    source_code: code,
                    language_id,
                    stdin: tc.input,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-RapidAPI-Key": process.env.JUDGE0_KEY,
                        "X-RapidAPI-Host":
                            "judge0-ce.p.rapidapi.com",
                    },
                }
            );

            const output = submission.data.stdout?.trim() || "";

            results.push({
                input: tc.input,
                expected: tc.expected,
                actualOutput: output,
                passed: output === tc.expected.trim(),
            });
        } catch (error) {
            results.push({
                input: tc.input,
                expected: tc.expected,
                actualOutput: "ERROR",
                passed: false,
            });
        }
    }

    res.json({ results });
});

export default router;
