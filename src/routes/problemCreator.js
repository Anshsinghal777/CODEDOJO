
import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import userMiddleware from '../middleware/userMiddleware.js';
import {createProblem , updateProblem, deleteProblem, getProblemById , getAllProblem,solvedProblemsByUser} from '../controllers/userProblem.js';



const problemRouter = express.Router();

// create
problemRouter.post('/create', adminMiddleware, createProblem);
problemRouter.put('/update/:id',adminMiddleware, updateProblem);
problemRouter.delete('/delete/:id',adminMiddleware, deleteProblem);




problemRouter.get('/:id', userMiddleware,getProblemById);
problemRouter.get('/',userMiddleware, getAllProblem);              

problemRouter.get('/user',userMiddleware, solvedProblemsByUser);

// fetch
// update
// delete





export default problemRouter;
