
import fetchIdByName from "../../tester2.js";
import Problem from "../models/problem.js";
import {submitBatch} from "../utils/ProblemUtility.js";
import {submitToken} from "../utils/ProblemUtility.js";
const createProblem = async (req, res) => {
  try {
    const submissions = [];

    for (const solution of req.body.referenceSolution) {
      const langId = fetchIdByName(solution.language);
      if (!langId) throw new Error("Unsupported language");

      for (const testCase of req.body.visibleTestCases) {
        submissions.push({
          language_id: langId,
          source_code: solution.completeCode,
          stdin: testCase.input,
          expected_output: testCase.output
        });
      }
    }

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map(r => r.token);
    const testResult = await submitToken(tokens);

    for (const test of testResult) {
      if (test.status?.id !== 3) {
        console.log(test.status.id);
        return res.status(400).json({
          message: "Reference solution failed test cases"
        });
      }
    }

    await Problem.create({
      ...req.body,
      problemCreator: req.user._id
    });

    res.status(201).json({ message: "Problem created successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export default createProblem;

































// const submissions= [
//     {
//       "language_id": 46,
//       "source_code": "echo hello from Bash",
//       "stdin": "world",
//        "expected_output": "hello, world"

//     },
//     {
//       "language_id": 123456789,
//       "source_code": "print(\"hello from Python\")",
//        "stdin": "world",
//        "expected_output": "hello, world"


//     },
//     {
//       "language_id": 72,
//       "source_code": "",
//        "stdin": "world",
//        "expected_output": "hello, world"


//     }
//   ]

