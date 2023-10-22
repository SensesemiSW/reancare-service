/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { CustomTaskController } from './custom.task.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CustomTaskController();

    router.post('/', auth('Users.CustomTask.Create'), controller.create);
    router.put("/:id", auth('Users.CustomTask.Update'), controller.update);
    router.get('/:id', auth('Users.CustomTask.GetById'), controller.getById);

    app.use('/api/v1/custom-tasks', router);
};
