import express from 'express';
import PromisingController from '../controllers/promising-controller';

const promisingRouter = express.Router();

promisingRouter.get('/', PromisingController.base);
promisingRouter.post('/', PromisingController.create)

export default promisingRouter;

