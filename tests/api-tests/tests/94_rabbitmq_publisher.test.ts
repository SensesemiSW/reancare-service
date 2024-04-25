import request from 'supertest';
import { assert } from 'chai';
import { setTestData, getTestData } from '../../api-tests/init';
import chai from 'chai'
const expect = chai.expect;
import sinon from 'sinon'
import { getRabbitMQConnection } from '../../../src/rabbitmq/rabbitmq.connection';
import { getBackgroundRabbitMQConnection } from '../../../src.bg.worker/src.bg/rabbitmq/rabbitmq.connection';
import * as RabbitMQ from '../../../src/rabbitmq/rabbitmq.connection';
import * as BgRabbitMQ from '../../../src.bg.worker/src.bg/rabbitmq/rabbitmq.connection';
import { before, after, beforeEach, describe, it, afterEach } from 'mocha';
// import { publishAwardEventToQueue } from '../../../src/rabbitmq/rabbitmq.publisher';
import Application from '../../../src/app';

const infra = Application.instance();


describe('publish message tests', () => {

    let getRabbitMQConnectionStub;
    let createChannelStub;
    let assertQueueStub;
    let sendToQueueStub;
    let closeChannelStub;

    beforeEach(() => {
        createChannelStub = sinon.stub().resolves({
            assertQueue: assertQueueStub = sinon.stub().resolves(),
            sendToQueue: sendToQueueStub = sinon.stub().resolves(),
            close: closeChannelStub = sinon.stub().resolves()
        });

        sinon.stub(RabbitMQ, 'getRabbitMQConnection').returns({
            createChannel: createChannelStub
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should publish a message to the queue', async () => {
        const queueName = 'test_queue';
        const message = {
            name: 'johnny1',
            age: '35'
        };

        await publishAwardEventToQueue(queueName, message);
        await new Promise(resolve => setTimeout(resolve, 500));

        assert.isTrue(createChannelStub.calledOnce, 'createChannel should be called once');
        assert.isTrue(assertQueueStub.calledOnceWithExactly(queueName, { durable: true }), 'assertQueue should be called with correct arguments');
        assert.isTrue(sendToQueueStub.calledOnceWithExactly(queueName, sinon.match.instanceOf(Buffer), { persistent: true }), 'sendToQueue should be called with correct arguments');
        assert.isTrue(closeChannelStub.calledOnce, 'close should be called once');
    });

});


export async function publishAwardEventToQueue(queueName: string, message: any): Promise<void> {
    try {
        const connection = RabbitMQ.getRabbitMQConnection();
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        const messageBuffer = Buffer.from(JSON.stringify(message));

        await channel.sendToQueue(queueName, messageBuffer, { persistent: true });

        console.log('Message published to RabbitMQ queue', message);

        // Close the channel
        await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

// async function consumeAwardFromQueue(queueName: string): Promise<void> {
//     try {
//         const connection = RabbitMQ.getRabbitMQConnection();
//         const channel = await connection.createChannel();
//         await channel.assertQueue(queueName, { durable: true });

//         channel.consume(queueName, async (message) => {
//             if (message !== null) {
//                 try {
//                     const messageContent = JSON.parse(message.content.toString());
//                     console.log('message received from queue:', messageContent);
//                     // Process the message here
//                     channel.ack(message); // Now this should work with the stubbed method
//                 } catch (error) {
//                     console.error('Error processing message from RabbitMQ:', error);
//                 }
//             }
//         });

//         console.log('Consumer started on queue:', queueName);
//     } catch (error) {
//         console.error('Error consuming messages from RabbitMQ:', error);
//     }
// }