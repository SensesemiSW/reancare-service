import * as amqp from 'amqplib';
import { rabbitmqConfig } from '../../../src/rabbitmq/config';
import { initializebgrabbitconsumer } from './rabbitmq.consumer';
import { Logger } from '../../../src/common/logger';
// import { initializebgrabbitconsumer } from './rabbitmq.consumer';
let connection: amqp.Connection;

// Function to initialize RabbitMQ connection
export async function initializeBackgroundRabbitMQ() {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        connection = await amqp.connect(rabbitmqConfig);
        console.log('Connected to BG RabbitMQ');
        await initializebgrabbitconsumer()
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

// Function to get RabbitMQ connection
export function getBackgroundRabbitMQConnection() {
    if (!connection) {
        throw new Error('Background RabbitMQ connection not initialized');
    }
    return connection;
}