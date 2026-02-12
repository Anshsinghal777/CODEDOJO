

import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import fetchIdByName from "../../tester2.js";
import {submitBatch} from "../utils/ProblemUtility.js";
import {submitToken} from "../utils/ProblemUtility.js";

 export const submitCode = async (req, res) => {

try{
const userId = req.user._id;
    const problemId = req.params.id;

    const { code, language } = req.body;
    if (!code || !language || !problemId || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const problem = await Problem.findById(problemId);

const submittedResult = await Submission.create({
    userId,
    problemId,
    code,
    language,
    status: 'pending',
    runtime: 0,
    testCasesTotal: problem.visibleTestCases.length + problem.hiddenTestCases.length,

});


const langId = fetchIdByName(language);
const submissions = [];

      for (const testCase of problem.visibleTestCases) {
        submissions.push({
          language_id: langId,
          source_code: code,
          stdin: testCase.input,
          expected_output: testCase.output
        });
      }

      
          const submitResult = await submitBatch(submissions);
          const tokens = submitResult.map(r => r.token);
          const testResult = await submitToken(tokens);



          let testCasesPassed = 0;
          let runtime = 0;
          let memory = 0;
          let status = 'accepted';
          let errorMessage = null;

            for (const test of testResult) {
if (test.status?.id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
              }else {
                if(test.status?.id === 4){
                   
                     status = 'error';
                     errorMessage = test.stderr;

              }else{
        status = 'wrong';
         errorMessage = test.stderr;

              }

            }

}
            submittedResult.status = status;
            submittedResult.runtime = runtime;
            submittedResult.memory = memory;
            submittedResult.testCasesPassed = testCasesPassed;
            submittedResult.errorMessage = errorMessage ;
            await submittedResult.save();
         if(   !req.user.problemSolved.includes(problemId)) {
          req.user.problemSolved.push(problemId);
          await req.user.save();
         }
            res.status(200).json({ message: 'Submission evaluated' });
}
catch(err){
    res.status(500).json({ message: 'Server Error', error: err.message });
}

}


export const runCode = async (req,res)=>{

try{
const userId = req.user._id;
    const problemId = req.params.id;

    const { code, language } = req.body;
    if (!code || !language || !problemId || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const problem = await Problem.findById(problemId);




const langId = fetchIdByName(language);
const submissions = [];

      for (const testCase of problem.visibleTestCases) {
        submissions.push({
          language_id: langId,
          source_code: code,
          stdin: testCase.input,
          expected_output: testCase.output
        });
      }

      
          const submitResult = await submitBatch(submissions);
          const tokens = submitResult.map(r => r.token);
          const testResult = await submitToken(tokens);



         

              

            

         
            res.status(200).json({ message:  testResult });
}
catch(err){
    res.status(500).json({ message: 'Server Error', error: err.message });
}
  
}
