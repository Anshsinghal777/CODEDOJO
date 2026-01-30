
import fetchIdByName from "../../tester2.js";
import Problem from "../models/problem.js";
import submitBatch from "../utils/ProblemUtility.js";
import submitToken from "../utils/ProblemUtility.js";
const createProblem =  async (req, res) => {

    try{
         const {title,description,difficulty,tags, 
visibleTestCases, hiddenTestCases, startCode, referenceSolution , problemCreator 
         } =             req.body;

          const submissions = [];


            for (const solution of referenceSolution) {
    const langId = fetchIdByName(solution.language);

    if (langId === 0) {
      throw new Error(`Language not supported: ${solution.language}`);
    }

    for (const testCase of visibleTestCases) {
      submissions.push({
        language_id: langId,
        source_code: solution.completeCode,
        stdin: testCase.input,
        expected_output: testCase.output
      });
    }
  }

  return submissions;
  if(submissions.length === 0){
    return res.status(400).json({message : "No valid reference solutions or test cases provided."});
  }

 const submitResult = await  submitBatch(submissions);


  
}





       catch(err){
        res.status(400).json({message : "Internal Server Error", error : err.message});
    }


}


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

