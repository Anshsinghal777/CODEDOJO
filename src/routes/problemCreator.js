
import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import createProblem from '../controllers/userProblem.js';



const problemRouter = express.Router();

// create
problemRouter.post('/create', adminMiddleware, createProblem);
// problemRouter.patch('/:id', updateProblem);
// problemRouter.delete('/:id', deleteProblem);




// problemRouter.get('/:id', getProblemById);
// problemRouter.get('/', getAllProblem);

// problemRouter.get('/user', solvedProblemsByUser);

// fetch
// update
// delete





export default problemRouter;
