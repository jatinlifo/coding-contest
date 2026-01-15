import express from "express";
import axios from "axios";
import { submitCode } from "../controllers/code.controller.js";

const router = express.Router();


router.post("/run", async (req, res) => {
    try {
        const { code, language, testcases } = req.body;

        // ✅ Basic validations
        if (!code || !language || !testcases) {
            return res.status(400).json({
                success: false,
                message: "code, language, testcases are required",
            });
        }

        if (!Array.isArray(testcases) || testcases.length === 0) {
            return res.status(400).json({
                success: false,
                message: "testcases must be a non-empty array",
            });
        }

        const langMap = { cpp: 54, java: 62, python: 71, javascript: 63 };
        const language_id = langMap[language];

        if (!language_id) {
            return res.status(400).json({
                success: false,
                message: `Invalid language. Allowed: ${Object.keys(langMap).join(", ")}`,
            });
        }

        const results = [];

        for (let tc of testcases) {
            try {
                const input = tc?.input ?? "";
                const expected = tc?.expected ?? "";

                const submission = await axios.post(
                    "https://ce.judge0.com/submissions?wait=true",
                    {
                        source_code: code,
                        language_id,
                        stdin: input,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        timeout: 20000, // ✅ avoid hanging
                    }
                );

                const data = submission.data;

                // ✅ collect all possible outputs
                const stdout = (data.stdout || "").trim();
                const stderr = (data.stderr || "").trim();
                const compileOut = (data.compile_output || "").trim();
                const message = (data.message || "").trim();
                const status = data?.status?.description || "Unknown";

                // ✅ final output priority
                const actualOutput = stdout || compileOut || stderr || message || "";

                // ✅ passed logic (only if expected exists)
                const passed =
                    expected !== ""
                        ? actualOutput.trim() === expected.trim()
                        : null;

                results.push({
                    input,
                    expected,
                    actualOutput: actualOutput || "NO OUTPUT",
                    status,
                    passed,
                });
            } catch (error) {
                // ✅ show actual reason in response (debugging friendly)
                results.push({
                    input: tc?.input ?? "",
                    expected: tc?.expected ?? "",
                    actualOutput:
                        error?.response?.data?.message ||
                        error?.message ||
                        "JUDGE ERROR",
                    status: "Judge Error",
                    passed: false,
                });
            }
        }

        // ✅ summary for frontend
        const total = results.length;
        const passedCount = results.filter(r => r.passed === true).length;
        const failedCount = results.filter(r => r.passed === false).length;

        return res.json({
            success: true,
            total,
            passedCount,
            failedCount,
            results,
        });
    } catch (error) {
        console.error("RUN ROUTE ERROR:", error);
        console.log("JUDGE ERROR STATUS:", error?.response?.status);
        console.log("JUDGE ERROR DATA:", error?.response?.data);
        console.log("JUDGE ERROR MSG:", error.message);

        return res.status(500).json({
            success: false,
            message: "Run failed",
        });
    }
});




router.post("/submit", submitCode);

export default router;
