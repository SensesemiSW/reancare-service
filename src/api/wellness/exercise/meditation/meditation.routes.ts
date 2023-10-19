/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MeditationController } from './meditation.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MeditationController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/wellness/exercise/meditations', router);
};
