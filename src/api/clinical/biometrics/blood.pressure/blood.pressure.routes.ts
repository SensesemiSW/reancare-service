import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BloodPressureController } from './blood.pressure.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BloodPressureController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/clinical/biometrics/blood-pressures', router);
};
