// import request from 'supertest';
// import { assert } from 'chai';
// import Application from '../../../src/app';
// import { describe, it } from 'mocha';
// import { setTestData, getTestData } from '../../api-tests/init';
// const chai = require('chai');
// const expect = chai.expect;
// const sinon = require('sinon');
// import { publishAddBloodOxygenSaturationToQueue } from '../../../src/rabbitmq/rabbitmq.publisher'

// const infra = Application.instance();


// describe('publishAddBloodOxygenSaturationToQueue', () => {
//     var agent = request.agent(infra._app);
//     it('should publish message to RabbitMQ queue when creating blood oxygen saturation', async function () {
//         const mockMessage = {
//             PatientUserId: 'mockUserId',
//             Facts: {
//                 VitalName: 'BloodOxygenSaturation',
//                 VitalPrimaryValue: 98,
//                 Unit: '%',
//             },
//             RecordId: 'mockRecordId',
//             RecordDate: new Date(),
//             RecordDateStr: '2024-04-18',
//             RecordTimeZone: 'UTC',
//         };

//         // Stub the publishing function
//         const publishStub = sinon.stub().resolves();
//         sinon.stub(require('../../../src/rabbitmq/rabbitmq.publisher'), 'publishAwardEventToQueue').callsFake(publishStub);

//         // Call the function
//         await publishAddBloodOxygenSaturationToQueue(mockMessage);

//         // Assertions
//         expect(publishStub.calledOnce).to.be.true; // Ensure that publishAwardEventToQueue was called
//         expect(publishStub.calledWith('add_blood_oxygen_saturation_queue', mockMessage)).to.be.true; // Ensure that it was called with the correct arguments

//         // Restore the original function
//         require('../your-module-path').publishAwardEventToQueue.restore();
//     });
// });